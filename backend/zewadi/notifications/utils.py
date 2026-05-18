from django.utils import timezone
from .models import Notification, UserNotificationReceipt
from accounts.models import User


def create_receipts_for_notification(notification) -> None:
    """Create unread receipt rows for every user targeted by a sent notification."""
    if notification.status != "SENT":
        return

    try:
        from accounts.models import User
        from .models import UserNotificationReceipt

        users = User.objects.none()
        target_role = str(notification.target_role or "").upper()
        if target_role == "ALL":
            users = User.objects.all()
        elif target_role:
            users = User.objects.filter(role=target_role)

        existing_user_ids = set(
            UserNotificationReceipt.objects.filter(
                notification=notification,
                user__in=users,
            ).values_list("user_id", flat=True)
        )
        receipts = [
            UserNotificationReceipt(user=user, notification=notification)
            for user in users
            if user.pk not in existing_user_ids
        ]
        if receipts:
            UserNotificationReceipt.objects.bulk_create(receipts, ignore_conflicts=True)
    except Exception:
        pass


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
        sent_at=timezone.now(),
    )

    users = User.objects.filter(
        role__in=["ADMIN", "INTERNAL_STAFF"]
    )

    receipts = []
    for user in users:
        receipts.append(
            UserNotificationReceipt(
                user=user,
                notification=notification,
                is_read=False,
            )
        )

    UserNotificationReceipt.objects.bulk_create(
        receipts,
        ignore_conflicts=True
    )
