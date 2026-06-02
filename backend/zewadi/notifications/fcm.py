import logging
from collections import defaultdict
from urllib.parse import urljoin, urlsplit

from django.conf import settings

from .models import Notification, PushDevice

logger = logging.getLogger("notifications.fcm")

INVALID_TOKEN_MARKERS = (
    "unregisterederror",
    "registration-token-not-registered",
    "invalid-registration-token",
    "invalid-argument",
)


def _messaging():
    try:
        import firebase_admin
        from firebase_admin import messaging

        try:
            firebase_admin.get_app()
        except ValueError:
            firebase_admin.initialize_app()
        return messaging
    except Exception as exc:
        logger.warning("Firebase messaging is unavailable: %s", exc)
        return None


def _fallback_action_url(user) -> str:
    role = str(getattr(user, "role", "") or "").lower()
    if role in ("admin", "internal_staff"):
        return "/admindashboard/notifications"
    if role == "consultant":
        return "/consultant/notification"
    return "/communityDashBoard/notifications"


def _absolute_click_url(notification: Notification, user) -> str:
    path = notification.action_url or _fallback_action_url(user)
    if not path.startswith("/") or path.startswith("//"):
        path = _fallback_action_url(user)
    base_url = settings.FRONTEND_URL.rstrip("/") + "/"
    return urljoin(base_url, path.lstrip("/"))


def _is_invalid_token_error(exception) -> bool:
    text = f"{exception.__class__.__name__} {getattr(exception, 'code', '')} {exception}".lower()
    return any(marker in text for marker in INVALID_TOKEN_MARKERS)


def send_pushes_for_notification(notification: Notification) -> None:
    if notification.status != "SENT" or not notification.has_channel(Notification.CHANNEL_PUSH):
        return

    messaging = _messaging()
    if messaging is None:
        return

    from .utils import users_for_notification

    devices = PushDevice.objects.filter(
        user__in=users_for_notification(notification),
        is_active=True,
    ).select_related("user")
    devices_by_link = defaultdict(list)
    for device in devices:
        devices_by_link[_absolute_click_url(notification, device.user)].append(device)

    for click_url, grouped_devices in devices_by_link.items():
        for start in range(0, len(grouped_devices), 500):
            batch = grouped_devices[start:start + 500]
            webpush_config = {
                "notification": messaging.WebpushNotification(
                    icon=urljoin(settings.FRONTEND_URL.rstrip("/") + "/", "pwa/icon-192.png"),
                ),
            }
            if urlsplit(click_url).scheme == "https":
                webpush_config["fcm_options"] = messaging.WebpushFCMOptions(link=click_url)

            message = messaging.MulticastMessage(
                tokens=[device.token for device in batch],
                notification=messaging.Notification(
                    title=notification.title,
                    body=notification.body,
                ),
                data={
                    "notification_id": str(notification.pk),
                    "notification_type": notification.notification_type,
                    "action_url": click_url,
                },
                webpush=messaging.WebpushConfig(**webpush_config),
            )
            try:
                response = messaging.send_each_for_multicast(message)
            except Exception:
                logger.exception("Failed to send Firebase push batch for notification %s", notification.pk)
                continue

            invalid_tokens = [
                device.token
                for device, result in zip(batch, response.responses)
                if not result.success and _is_invalid_token_error(result.exception)
            ]
            if invalid_tokens:
                PushDevice.objects.filter(token__in=invalid_tokens).update(is_active=False)
