import datetime

from django.test import TestCase, override_settings
from django.core.cache import cache
from rest_framework.test import APIClient
from .serializers import ProductCreateSerializer
from .models import Product, ProductStatus
from tax.models import Currency, CountryConfig, TaxCategory, TaxRate

CACHE_SETTINGS = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "zawadi",
    }
}


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


def make_product(name="Test Product", status=ProductStatus.ACTIVE):
    standard = _ensure_tax_config()
    return Product.objects.create(
        product_name=name,
        product_code=f"P-{name[:4].upper()}-001",
        category="food",
        product_status=status,
        base_price="10.00",
        cost_price="10.00",
        mrp_price="10.00",
        selling_price="10.00",
        short_description="Test product",
        tax_category=standard,
    )


class ProductPricingValidationTest(TestCase):
    def setUp(self):
        self.standard = _ensure_tax_config()

    def test_selling_price_cannot_exceed_mrp(self):
        serializer = ProductCreateSerializer(
            data={
                "product_name": "Invalid Price",
                "product_code": "BAD-001",
                "category": "food",
                "product_status": "active",
                "short_description": "Invalid pricing",
                "cost_price": "50.00",
                "mrp_price": "100.00",
                "selling_price": "120.00",
                "base_price": "50.00",
                "sale_price": "120.00",
                "stock_quantity": 5,
                "tax_category": self.standard.id,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("selling_price", serializer.errors)


@override_settings(CACHES=CACHE_SETTINGS)
class ProductListCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def test_second_get_is_served_from_cache(self):
        make_product("Alpha")
        r1 = self.client.get("/api/products/")
        with self.assertNumQueries(0):
            r2 = self.client.get("/api/products/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_product_save(self):
        p = make_product("Beta")
        self.client.get("/api/products/")          # prime cache
        p.product_name = "Beta Updated"
        p.save()
        r = self.client.get("/api/products/")
        names = [item["product_name"] for item in r.data["results"]]
        self.assertIn("Beta Updated", names)

    def test_cache_invalidated_on_product_delete(self):
        p = make_product("Gamma")
        self.client.get("/api/products/")          # prime cache
        p.delete()
        r = self.client.get("/api/products/")
        names = [item["product_name"] for item in r.data["results"]]
        self.assertNotIn("Gamma", names)


@override_settings(CACHES=CACHE_SETTINGS)
class ProductDetailCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def test_second_get_is_served_from_cache(self):
        p = make_product("Delta")
        r1 = self.client.get(f"/api/products/{p.pk}/")
        with self.assertNumQueries(0):
            r2 = self.client.get(f"/api/products/{p.pk}/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_product_save(self):
        p = make_product("Epsilon")
        self.client.get(f"/api/products/{p.pk}/")  # prime cache
        p.product_name = "Epsilon Updated"
        p.save()
        r = self.client.get(f"/api/products/{p.pk}/")
        self.assertEqual(r.data["product_name"], "Epsilon Updated")

    def test_cache_invalidated_on_product_delete(self):
        p = make_product("Zeta")
        pk = p.pk
        self.client.get(f"/api/products/{pk}/")   # prime cache
        p.delete()
        r = self.client.get(f"/api/products/{pk}/")
        self.assertEqual(r.status_code, 404)


# ============ GetProductPrice Service Tests ============

from decimal import Decimal
from product.models import ProductCountryPrice
from product.services import get_product_price
from tax.models import Currency, TaxCategory


def make_currency(code="SAR", decimal_places=2):
    return Currency.objects.get_or_create(
        code=code, defaults={"name": code, "symbol": code, "decimal_places": decimal_places}
    )[0]


def make_product_with_tax():
    tc = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})[0]
    return Product.objects.create(
        product_name="Test Product",
        product_code="TP-001",
        category="food",
        product_status=ProductStatus.ACTIVE,
        short_description="Test",
        base_price=Decimal("100.00"),
        selling_price=Decimal("100.00"),
        cost_price=Decimal("100.00"),
        mrp_price=Decimal("100.00"),
        tax_category=tc,
    )


class GetProductPriceTests(TestCase):
    def setUp(self):
        self.sar = make_currency("SAR", 2)
        self.aed = make_currency("AED", 2)
        self.product = make_product_with_tax()

    def test_returns_sa_price_when_country_price_exists(self):
        ProductCountryPrice.objects.create(
            product=self.product, country="SA", currency=self.sar, selling_price=Decimal("100.00")
        )
        price, currency = get_product_price(self.product, "SA")
        self.assertEqual(price, Decimal("100.000"))
        self.assertEqual(currency.code, "SAR")

    def test_returns_aed_price_for_ae(self):
        ProductCountryPrice.objects.create(
            product=self.product, country="AE", currency=self.aed, selling_price=Decimal("99.750")
        )
        price, currency = get_product_price(self.product, "AE")
        self.assertEqual(price, Decimal("99.750"))
        self.assertEqual(currency.code, "AED")

    def test_falls_back_to_sar_when_no_country_price(self):
        # No AE price, SAR currency exists in DB
        price, currency = get_product_price(self.product, "AE")
        self.assertEqual(price, self.product.selling_price)
        self.assertEqual(currency.code, "SAR")

    def test_case_insensitive_country_code(self):
        ProductCountryPrice.objects.create(
            product=self.product, country="SA", currency=self.sar, selling_price=Decimal("100.00")
        )
        price, currency = get_product_price(self.product, "sa")
        self.assertEqual(currency.code, "SAR")
