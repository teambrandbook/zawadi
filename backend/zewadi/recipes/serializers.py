# serializers.py

import json
from rest_framework import serializers

from .models import (
    DifficultyLevel,
    IngredientUnit,
    Recipe,
    RecipeCategory,
    RecipeIngredient,
    RecipeStep,
)


class RecipeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = [
            "id",
            "ingredient_name",
            "quantity",
            "unit",
            "note",
        ]

        read_only_fields = ["id"]

    def validate_quantity(self, value):
        cleaned = str(value).strip()
        if not cleaned:
            raise serializers.ValidationError("This field may not be blank.")
        return cleaned

    def validate_unit(self, value):
        cleaned = str(value).strip().lower()
        if not cleaned:
            return IngredientUnit.PIECE
        return cleaned


class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = [
            "id",
            "step_no",
            "description",
        ]

        read_only_fields = ["id"]


class RecipeListSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()

    def get_cover_image(self, obj):
        image = getattr(obj, "cover_image", None)
        if not image:
            return None
        request = self.context.get("request")
        image_url = image.url
        return request.build_absolute_uri(image_url) if request else image_url

    def get_author_name(self, obj):
        user = obj.author
        full_name = str(getattr(user, "full_name", "") or "").strip()
        return full_name or getattr(user, "email", "Unknown")

    def get_author_photo(self, obj):
        photo = getattr(obj.author, "photo", None)
        if not photo:
            return None
        request = self.context.get("request")
        photo_url = photo.url
        return request.build_absolute_uri(photo_url) if request else photo_url

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

            # author
            "author_name",
            "author_photo",
        ]


class RecipeDetailSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    ingredients = RecipeIngredientSerializer(
        many=True,
        read_only=True
    )

    steps = RecipeStepSerializer(
        many=True,
        read_only=True
    )

    
    author_id = serializers.IntegerField(
        source="author.id",
        read_only=True
    )

    author_name = serializers.CharField(
        source="author.full_name",
        read_only=True
    )

    author_email = serializers.EmailField(
        source="author.email",
        read_only=True
    )

    

    def get_cover_image(self, obj):
        image = getattr(obj, "cover_image", None)
        if not image:
            return None
        request = self.context.get("request")
        image_url = image.url
        return request.build_absolute_uri(image_url) if request else image_url

    

    class Meta:
        model = Recipe

        fields = [
            "id",
            "slug",

            
            "author_id",
            "author_name",
            "author_email",
          

            # --------------------------------
            # RECIPE
            # --------------------------------
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

            # --------------------------------
            # NESTED DATA
            # --------------------------------
            "ingredients",
            "steps",
        ]

        read_only_fields = [
            "id",
            "slug",
            "status",
            "published_at",
            "created_at",
            "updated_at",
        ]

class RecipeCreateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True)
    steps = RecipeStepSerializer(many=True)

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

        read_only_fields = [
            "id",
            "slug",
        ]

    def to_internal_value(self, data):
        if hasattr(data, "keys"):
            data = {key: data.get(key) for key in data.keys()}
        else:
            data = dict(data)

        for field in ["ingredients", "steps"]:

            value = data.get(field)

            if isinstance(value, str):
                try:
                    data[field] = json.loads(value)

                except json.JSONDecodeError:
                    pass

        return super().to_internal_value(data)

    def validate_category(self, value):
        cleaned = str(value).strip().lower()
        aliases = {
            "snacks": RecipeCategory.SNACK,
            "desserts": RecipeCategory.DESSERT,
            "smoothies": RecipeCategory.DRINK,
            "salads": RecipeCategory.OTHER,
            "soups": RecipeCategory.OTHER,
        }
        return aliases.get(cleaned, cleaned)

    def validate_difficulty_level(self, value):
        cleaned = str(value).strip().lower()
        aliases = {
            "expert": DifficultyLevel.HARD,
        }
        return aliases.get(cleaned, cleaned)

    def create(self, validated_data):

        ingredients_data = validated_data.pop("ingredients", [])

        steps_data = validated_data.pop("steps", [])

        recipe = Recipe.objects.create(**validated_data)

        # ingredients
        RecipeIngredient.objects.bulk_create([
            RecipeIngredient(recipe=recipe, **ingredient)
            for ingredient in ingredients_data
        ])

        # steps
        RecipeStep.objects.bulk_create([
            RecipeStep(recipe=recipe, **step)
            for step in steps_data
        ])

        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop("ingredients", None)
        steps_data = validated_data.pop("steps", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if ingredients_data is not None:
            instance.ingredients.all().delete()
            RecipeIngredient.objects.bulk_create([
                RecipeIngredient(recipe=instance, **ingredient)
                for ingredient in ingredients_data
            ])

        if steps_data is not None:
            instance.steps.all().delete()
            RecipeStep.objects.bulk_create([
                RecipeStep(recipe=instance, **step)
                for step in steps_data
            ])

        return instance
