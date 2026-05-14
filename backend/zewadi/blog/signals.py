import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Blog

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Blog)
def invalidate_blog_cache(sender, instance, **kwargs):
    try:
        cache.delete("blog_list_public")
    except Exception:
        logger.warning("Failed to invalidate blog list cache", exc_info=True)
    try:
        cache.delete(f"blog_detail:{instance.pk}")
    except Exception:
        logger.warning("Failed to invalidate blog detail cache", exc_info=True)
