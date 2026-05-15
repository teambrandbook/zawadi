from django.test import TestCase, override_settings
from django.core.cache import cache
from rest_framework.test import APIClient
from .serializers import ProductCreateSerializer
from .models import Product, ProductStatus

CACHE_SETTINGS = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "zawadi",
    }
}


def make_product(name="Test Product", status=ProductStatus.ACTIVE):
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
    )


class ProductPricingValidationTest(TestCase):
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
