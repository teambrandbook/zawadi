from django.db import models

# Create your models here.
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.utils.text import slugify
import uuid

from accounts.models import User

# Create your models here.


class RecipeCategory(models.TextChoices):
    BREAKFAST = "breakfast", "Breakfast"
    LUNCH = "lunch", "Lunch"
    DINNER = "dinner", "Dinner"
    SNACK = "snack", "Snack"
    DESSERT = "dessert", "Dessert"
    DRINK = "drink", "Drink"
    OTHER = "other", "Other"


class DifficultyLevel(models.TextChoices):
    EASY = "easy", "Easy"
    MEDIUM = "medium", "Medium"
    HARD = "hard", "Hard"


class RecipeStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PENDING = "pending", "Pending Approval"
    PUBLISHED = "published", "Published"
    REJECTED = "rejected", "Rejected"

class IngredientUnit(models.TextChoices):
    CUPS = "cups", "cups"
    TABLESPOON = "tbsp", "tbsp"
    TEASPOON = "tsp", "tsp"
    GRAM = "g", "g"
    KILOGRAM = "kg", "kg"
    MILLILITER = "ml", "ml"
    LITER = "l", "l"
    PIECE = "piece", "piece"


class Recipe(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")

    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    short_description = models.TextField()
    category = models.CharField(max_length=20, choices=RecipeCategory.choices, default=RecipeCategory.OTHER)
    difficulty_level = models.CharField(max_length=10, choices=DifficultyLevel.choices, default=DifficultyLevel.EASY)

    prep_time_minutes = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    cooking_time_minutes = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    servings = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    cover_image = models.URLField(blank=True, null=True)

    health_benefits = models.TextField(blank=True, null=True)
    buckwheat_wellness_value = models.TextField(blank=True, null=True)
    optional_ingredients = models.TextField(blank=True, null=True)

    calories = models.CharField(max_length=50, blank=True, null=True)
    fat = models.CharField(max_length=50, blank=True, null=True)
    carbs = models.CharField(max_length=50, blank=True, null=True)
    protein = models.CharField(max_length=50, blank=True, null=True)
    video_url = models.URLField(max_length=500, blank=True, null=True)

    is_featured = models.BooleanField(default=False)
    show_in_community = models.BooleanField(default=True)

    status = models.CharField(max_length=12, choices=RecipeStatus.choices, default=RecipeStatus.PENDING)
    published_at = models.DateTimeField(null=True, blank=True)

    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_recipes"
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    rejected_at = models.DateTimeField(
        null=True,
        blank=True
    )

    rejection_reason = models.TextField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["is_featured"]),
            models.Index(fields=["show_in_community"]),
            models.Index(fields=["category"]),
        ]

    

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:180] or "recipe"
            self.slug = f"{base}-{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient_name = models.CharField(max_length=120)
    quantity = models.CharField(max_length=50)
    unit = models.CharField(max_length=20, choices=IngredientUnit.choices, default=IngredientUnit.CUPS)
    note = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.ingredient_name} ({self.quantity} {self.unit})"


class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    step_no = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    description = models.TextField()

    class Meta:
        ordering = ["step_no"]
        unique_together = ("recipe", "step_no")

    def __str__(self):
        return f"{self.recipe.title} - Step {self.step_no}"


class FavoriteRecipe(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorite_recipes",
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name="favorited_by",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("user", "recipe")
        indexes = [
            models.Index(fields=["user", "created_at"], name="recipes_fav_user_id_95c711_idx"),
            models.Index(fields=["recipe"], name="recipes_fav_recipe__a0cfc9_idx"),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.recipe.title}"
    
