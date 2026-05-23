# Generated for product-level verified purchase ratings.

from django.db import migrations, models
import django.db.models.deletion


def backfill_order_products(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    Product = apps.get_model("product", "Product")

    products_by_code = Product.objects.exclude(product_code="").in_bulk(field_name="product_code")
    orders_to_update = []

    for order in Order.objects.filter(product__isnull=True).exclude(product_code="").only("id", "product_code", "product_id"):
        product = products_by_code.get(order.product_code)
        if product:
            order.product_id = product.id
            orders_to_update.append(order)

    if orders_to_update:
        Order.objects.bulk_update(orders_to_update, ["product"])


def clear_backfilled_order_products(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    Order.objects.update(product=None)


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0015_dynamic_product_categories"),
        ("orders", "0005_add_tax_currency_snapshot_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="product",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="orders",
                to="product.product",
            ),
        ),
        migrations.RunPython(backfill_order_products, clear_backfilled_order_products),
    ]
