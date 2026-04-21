from django.contrib import admin
from .models import Recipe, RecipeIngredient, RecipeStep


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1
    fields = ["ingredient_name", "quantity", "unit", "note"]


class RecipeStepInline(admin.TabularInline):
    model = RecipeStep
    extra = 1
    fields = ["step_no", "description"]


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    inlines = [RecipeIngredientInline, RecipeStepInline]
    list_display = [
        "title",
        "author",
        "category",
        "difficulty_level",
        "status",
        "is_featured",
        "created_at",
    ]
    list_filter = ["status", "category", "difficulty_level", "is_featured"]
    search_fields = ["title", "author__email", "author__first_name", "author__last_name"]
    readonly_fields = ["created_at", "updated_at", "published_at"]
    fieldsets = [
        ("Basic Info", {
            "fields": ["author", "title", "short_description", "category", "difficulty_level"],
        }),
        ("Timing & Servings", {
            "fields": ["prep_time_minutes", "cooking_time_minutes", "servings"],
        }),
        ("Media", {
            "fields": ["cover_image"],
        }),
        ("Content", {
            "fields": ["health_benefits", "buckwheat_wellness_value"],
        }),
        ("Tags", {
            "fields": [
                "is_gluten_free",
                "is_high_fiber",
                "is_weight_management",
                "is_energy_boosting",
            ],
        }),
        ("Visibility & Status", {
            "fields": ["is_featured", "show_in_community", "status", "published_at"],
        }),
        ("Timestamps", {
            "fields": ["created_at", "updated_at"],
            "classes": ["collapse"],
        }),
    ]
