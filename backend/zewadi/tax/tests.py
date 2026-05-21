import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

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
