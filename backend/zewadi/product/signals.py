import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Product

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, instance, **kwargs):
    try:
        cache.delete(f"product_detail:{instance.pk}")
    except Exception:
        logger.warning("Failed to invalidate product detail cache", exc_info=True)
    # Delete all product list keys (Redis/django-redis supports delete_pattern)
    # Fall back to deleting the default no-filter list key for LocMemCache (tests)
    try:
        cache.delete_pattern("*:product_list:*")
    except AttributeError:
        # LocMemCache does not support delete_pattern — delete default key only
        try:
            cache.delete("product_list:::-created_at")
        except Exception:
            logger.warning("Failed to invalidate product list cache (fallback)", exc_info=True)
    except Exception:
        logger.warning("Failed to invalidate product list cache", exc_info=True)
