import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Product

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, instance, signal=None, **kwargs):
    try:
        cache.delete(f"product_detail:{instance.pk}")
    except Exception:
        logger.warning("Failed to invalidate product detail cache", exc_info=True)
    # Delete all product list keys (Redis/django-redis supports delete_pattern)
    # Fall back to deleting the default no-filter list key for LocMemCache (tests)
    try:
        cache.delete_pattern("product_list:*")
    except AttributeError:
        # LocMemCache does not support delete_pattern — delete default key only
        try:
            cache.delete("product_list:::-created_at:1")
        except Exception:
            logger.warning("Failed to invalidate product list cache (fallback)", exc_info=True)
    except Exception:
        logger.warning("Failed to invalidate product list cache", exc_info=True)

    try:
        if signal is post_save:
            notify_admin_stock_status(instance)
    except Exception:
        logger.warning("Failed to create product stock notification", exc_info=True)


def notify_admin_stock_status(product):
    from django.utils import timezone
    from django.db import connection
    from notifications.models import Notification
    from notifications.utils import create_receipts_for_notification

    notification_columns = {
        column.name
        for column in connection.introspection.get_table_description(
            connection.cursor(),
            Notification._meta.db_table,
        )
    }
    if "delivery_channels" not in notification_columns:
        logger.warning(
            "Skipping product stock notification because notifications migrations are not applied."
        )
        return

    stock = int(product.stock_quantity or 0)
    if stock > 5:
        return

    if stock <= 0:
        title = f"Out of stock: {product.product_name}"
        body = f"{product.product_name} ({product.product_code}) is out of stock."
    else:
        title = f"Low stock: {product.product_name}"
        body = f"{product.product_name} ({product.product_code}) has only {stock} units left."

    existing = Notification.objects.filter(
        title=title,
        body=body,
        target_role="admin",
        status="SENT",
    ).exists()
    if existing:
        return

    notification = Notification.objects.create(
        title=title,
        body=body,
        notification_type="ALERT",
        target_role="admin",
        status="SENT",
        sent_at=timezone.now(),
    )
    create_receipts_for_notification(notification)
