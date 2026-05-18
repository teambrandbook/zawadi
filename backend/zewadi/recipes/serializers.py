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
        return getattr(obj, "cover_image", None) or None

    def get_author_name(self, obj):
        user = obj.author
        full_name = str(getattr(user, "full_name", "") or "").strip()
        return full_name or getattr(user, "email", "Unknown")

    def get_author_photo(self, obj):
        return getattr(obj.author, "photo", None) or None

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
            "video_url",
            "created_at",

            # author
            "author_name",
            "author_photo",
        ]


class RecipeDetailSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    nutrition = serializers.SerializerMethodField()

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
        return getattr(obj, "cover_image", None) or None

    def get_nutrition(self, obj):
        return {
            "calories": obj.calories or "",
            "fat": obj.fat or "",
            "carbs": obj.carbs or "",
            "protein": obj.protein or "",
        }

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
            "calories",
            "fat",
            "carbs",
            "protein",
            "nutrition",
            "video_url",

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
    ingredients = serializers.JSONField(required=False)
    steps = serializers.JSONField(required=False)
    calories = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    fat = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    carbs = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    protein = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    video_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)

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
            "calories",
            "fat",
            "carbs",
            "protein",
            "video_url",
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

        data.pop("source_url", None)
        data.pop("country", None)

        for field in ["calories", "fat", "carbs", "protein", "video_url"]:
            if data.get(field) is None:
                continue
            value = str(data.get(field)).strip()
            if field == "video_url" and value and "://" not in value:
                value = f"https://{value}"
            data[field] = value
            if value == "":
                data[field] = None

        if data.get("category") is not None:
            data["category"] = self.normalize_category(data.get("category"))

        if data.get("difficulty_level") is not None:
            data["difficulty_level"] = self.normalize_difficulty(data.get("difficulty_level"))

        for field in ["ingredients", "steps"]:

            value = data.get(field)

            if isinstance(value, str):
                try:
                    data[field] = json.loads(value)

                except json.JSONDecodeError:
                    pass

        if isinstance(data.get("ingredients"), list):
            data["ingredients"] = self.normalize_ingredients(data["ingredients"])
        elif data.get("ingredients") in ("", None):
            data["ingredients"] = []

        if isinstance(data.get("steps"), list):
            data["steps"] = self.normalize_steps(data["steps"])
        elif data.get("steps") in ("", None):
            data["steps"] = []

        return super().to_internal_value(data)

    @staticmethod
    def normalize_category(value):
        cleaned = str(value).strip().lower()
        cleaned = cleaned.replace(" ", "_").replace("-", "_")
        aliases = {
            "break_fast": RecipeCategory.BREAKFAST,
            "breakfast": RecipeCategory.BREAKFAST,
            "lunch": RecipeCategory.LUNCH,
            "dinner": RecipeCategory.DINNER,
            "snack": RecipeCategory.SNACK,
            "snacks": RecipeCategory.SNACK,
            "dessert": RecipeCategory.DESSERT,
            "desserts": RecipeCategory.DESSERT,
            "drink": RecipeCategory.DRINK,
            "drinks": RecipeCategory.DRINK,
            "smoothies": RecipeCategory.DRINK,
            "salads": RecipeCategory.OTHER,
            "soups": RecipeCategory.OTHER,
            "other": RecipeCategory.OTHER,
        }
        return aliases.get(cleaned, cleaned)

    @staticmethod
    def normalize_difficulty(value):
        cleaned = str(value).strip().lower()
        aliases = {
            "easy": DifficultyLevel.EASY,
            "medium": DifficultyLevel.MEDIUM,
            "hard": DifficultyLevel.HARD,
            "expert": DifficultyLevel.HARD,
        }
        return aliases.get(cleaned, cleaned)

    def validate_category(self, value):
        return self.normalize_category(value)

    def validate_difficulty_level(self, value):
        return self.normalize_difficulty(value)

    @staticmethod
    def normalize_ingredients(items):
        normalized = []
        for item in items:
            if isinstance(item, str):
                item = {"ingredient_name": item}
            if not isinstance(item, dict):
                continue

            ingredient_name = str(
                item.get("ingredient_name")
                or item.get("name")
                or item.get("ingredient")
                or ""
            ).strip()
            quantity = str(item.get("quantity") or item.get("qty") or "").strip()
            unit = str(item.get("unit") or IngredientUnit.PIECE).strip().lower()

            if not ingredient_name:
                continue

            ingredient = {
                "ingredient_name": ingredient_name,
                "quantity": quantity,
                "unit": unit or IngredientUnit.PIECE,
            }

            note = item.get("note")
            if note:
                ingredient["note"] = str(note).strip()

            normalized.append(ingredient)

        return normalized

    @staticmethod
    def normalize_steps(items):
        normalized = []
        for index, item in enumerate(items, start=1):
            if isinstance(item, str):
                item = {"description": item}
            if not isinstance(item, dict):
                continue

            description = str(
                item.get("description")
                or item.get("step")
                or item.get("instruction")
                or ""
            ).strip()
            if not description:
                continue

            step_no = item.get("step_no") or item.get("step_number") or index
            normalized.append(
                {
                    "step_no": step_no,
                    "description": description,
                }
            )

        return normalized

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
