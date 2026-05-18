# Generated manually on 2026-05-16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("recipes", "0006_recipe_video_url"),
    ]

    operations = [
        migrations.CreateModel(
            name="FavoriteRecipe",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "recipe",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favorited_by",
                        to="recipes.recipe",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favorite_recipes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
                "unique_together": {("user", "recipe")},
            },
        ),
        migrations.AddIndex(
            model_name="favoriterecipe",
            index=models.Index(fields=["user", "created_at"], name="recipes_fav_user_id_95c711_idx"),
        ),
        migrations.AddIndex(
            model_name="favoriterecipe",
            index=models.Index(fields=["recipe"], name="recipes_fav_recipe__a0cfc9_idx"),
        ),
    ]
