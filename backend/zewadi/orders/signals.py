from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.utils import send_user_notification
from notifications.email import send_notification_email

ORDER_STATUS_MESSAGES = {
    "confirmed": (
        "Order confirmed",
        "Great news! Your order {order_id} has been confirmed and is being processed.",
    ),
    "processing": (
        "Order is being prepared",
        "Your order {order_id} is now being prepared for shipment.",
    ),
    "shipped": (
        "Order shipped",
        "Your order {order_id} has been shipped and is on its way to you.",
    ),
    "delivered": (
        "Order delivered",
        "Your order {order_id} has been delivered. Enjoy your purchase!",
    ),
    "cancelled": (
        "Order cancelled",
        "Your order {order_id} has been cancelled. Contact support if you have questions.",
    ),
}


@receiver(post_save, sender="orders.Order")
def handle_order_status_change(sender, instance, created, **kwargs):
    if created:
        # New order placed notification
        send_user_notification(
            instance.user,
            "Order placed",
            f"Your order {instance.order_id} has been placed successfully.",
            "ALERT",
            "/communityDashBoard/myorders",
        )
        send_notification_email(
            instance.user.email,
            "Order placed — Zawadi",
            f"Your order {instance.order_id} has been placed successfully.\n\nThank you for shopping with Zawadi!",
        )
        return

    old_status = getattr(instance, "_status_before_save", None)
    if old_status is None or old_status == instance.status:
        return

    title, body_template = ORDER_STATUS_MESSAGES.get(instance.status, (None, None))
    if title is None:
        return

    body = body_template.format(order_id=instance.order_id)
    send_user_notification(instance.user, title, body, "ALERT", "/communityDashBoard/myorders")
    send_notification_email(
        instance.user.email,
        f"{title} — Zawadi",
        body,
    )


@receiver(post_save, sender="orders.CustomGiftOrder")
def handle_custom_gift_order_created(sender, instance, created, **kwargs):
    if not created:
        return

    send_user_notification(
        instance.user,
        "Custom gift order placed",
        f"Your custom gift order {instance.custom_gift_id} has been placed successfully.",
        "ALERT",
    )
    send_notification_email(
        instance.user.email,
        "Custom gift order placed - Zawadi",
        (
            f"Your custom gift order {instance.custom_gift_id} has been placed successfully.\n\n"
            "Thank you for shopping with Zawadi!"
        ),
    )
