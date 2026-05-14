# Generated manually for product form backend fields.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0002_alter_product_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="alternative_unit_enabled",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="product",
            name="product_unit",
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
        migrations.AddField(
            model_name="product",
            name="unit_quantity",
            field=models.CharField(blank=True, default="", max_length=30),
        ),
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(
                choices=[
                    ("food", "Food"),
                    ("seed", "Seed"),
                    ("supplement", "Supplement"),
                    ("other", "Other"),
                    ("multi_grains", "Multi Grains"),
                    ("small_grains", "Small Grains"),
                    ("pulses", "Pulses"),
                    ("nuts", "Nuts"),
                    ("seeds", "Seeds"),
                    ("rices", "Rices"),
                    ("oils", "Oils"),
                    ("spices", "Spices"),
                    ("spreads_butters", "Spreads & Butters"),
                ],
                default="other",
                max_length=30,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="product_status",
            field=models.CharField(
                choices=[
                    ("draft", "Draft"),
                    ("active", "Active"),
                    ("inactive", "Inactive"),
                ],
                default="draft",
                max_length=20,
            ),
        ),
    ]
