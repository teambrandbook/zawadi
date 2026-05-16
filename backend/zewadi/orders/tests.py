from decimal import Decimal

from rest_framework.test import APITestCase

from accounts.models import User
from notifications.models import Notification, UserNotificationReceipt
from orders.models import Order
from product.models import Product, ProductStatus, ProductVariant


def make_user():
    return User.objects.create_user(
        email="buyer@example.com",
        password="Pass@1234",
        user_name="buyer",
        full_name="Buyer",
        phone="1234567890",
        role="COMMUNITY_USER",
    )


def make_product(**overrides):
    data = {
        "product_name": "Buckwheat 500g",
        "product_code": "BWH-500",
        "category": "food",
        "product_status": ProductStatus.ACTIVE,
        "short_description": "Single SKU pack",
        "base_price": Decimal("80.00"),
        "sale_price": Decimal("120.00"),
        "cost_price": Decimal("80.00"),
        "mrp_price": Decimal("150.00"),
        "selling_price": Decimal("120.00"),
        "stock_quantity": 5,
    }
    data.update(overrides)
    return Product.objects.create(**data)


class ProductLevelPricingAndStockTests(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.client.force_authenticate(user=self.user)

    def test_cart_uses_product_selling_price_and_product_stock_only(self):
        product = make_product(stock_quantity=2)
        variant = ProductVariant.objects.create(
            product=product,
            variant_value="1kg",
            variant_unit="kg",
            cost=Decimal("100.00"),
            price=Decimal("200.00"),
            stock=50,
        )

        response = self.client.post(
            "/api/orders/cart/items/",
            {"product_id": product.id, "variant_id": variant.id, "quantity": 3},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        item = response.data["items"][0]
        self.assertIsNone(item["variant_id"])
        self.assertEqual(item["quantity"], 2)
        self.assertEqual(item["unit_price"], "120.00")
        self.assertEqual(response.data["summary"]["subtotal"], "240.00")

    def test_checkout_snapshots_prices_and_decrements_product_stock(self):
        product = make_product(stock_quantity=5)
        self.client.post(
            "/api/orders/cart/items/",
            {"product_id": product.id, "quantity": 2},
            format="json",
        )

        response = self.client.post(
            "/api/orders/cart/checkout/",
            {
                "full_name": "Buyer",
                "phone": "1234567890",
                "email": "buyer@example.com",
                "city": "Mumbai",
                "postal_code": "400001",
                "address": "Test address",
                "payment_method": "cod",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(order_id=response.data["primary_order_id"])
        self.assertEqual(order.product_code, "BWH-500")
        self.assertEqual(order.cost_price, Decimal("80.00"))
        self.assertEqual(order.mrp_price, Decimal("150.00"))
        self.assertEqual(order.selling_price, Decimal("120.00"))
        self.assertEqual(order.discount_amount, Decimal("30.00"))
        self.assertEqual(order.subtotal, Decimal("240.00"))
        self.assertEqual(order.tax_amount, Decimal("19.20"))

        product.refresh_from_db()
        self.assertEqual(product.stock_quantity, 3)

        product.selling_price = Decimal("99.00")
        product.mrp_price = Decimal("130.00")
        product.save()
        order.refresh_from_db()
        self.assertEqual(order.selling_price, Decimal("120.00"))
        self.assertEqual(order.mrp_price, Decimal("150.00"))

    def test_checkout_creates_low_stock_notification_for_admin_and_internal_staff(self):
        admin = User.objects.create_user(
            email="admin@example.com",
            password="Pass@1234",
            user_name="admin",
            full_name="Admin",
            phone="1234567891",
            role="ADMIN",
        )
        internal_staff = User.objects.create_user(
            email="staff@example.com",
            password="Pass@1234",
            user_name="staff",
            full_name="Staff",
            phone="1234567892",
            role="INTERNAL_STAFF",
        )
        product = make_product(
            product_code="BWH-CHECKOUT-LOW",
            stock_quantity=6,
            low_stock_alert=4,
        )
        self.client.post(
            "/api/orders/cart/items/",
            {"product_id": product.id, "quantity": 2},
            format="json",
        )

        response = self.client.post(
            "/api/orders/cart/checkout/",
            {
                "full_name": "Buyer",
                "phone": "1234567890",
                "email": "buyer@example.com",
                "city": "Mumbai",
                "postal_code": "400001",
                "address": "Test address",
                "payment_method": "cod",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        notification = Notification.objects.get(title="Low Stock Alert - Buckwheat 500g")
        self.assertEqual(notification.body, "Product 'Buckwheat 500g' (BWH-CHECKOUT-LOW) stock is low. Current stock is 4.")
        self.assertTrue(UserNotificationReceipt.objects.filter(user=admin, notification=notification).exists())
        self.assertTrue(UserNotificationReceipt.objects.filter(user=internal_staff, notification=notification).exists())
        self.assertFalse(UserNotificationReceipt.objects.filter(user=self.user, notification=notification).exists())
