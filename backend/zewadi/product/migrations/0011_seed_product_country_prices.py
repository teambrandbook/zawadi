from django.db import migrations


def seed_forward(apps, schema_editor):
    Product = apps.get_model("product", "Product")
    ProductCountryPrice = apps.get_model("product", "ProductCountryPrice")
    Currency = apps.get_model("tax", "Currency")

    try:
        sar = Currency.objects.get(code="SAR")
    except Currency.DoesNotExist:
        return  # tax seed migration hasn't run yet (test isolation)

    for product in Product.objects.all():
        ProductCountryPrice.objects.get_or_create(
            product=product,
            country="SA",
            defaults={"currency": sar, "selling_price": product.selling_price},
        )


def seed_reverse(apps, schema_editor):
    ProductCountryPrice = apps.get_model("product", "ProductCountryPrice")
    ProductCountryPrice.objects.filter(country="SA").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0010_add_product_country_price"),
        ("tax", "0002_seed_data"),
    ]

    operations = [
        migrations.RunPython(seed_forward, seed_reverse),
    ]
