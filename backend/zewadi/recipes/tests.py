from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Recipe, RecipeStatus


class RecipeSlugAPITests(APITestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            email="recipe-author@example.com",
            password="Pass@1234",
            full_name="Recipe Author",
            user_name="recipeauthor",
            phone="+10000000002",
            role="COMMUNITY_USER",
        )

    def test_published_recipe_detail_uses_slug(self):
        recipe = Recipe.objects.create(
            author=self.author,
            title="Buckwheat Breakfast Bowl",
            short_description="A nourishing bowl",
            category="breakfast",
            prep_time_minutes=10,
            cooking_time_minutes=15,
            servings=2,
            status=RecipeStatus.PUBLISHED,
            show_in_community=True,
        )

        response = self.client.get(f"/api/recipes/{recipe.slug}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], recipe.slug)
        self.assertEqual(response.data["title"], recipe.title)

    def test_hidden_recipe_not_available_publicly(self):
        recipe = Recipe.objects.create(
            author=self.author,
            title="Hidden Recipe",
            short_description="Hidden",
            category="breakfast",
            prep_time_minutes=10,
            cooking_time_minutes=15,
            servings=2,
            status=RecipeStatus.PUBLISHED,
            show_in_community=False,
        )

        response = self.client.get(f"/api/recipes/{recipe.slug}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class RecipeAuthorNameTests(APITestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            email="chef@example.com",
            password="Pass@1234",
            user_name="chef",
            full_name="Amara Osei",
            phone="+10000000020",
            role="ADMIN",
        )
        self.recipe = Recipe.objects.create(
            title="Buckwheat Porridge",
            author=self.author,
            category="breakfast",
            difficulty_level="easy",
            prep_time_minutes=5,
            cooking_time_minutes=10,
            servings=2,
            status="published",
        )

    def test_recipe_list_returns_correct_author_name(self):
        response = self.client.get("/api/recipes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(results[0]["author_name"], "Amara Osei")

    def test_recipe_detail_returns_correct_author_name(self):
        response = self.client.get(f"/api/recipes/{self.recipe.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["author_name"], "Amara Osei")
