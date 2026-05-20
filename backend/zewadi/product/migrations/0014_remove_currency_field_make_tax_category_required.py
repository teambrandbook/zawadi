import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0013_backfill_tax_category"),
        ("tax", "0003_add_product_country_price"),
    ]

    operations = [
        # Make tax_category non-nullable (data was backfilled in 0013)
        migrations.AlterField(
            model_name="product",
            name="tax_category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="tax.taxcategory",
            ),
        ),
        # Remove the legacy currency CharField
        migrations.RemoveField(
            model_name="product",
            name="currency",
        ),
    ]
