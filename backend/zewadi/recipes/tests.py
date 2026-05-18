from django.test import TestCase, override_settings
from django.core.cache import cache
from rest_framework.test import APIClient
from .models import FavoriteRecipe, Recipe, RecipeStatus
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


class FavoriteRecipeAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = make_user(email="favorite_user@test.com")
        self.other_user = make_user(email="other_favorite_user@test.com")
        self.author = make_user(email="favorite_author@test.com")
        self.recipe = make_recipe(self.author, title="Favorite Recipe")
        self.other_recipe = make_recipe(self.author, title="Other Favorite Recipe")
        self.draft_recipe = make_recipe(
            self.author,
            title="Unpublished Favorite Recipe",
            status=RecipeStatus.DRAFT,
        )

    def test_favorite_endpoints_require_authentication(self):
        list_response = self.client.get("/api/recipes/favorites/")
        post_response = self.client.post(f"/api/recipes/{self.recipe.id}/favorite/")
        delete_response = self.client.delete(f"/api/recipes/{self.recipe.id}/favorite/")

        self.assertEqual(list_response.status_code, 401)
        self.assertEqual(post_response.status_code, 401)
        self.assertEqual(delete_response.status_code, 401)

    def test_post_creates_single_favorite(self):
        self.client.force_authenticate(user=self.user)

        first = self.client.post(f"/api/recipes/{self.recipe.id}/favorite/")
        second = self.client.post(f"/api/recipes/{self.recipe.id}/favorite/")

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertTrue(second.data["favorited"])
        self.assertEqual(
            FavoriteRecipe.objects.filter(user=self.user, recipe=self.recipe).count(),
            1,
        )

    def test_delete_removes_favorite(self):
        FavoriteRecipe.objects.create(user=self.user, recipe=self.recipe)
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f"/api/recipes/{self.recipe.id}/favorite/")

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["favorited"])
        self.assertFalse(
            FavoriteRecipe.objects.filter(user=self.user, recipe=self.recipe).exists()
        )

    def test_list_returns_only_requesting_users_favorites(self):
        FavoriteRecipe.objects.create(user=self.user, recipe=self.recipe)
        FavoriteRecipe.objects.create(user=self.other_user, recipe=self.other_recipe)
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/recipes/favorites/")

        self.assertEqual(response.status_code, 200)
        recipe_titles = [item["recipe"]["title"] for item in response.data["data"]]
        self.assertEqual(recipe_titles, ["Favorite Recipe"])

    def test_unpublished_recipe_cannot_be_favorited_or_listed(self):
        FavoriteRecipe.objects.create(user=self.user, recipe=self.draft_recipe)
        self.client.force_authenticate(user=self.user)

        post_response = self.client.post(f"/api/recipes/{self.draft_recipe.id}/favorite/")
        list_response = self.client.get("/api/recipes/favorites/")

        self.assertEqual(post_response.status_code, 404)
        self.assertEqual(list_response.data["data"], [])
