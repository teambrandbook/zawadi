from django.utils import timezone
from .models import Notification, UserNotificationReceipt
from accounts.models import User
from .email import send_notification_email
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def users_for_notification(notification):
    target_role = str(notification.target_role or "").strip()
    if target_role.upper() == "ALL":
        return User.objects.all()
    if not target_role:
        return User.objects.none()
    if target_role.lower() == "admin":
        return User.objects.filter(role__in=["ADMIN", "admin", "INTERNAL_STAFF", "internal_staff"])
    return User.objects.filter(role__in=[target_role.upper(), target_role.lower()])


def create_receipts_for_notification(notification) -> None:
    """Create unread receipt rows for every user targeted by a sent notification."""

    if notification.status != "SENT":
        return

    if not notification.has_channel(Notification.CHANNEL_IN_APP):
        return

    try:

        users = users_for_notification(notification)

        existing_user_ids = set(
            UserNotificationReceipt.objects.filter(
                notification=notification,
                user__in=users,
            ).values_list("user_id", flat=True)
        )

        receipts = []
        users_to_notify = []

        for user in users:

            if user.pk not in existing_user_ids:

                receipts.append(
                    UserNotificationReceipt(
                        user=user,
                        notification=notification
                    )
                )

                users_to_notify.append(user)

        if receipts:
            UserNotificationReceipt.objects.bulk_create(
                receipts,
                ignore_conflicts=True
            )
            for user in users_to_notify:
                send_realtime_notification(user, notification)

    except Exception as e:
        print(e)

def send_emails_for_notification(notification) -> None:
    if notification.status != "SENT":
        return
    if not notification.has_channel(Notification.CHANNEL_EMAIL):
        return

    for user in users_for_notification(notification):
        send_notification_email(user.email, notification.title, notification.body)


def deliver_notification(notification) -> None:
    create_receipts_for_notification(notification)
    send_emails_for_notification(notification)


def send_user_notification(user, title: str, body: str, notification_type: str = "SYSTEM") -> None:
    """
    Create a targeted Notification for a single user and immediately
    attach a UserNotificationReceipt so it appears in their inbox.
    Silently swallows errors to avoid breaking the caller's transaction.
    """
    try:
        from .models import Notification, UserNotificationReceipt

        role = str(getattr(user, "role", "")).lower() or "community_user"
        notification = Notification.objects.create(
            title=title,
            body=body,
            notification_type=notification_type,
            target_role=role,
            status="SENT",
            delivery_channels=[Notification.CHANNEL_IN_APP],
            sent_at=timezone.now(),
        )
        UserNotificationReceipt.objects.create(user=user, notification=notification)
        send_realtime_notification(user, notification)
    except Exception:
        pass


def send_low_stock_notification(product):
    if not product.enable_low_stock_alerts:
        return

    if product.stock_quantity > product.low_stock_alert:
        return

    title = f"Low Stock Alert - {product.product_name}"

    # Avoid creating repeated alerts while the same product is already low.
    existing_notification = Notification.objects.filter(
        title=title,
        notification_type="ALERT",
        status="SENT",
    ).first()

    if existing_notification:
        return

    notification = Notification.objects.create(
        title=title,
        body=(
            f"Product '{product.product_name}' ({product.product_code}) stock is low. "
            f"Current stock is {product.stock_quantity}."
        ),
        notification_type="ALERT",
        target_role="admin",
        status="SENT",
        delivery_channels=[Notification.CHANNEL_IN_APP],
        sent_at=timezone.now(),
    )

    users = User.objects.filter(
        role__in=["ADMIN", "INTERNAL_STAFF"]
    )

    receipts = []
    users_to_notify = []
    for user in users:
        receipts.append(
            UserNotificationReceipt(
                user=user,
                notification=notification,
                is_read=False,
            )
        )
        users_to_notify.append(user)

    UserNotificationReceipt.objects.bulk_create(
        receipts,
        ignore_conflicts=True
    )
    for user in users_to_notify:
        send_realtime_notification(user, notification)


# WebSocket


def send_realtime_notification(user, notification):

    try:

        channel_layer = get_channel_layer()
        if channel_layer is None:
            return

        async_to_sync(channel_layer.group_send)(
            f"user_{user.id}",
            {
                "type": "send_notification",
                "id": notification.id,
                "title": notification.title,
                "body": notification.body,
                "message": notification.body,
                "notification_id": notification.id,
                "notification_type": notification.notification_type,
                "target_role": notification.target_role,
                "created_at": notification.created_at.isoformat() if notification.created_at else None,
            }
        )

    except Exception:
        pass
