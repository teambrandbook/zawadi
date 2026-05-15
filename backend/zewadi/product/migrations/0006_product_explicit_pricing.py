from django.core.validators import MinValueValidator
from django.db import migrations, models


def backfill_explicit_pricing(apps, schema_editor):
    Product = apps.get_model("product", "Product")
    for product in Product.objects.all().iterator():
        base_price = product.base_price or 0
        sale_price = product.sale_price if product.sale_price is not None else base_price
        product.cost_price = base_price
        product.selling_price = sale_price
        product.mrp_price = sale_price if sale_price is not None else base_price
        product.save(update_fields=["cost_price", "mrp_price", "selling_price"])


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0005_rename_variant_name_productvariant_variant_value_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="cost_price",
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=10,
                validators=[MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="mrp_price",
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=10,
                validators=[MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="selling_price",
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=10,
                validators=[MinValueValidator(0)],
            ),
        ),
        migrations.RunPython(backfill_explicit_pricing, migrations.RunPython.noop),
    ]
