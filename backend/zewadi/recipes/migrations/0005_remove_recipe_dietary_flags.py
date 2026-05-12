# Generated manually on 2026-05-11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0004_recipe_nutrition_facts"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="recipe",
            name="is_gluten_free",
        ),
        migrations.RemoveField(
            model_name="recipe",
            name="is_high_fiber",
        ),
        migrations.RemoveField(
            model_name="recipe",
            name="is_weight_management",
        ),
        migrations.RemoveField(
            model_name="recipe",
            name="is_energy_boosting",
        ),
    ]
