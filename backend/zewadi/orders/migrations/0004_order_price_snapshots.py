from decimal import Decimal

from django.db import migrations, models


def backfill_order_price_snapshots(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    Product = apps.get_model("product", "Product")

    for order in Order.objects.all().iterator():
        product = Product.objects.filter(product_name=order.product_name).first()
        selling_price = order.pack_price or Decimal("0.00")
        cost_price = getattr(product, "cost_price", Decimal("0.00")) if product else Decimal("0.00")
        mrp_price = getattr(product, "mrp_price", selling_price) if product else selling_price
        discount_amount = max(mrp_price - selling_price, Decimal("0.00"))
        discount_percent = (
            (discount_amount / mrp_price * Decimal("100")).quantize(Decimal("0.01"))
            if mrp_price and mrp_price > 0 and discount_amount > 0
            else Decimal("0.00")
        )
        tax_amount = max(
            (order.total_amount or Decimal("0.00"))
            - (order.subtotal or Decimal("0.00"))
            - (order.delivery_charge or Decimal("0.00")),
            Decimal("0.00"),
        )

        order.product_code = getattr(product, "product_code", "") if product else ""
        order.cost_price = cost_price
        order.mrp_price = mrp_price
        order.selling_price = selling_price
        order.discount_amount = discount_amount
        order.discount_percent = discount_percent
        order.tax_amount = tax_amount
        order.save(
            update_fields=[
                "product_code",
                "cost_price",
                "mrp_price",
                "selling_price",
                "discount_amount",
                "discount_percent",
                "tax_amount",
            ]
        )


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0003_alter_order_status"),
        ("product", "0006_product_explicit_pricing"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="product_code",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
        migrations.AddField(
            model_name="order",
            name="cost_price",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="mrp_price",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="selling_price",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="discount_amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="discount_percent",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=5),
        ),
        migrations.AddField(
            model_name="order",
            name="tax_amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.RunPython(backfill_order_price_snapshots, migrations.RunPython.noop),
    ]
