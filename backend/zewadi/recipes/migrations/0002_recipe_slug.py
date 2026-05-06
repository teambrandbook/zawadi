from django.db import migrations, models
from django.utils.text import slugify
import uuid


def populate_recipe_slugs(apps, schema_editor):
    Recipe = apps.get_model("recipes", "Recipe")
    for recipe in Recipe.objects.all():
        if recipe.slug:
            continue
        base = slugify(recipe.title)[:180] or "recipe"
        slug = f"{base}-{str(uuid.uuid4())[:8]}"
        while Recipe.objects.filter(slug=slug).exclude(pk=recipe.pk).exists():
            slug = f"{base}-{str(uuid.uuid4())[:8]}"
        recipe.slug = slug
        recipe.save(update_fields=["slug"])


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="slug",
            field=models.SlugField(blank=True, max_length=220, null=True, unique=True),
        ),
        migrations.RunPython(populate_recipe_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="recipe",
            name="slug",
            field=models.SlugField(blank=True, max_length=220, unique=True),
        ),
    ]
