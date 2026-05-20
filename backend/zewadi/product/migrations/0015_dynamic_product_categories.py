# Generated manually for dynamic product category management.

from django.db import migrations, models


DEFAULT_CATEGORIES = [
    ("food", "Food", 10),
    ("seed", "Seed", 20),
    ("supplement", "Supplement", 30),
    ("other", "Other", 40),
    ("multi_grains", "Multi Grains", 50),
    ("small_grains", "Small Grains", 60),
    ("pulses", "Pulses", 70),
    ("nuts", "Nuts", 80),
    ("seeds", "Seeds", 90),
    ("rices", "Rices", 100),
    ("oils", "Oils", 110),
    ("spices", "Spices", 120),
    ("spreads_butters", "Spreads & Butters", 130),
    ("flour", "Flour", 140),
    ("grains", "Grains", 150),
    ("pasta", "Pasta", 160),
    ("spreads", "Spreads", 170),
]


def seed_categories(apps, schema_editor):
    Product = apps.get_model("product", "Product")
    ProductCategory = apps.get_model("product", "ProductCategory")

    for slug, name, sort_order in DEFAULT_CATEGORIES:
        ProductCategory.objects.get_or_create(
            slug=slug,
            defaults={
                "name": name,
                "sort_order": sort_order,
                "is_active": True,
            },
        )

    next_order = len(DEFAULT_CATEGORIES) * 10
    existing_slugs = (
        Product.objects.exclude(category="")
        .values_list("category", flat=True)
        .distinct()
    )
    for slug in existing_slugs:
        if ProductCategory.objects.filter(slug=slug).exists():
            continue
        next_order += 10
        ProductCategory.objects.create(
            slug=slug,
            name=str(slug).replace("_", " ").title(),
            sort_order=next_order,
            is_active=True,
        )


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0014_remove_currency_field_make_tax_category_required"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("slug", models.SlugField(blank=True, max_length=80, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name_plural": "Product categories",
                "ordering": ["sort_order", "name"],
            },
        ),
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(default="other", max_length=80),
        ),
        migrations.RunPython(seed_categories, migrations.RunPython.noop),
    ]
