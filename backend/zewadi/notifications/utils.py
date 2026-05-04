from django.utils import timezone


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
            sent_at=timezone.now(),
        )
        UserNotificationReceipt.objects.create(user=user, notification=notification)
    except Exception:
        pass
