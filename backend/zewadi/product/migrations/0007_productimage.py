import django.db.models.deletion
import zewadi.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0006_product_explicit_pricing"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "image",
                    models.ImageField(
                        upload_to="products/alternative_images/",
                        validators=[zewadi.validators.validate_image_upload],
                    ),
                ),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="alternative_images",
                        to="product.product",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
    ]
