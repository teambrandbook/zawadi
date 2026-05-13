from django.test import TestCase, override_settings
from django.core.cache import cache
from rest_framework.test import APIClient
from .models import Recipe, RecipeStatus
from accounts.models import User
from django.utils import timezone

CACHE_SETTINGS = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "zawadi",
    }
}


def make_user(email="recipe_author@test.com", role="COMMUNITY_USER"):
    return User.objects.create_user(email=email, password="testpass123", role=role)


def make_recipe(author, title="Test Recipe", status=RecipeStatus.PUBLISHED):
    return Recipe.objects.create(
        title=title,
        short_description="Short desc",
        author=author,
        status=status,
        published_at=timezone.now() if status == RecipeStatus.PUBLISHED else None,
        prep_time_minutes=10,
        cooking_time_minutes=15,
        servings=2,
    )


@override_settings(CACHES=CACHE_SETTINGS)
class PublishedRecipeCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.author = make_user()

    def test_second_get_served_from_cache(self):
        make_recipe(self.author, title="Cached Recipe")
        r1 = self.client.get("/api/recipes/published/")
        with self.assertNumQueries(0):
            r2 = self.client.get("/api/recipes/published/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_recipe_save(self):
        r = make_recipe(self.author, title="Save Recipe")
        self.client.get("/api/recipes/published/")   # prime cache
        r.title = "Save Recipe Updated"
        r.save()
        resp = self.client.get("/api/recipes/published/")
        titles = [item["title"] for item in resp.data["data"]]
        self.assertIn("Save Recipe Updated", titles)

    def test_cache_invalidated_on_recipe_delete(self):
        r = make_recipe(self.author, title="Delete Recipe")
        self.client.get("/api/recipes/published/")   # prime cache
        r.delete()
        resp = self.client.get("/api/recipes/published/")
        titles = [item["title"] for item in resp.data["data"]]
        self.assertNotIn("Delete Recipe", titles)

    def test_unpublished_recipe_not_in_cache(self):
        make_recipe(self.author, title="Draft Recipe", status=RecipeStatus.DRAFT)
        r1 = self.client.get("/api/recipes/published/")
        titles = [item["title"] for item in r1.data["data"]]
        self.assertNotIn("Draft Recipe", titles)
