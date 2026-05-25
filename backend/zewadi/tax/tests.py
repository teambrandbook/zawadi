import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient, APITestCase

from tax.models import Currency, CountryConfig, TaxCategory, TaxRate
from tax.services import get_tax_rate

User = get_user_model()


class GetTaxRateTests(TestCase):
    def setUp(self):
        # Seed migration already created these; use get_or_create to avoid UNIQUE violations
        sar, _ = Currency.objects.get_or_create(code="SAR", defaults={"name": "Saudi Riyal", "symbol": "SAR", "decimal_places": 2})
        CountryConfig.objects.get_or_create(country="SA", defaults={"name": "Saudi Arabia", "currency": sar})
        self.standard, _ = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})
        self.zero, _ = TaxCategory.objects.get_or_create(code="ZERO", defaults={"name": "Zero-Rated"})
        TaxCategory.objects.get_or_create(code="EXEMPT", defaults={"name": "Exempt"})
        TaxRate.objects.get_or_create(
            country="SA", tax_category=self.standard, region=None, is_active=True,
            defaults={"rate": Decimal("0.1500"), "name": "SA Standard", "effective_from": datetime.date(2020, 7, 1)},
        )
        TaxRate.objects.get_or_create(
            country="SA", tax_category=self.zero, region=None, is_active=True,
            defaults={"rate": Decimal("0.0000"), "name": "SA Zero", "effective_from": datetime.date(2020, 7, 1)},
        )

    def test_returns_standard_rate_for_sa(self):
        self.assertEqual(get_tax_rate("SA", "STANDARD"), Decimal("0.1500"))

    def test_returns_zero_for_zero_rated(self):
        self.assertEqual(get_tax_rate("SA", "ZERO"), Decimal("0.0000"))

    def test_returns_zero_for_exempt(self):
        self.assertEqual(get_tax_rate("SA", "EXEMPT"), Decimal("0.0000"))

    def test_returns_zero_for_unknown_country(self):
        # Qatar/Kuwait have no VAT configured
        self.assertEqual(get_tax_rate("QA", "STANDARD"), Decimal("0"))

    def test_case_insensitive_country_code(self):
        self.assertEqual(get_tax_rate("sa", "STANDARD"), Decimal("0.1500"))

    def test_inactive_rate_is_ignored(self):
        TaxRate.objects.create(
            country="SA", tax_category=self.standard,
            rate=Decimal("0.0500"), name="SA Old Rate",
            effective_from=datetime.date(2018, 1, 1),
            is_active=False,
        )
        # Still returns the active rate
        self.assertEqual(get_tax_rate("SA", "STANDARD"), Decimal("0.1500"))


class TaxCountriesViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="taxcountries@example.com", password="pass1234")
        self.client.force_authenticate(user=self.user)

        standard, _ = TaxCategory.objects.get_or_create(
            code="STANDARD", defaults={"name": "Standard Rate"}
        )
        TaxRate.objects.get_or_create(
            country="SA", tax_category=standard, region=None, is_active=True,
            defaults={
                "rate": Decimal("0.15"),
                "name": "SA Standard VAT",
                "effective_from": datetime.date(2020, 1, 1),
            },
        )
        TaxRate.objects.get_or_create(
            country="AE", tax_category=standard, region=None, is_active=True,
            defaults={
                "rate": Decimal("0.05"),
                "name": "AE VAT",
                "effective_from": datetime.date(2020, 1, 1),
            },
        )
        TaxRate.objects.get_or_create(
            country="BH", tax_category=standard, region=None, is_active=False,
            defaults={
                "rate": Decimal("0.10"),
                "name": "BH VAT (inactive)",
                "effective_from": datetime.date(2020, 1, 1),
            },
        )

    def test_returns_active_countries_only(self):
        response = self.client.get("/api/tax/countries/")
        self.assertEqual(response.status_code, 200)
        codes = [item["code"] for item in response.data]
        self.assertIn("SA", codes)
        self.assertIn("AE", codes)
        self.assertNotIn("BH", codes)

    def test_response_shape_includes_name(self):
        response = self.client.get("/api/tax/countries/")
        sa = next((item for item in response.data if item["code"] == "SA"), None)
        self.assertIsNotNone(sa)
        self.assertEqual(sa["name"], "Saudi Arabia")

    def test_unauthenticated_returns_401(self):
        anon = APIClient()
        response = anon.get("/api/tax/countries/")
        self.assertEqual(response.status_code, 401)


class TaxRateWritePermissionTests(APITestCase):
    def setUp(self):
        self.community_user = User.objects.create_user(
            email="community@example.com",
            password="Pass@1234",
            user_name="communityuser1",
            full_name="Community User",
            phone="+10000000001",
            role="COMMUNITY_USER",
        )
        self.community_user.is_active = True
        self.community_user.save(update_fields=["is_active"])

        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="Pass@1234",
            user_name="adminuser1",
            full_name="Admin User",
            phone="+10000000002",
            role="ADMIN",
        )
        self.admin_user.is_active = True
        self.admin_user.save(update_fields=["is_active"])

        self.category = TaxCategory.objects.create(name="Test Category", code="TC001")
        self.rate = TaxRate.objects.create(
            tax_category=self.category,
            country="KE",
            rate=Decimal("0.1600"),
            name="Test Rate",
            effective_from=datetime.date(2020, 1, 1),
            is_active=True,
        )
        self.client = APIClient()

    def test_community_user_cannot_patch_tax_rate(self):
        self.client.force_authenticate(user=self.community_user)
        response = self.client.patch(
            f"/api/tax/rates/{self.rate.pk}/",
            {"rate_percent": "18.00"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_community_user_cannot_delete_tax_rate(self):
        self.client.force_authenticate(user=self.community_user)
        response = self.client.delete(f"/api/tax/rates/{self.rate.pk}/")
        self.assertEqual(response.status_code, 403)

    def test_community_user_cannot_post_tax_rate(self):
        self.client.force_authenticate(user=self.community_user)
        response = self.client.post(
            "/api/tax/rates/",
            {
                "tax_category": "TC001",
                "country": "UG",
                "rate_percent": "18.00",
                "name": "Test Rate UG",
                "effective_from": "2020-01-01",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_admin_can_patch_tax_rate(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(
            f"/api/tax/rates/{self.rate.pk}/",
            {"rate_percent": "20.00"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_unauthenticated_cannot_patch_tax_rate(self):
        response = self.client.patch(
            f"/api/tax/rates/{self.rate.pk}/",
            {"rate_percent": "18.00"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)
