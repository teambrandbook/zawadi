import datetime
import importlib
from decimal import Decimal

from rest_framework.test import APITestCase

from accounts.models import User
from notifications.models import Notification, UserNotificationReceipt
from orders.models import Order, OrderReview
from product.models import Product, ProductStatus, ProductVariant
from product.serializers import ProductSerializer
from tax.models import Currency, CountryConfig, TaxCategory, TaxRate


def _ensure_tax_config():
    sar, _ = Currency.objects.get_or_create(
        code="SAR", defaults={"name": "Saudi Riyal", "symbol": "SAR", "decimal_places": 2}
    )
    CountryConfig.objects.get_or_create(country="SA", defaults={"name": "Saudi Arabia", "currency": sar})
    standard, _ = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})
    TaxCategory.objects.get_or_create(code="ZERO", defaults={"name": "Zero-Rated"})
    TaxRate.objects.get_or_create(
        country="SA", tax_category=standard, region=None, is_active=True,
        defaults={"rate": "0.1500", "name": "SA Standard 15%", "effective_from": datetime.date(2020, 7, 1)},
    )
    return standard


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
    standard = _ensure_tax_config()
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
        "tax_category": standard,
    }
    data.update(overrides)
    return Product.objects.create(**data)


def make_order(user, product=None, status="delivered", **overrides):
    data = {
        "user": user,
        "product": product,
        "product_code": product.product_code if product else "BWH-MISSING",
        "product_name": product.product_name if product else "Missing Product",
        "pack_name": "500g",
        "pack_price": Decimal("120.00"),
        "cost_price": Decimal("80.00"),
        "mrp_price": Decimal("150.00"),
        "selling_price": Decimal("120.00"),
        "discount_amount": Decimal("30.00"),
        "discount_percent": Decimal("20.00"),
        "quantity": 1,
        "subtotal": Decimal("120.00"),
        "delivery_charge": Decimal("0.00"),
        "tax_amount": Decimal("18.00"),
        "total_amount": Decimal("138.00"),
        "full_name": "Buyer",
        "phone": "1234567890",
        "email": "buyer@example.com",
        "city": "Mumbai",
        "postal_code": "400001",
        "address": "Test address",
        "payment_method": "cod",
        "status": status,
    }
    data.update(overrides)
    return Order.objects.create(**data)


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
        self.assertEqual(order.product_id, product.id)
        self.assertEqual(order.product_code, "BWH-500")
        self.assertEqual(order.cost_price, Decimal("80.00"))
        self.assertEqual(order.mrp_price, Decimal("150.00"))
        self.assertEqual(order.selling_price, Decimal("120.00"))
        self.assertEqual(order.discount_amount, Decimal("30.00"))
        self.assertEqual(order.subtotal, Decimal("240.00"))
        # 15% SA VAT on subtotal 240.00 = 36.00
        self.assertEqual(order.tax_amount, Decimal("36.00"))
        self.assertEqual(order.tax_rate_snapshot, Decimal("0.1500"))
        self.assertEqual(order.tax_country_snapshot, "SA")
        self.assertEqual(order.charged_currency, "SAR")
        self.assertEqual(float(order.charged_amount), float(order.total_amount))

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


class ProductRatingTests(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.client.force_authenticate(user=self.user)
        self.product = make_product(product_code="BWH-RATE", product_name="Buckwheat Rating Pack")

    def test_delivered_order_review_succeeds(self):
        order = make_order(self.user, self.product, status="delivered")

        response = self.client.post(
            f"/api/orders/{order.order_id}/review/",
            {
                "rating": 5,
                "title": "Excellent",
                "comment": "Excellent buckwheat quality.",
                "recommend": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(OrderReview.objects.get(order=order).rating, 5)

    def test_non_delivered_order_review_fails(self):
        order = make_order(self.user, self.product, status="processing")

        response = self.client.post(
            f"/api/orders/{order.order_id}/review/",
            {"rating": 4, "comment": "Good product.", "recommend": True},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "You can only review a delivered order.")

    def test_duplicate_order_review_fails(self):
        order = make_order(self.user, self.product, status="delivered")
        OrderReview.objects.create(order=order, user=self.user, rating=4, comment="Good product.")

        response = self.client.post(
            f"/api/orders/{order.order_id}/review/",
            {"rating": 5, "comment": "Trying again.", "recommend": True},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "A review already exists for this order.")

    def test_other_user_order_review_fails(self):
        other_user = User.objects.create_user(
            email="other@example.com",
            password="Pass@1234",
            user_name="other",
            full_name="Other",
            phone="1234567899",
            role="COMMUNITY_USER",
        )
        order = make_order(other_user, self.product, status="delivered", email="other@example.com")

        response = self.client.post(
            f"/api/orders/{order.order_id}/review/",
            {"rating": 5, "comment": "Not my order.", "recommend": True},
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["detail"], "You can only review your own orders.")

    def test_order_without_product_cannot_be_reviewed(self):
        order = make_order(self.user, None, status="delivered")

        response = self.client.post(
            f"/api/orders/{order.order_id}/review/",
            {"rating": 5, "comment": "Product missing.", "recommend": True},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "This order cannot be reviewed because its product is no longer available.")

    def test_product_serializer_returns_rating_aggregates(self):
        first_order = make_order(self.user, self.product, status="delivered")
        second_order = make_order(
            self.user,
            self.product,
            status="delivered",
            product_code="BWH-RATE",
            email="buyer@example.com",
        )
        processing_order = make_order(self.user, self.product, status="processing")
        OrderReview.objects.create(order=first_order, user=self.user, rating=5, comment="Excellent.")
        OrderReview.objects.create(order=second_order, user=self.user, rating=3, comment="Good.")
        OrderReview.objects.create(order=processing_order, user=self.user, rating=1, comment="Ignored.")

        data = ProductSerializer(self.product, context={"country": "SA"}).data

        self.assertEqual(data["average_rating"], "4.0")
        self.assertEqual(data["review_count"], 2)

    def test_order_product_backfill_links_by_product_code(self):
        order = make_order(self.user, None, status="delivered", product_code=self.product.product_code)
        migration = importlib.import_module("orders.migrations.0006_order_product_backfill")

        class Apps:
            @staticmethod
            def get_model(app_label, model_name):
                if app_label == "orders" and model_name == "Order":
                    return Order
                if app_label == "product" and model_name == "Product":
                    return Product
                raise LookupError(f"{app_label}.{model_name}")

        migration.backfill_order_products(Apps(), None)
        order.refresh_from_db()

        self.assertEqual(order.product_id, self.product.id)
