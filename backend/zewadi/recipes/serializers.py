from rest_framework import serializers
from .models import Recipe, RecipeIngredient, RecipeStep
from zewadi.validators import validate_image_upload
import json


class RecipeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = ["id", "ingredient_name", "quantity", "unit", "note"]


class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ["id", "step_no", "description"]


class RecipeListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "difficulty_level",
            "prep_time_minutes",
            "cooking_time_minutes",
            "servings",
            "cover_image",
            "short_description",
            "status",
            "is_featured",
            "created_at",
            "author_name",
        ]

    def get_author_name(self, obj):
        user = obj.author
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.email


class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()
    author_id = serializers.SerializerMethodField()
    author_email = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            "id",
            "slug",
            "title",
            "short_description",
            "category",
            "difficulty_level",
            "prep_time_minutes",
            "cooking_time_minutes",
            "servings",
            "cover_image",
            "health_benefits",
            "buckwheat_wellness_value",
            "is_gluten_free",
            "is_high_fiber",
            "is_weight_management",
            "is_energy_boosting",
            "is_featured",
            "show_in_community",
            "status",
            "published_at",
            "created_at",
            "updated_at",
            "author_id",
            "author_name",
            "author_email",
            "ingredients",
            "steps",
        ]
        read_only_fields = ["id", "slug", "status", "published_at", "created_at", "updated_at"]

    def get_author_name(self, obj):
        user = obj.author
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.email

    def get_author_id(self, obj):
        return obj.author.id

    def get_author_email(self, obj):
        return obj.author.email


class RecipeCreateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, required=False)
    steps = RecipeStepSerializer(many=True, required=False)
    cover_image = serializers.ImageField(required=False, allow_null=True, validators=[validate_image_upload])

    class Meta:
        model = Recipe
        fields = [
            "id",
            "slug",
            "title",
            "short_description",
            "category",
            "difficulty_level",
            "prep_time_minutes",
            "cooking_time_minutes",
            "servings",
            "cover_image",
            "health_benefits",
            "buckwheat_wellness_value",
            "is_gluten_free",
            "is_high_fiber",
            "is_weight_management",
            "is_energy_boosting",
            "is_featured",
            "show_in_community",
            "ingredients",
            "steps",
        ]
        # author and status are set in the view, not accepted from the client
        read_only_fields = ["id", "slug"]

    def to_internal_value(self, data):
        if hasattr(data, "get") and hasattr(data, "keys"):
            mutable = {key: data.get(key) for key in data.keys()}
        else:
            mutable = dict(data)
        for field in ("ingredients", "steps"):
            value = mutable.get(field)
            if isinstance(value, str):
                try:
                    mutable[field] = json.loads(value)
                except json.JSONDecodeError:
                    pass
        return super().to_internal_value(mutable)

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients", [])
        steps_data = validated_data.pop("steps", [])

        recipe = Recipe.objects.create(**validated_data)

        RecipeIngredient.objects.bulk_create([
            RecipeIngredient(recipe=recipe, **ingredient)
            for ingredient in ingredients_data
        ])

        RecipeStep.objects.bulk_create([
            RecipeStep(recipe=recipe, **step)
            for step in steps_data
        ])

        return recipe
