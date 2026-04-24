from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from product.models import Product


class ProductAccessTests(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            product_name="Buckwheat Flour",
            product_subtitle="Stone ground",
            product_code="BW-FLOUR-001",
            category="food",
            product_status="active",
            short_description="High fiber flour",
            full_description="Premium flour",
            base_price="12.00",
            sale_price="10.00",
            currency="USD",
            stock_quantity=25,
            low_stock_alert=5,
            stock_status="in_stock",
        )

    def test_community_user_can_list_products(self):
        user = User.objects.create_user(
            email="community-product@example.com",
            password="Pass@1234",
            user_name="communityproduct",
            full_name="Community Product",
            phone="+10000000011",
            role="COMMUNITY_USER",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/products/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_community_user_cannot_create_product(self):
        user = User.objects.create_user(
            email="community-create@example.com",
            password="Pass@1234",
            user_name="communitycreate",
            full_name="Community Create",
            phone="+10000000012",
            role="COMMUNITY_USER",
        )
        self.client.force_authenticate(user=user)

        payload = {
            "product_name": "New Product",
            "product_code": "NP-001",
            "short_description": "Description",
            "base_price": "20.00",
            "stock_quantity": 10,
        }
        response = self.client.post("/api/products/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
