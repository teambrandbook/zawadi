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
    try:
        cache.delete_pattern("*:product_list:*")
    except AttributeError:
        # LocMemCache (used in tests) doesn't support delete_pattern — clear all
        try:
            cache.clear()
        except Exception:
            pass
    except Exception:
        logger.warning("Failed to invalidate product list cache", exc_info=True)
