from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver


ORDER_MESSAGES = {
    "processing": (
        "Order Being Processed",
        "Your order is now being processed. We'll notify you when it ships.",
    ),
    "shipped": (
        "Order Shipped",
        "Great news! Your order has been shipped and is on its way.",
    ),
    "delivered": (
        "Order Delivered",
        "Your order has been delivered. Enjoy your purchase!",
    ),
    "cancelled": (
        "Order Cancelled",
        "Your order has been cancelled. Contact support if this was unexpected.",
    ),
}


@receiver(pre_save, sender="orders.Order")
def _track_order_prev_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._prev_status = sender.objects.get(pk=instance.pk).status
        except sender.DoesNotExist:
            instance._prev_status = None
    else:
        instance._prev_status = None


@receiver(post_save, sender="orders.Order")
def _notify_order_status_change(sender, instance, created, **kwargs):
    prev = getattr(instance, "_prev_status", None)
    current = instance.status

    if created or prev == current:
        return

    if current in ORDER_MESSAGES:
        from notifications.utils import send_user_notification
        title, body = ORDER_MESSAGES[current]
        send_user_notification(instance.user, title, body)
