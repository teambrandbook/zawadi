# Generated manually on 2026-05-11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0003_recipe_approved_at_recipe_approved_by_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="calories",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="recipe",
            name="fat",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="recipe",
            name="carbs",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="recipe",
            name="protein",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
