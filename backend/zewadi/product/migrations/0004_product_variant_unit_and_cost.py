# Generated manually for product variant form fields.

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0003_product_units_and_status_choices"),
    ]

    operations = [
        migrations.AddField(
            model_name="productvariant",
            name="cost",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=10,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="variant_unit",
            field=models.CharField(
                blank=True,
                choices=[
                    ("kg", "Kg"),
                    ("g", "Gram"),
                    ("packet", "Packet"),
                    ("box", "Box"),
                ],
                default="",
                max_length=20,
            ),
        ),
    ]
