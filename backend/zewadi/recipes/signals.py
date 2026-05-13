import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Recipe

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Recipe)
def invalidate_recipe_cache(sender, instance, **kwargs):
    try:
        cache.delete("published_recipes")
    except Exception:
        logger.warning("Failed to invalidate recipe cache", exc_info=True)
