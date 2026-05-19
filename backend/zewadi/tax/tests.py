from decimal import Decimal

from django.test import TestCase

from tax.models import Currency, CountryConfig, TaxCategory, TaxRate
from tax.services import get_tax_rate


class GetTaxRateTests(TestCase):
    def setUp(self):
        # Seed migration already created these; use get_or_create to avoid UNIQUE violations
        sar, _ = Currency.objects.get_or_create(code="SAR", defaults={"name": "Saudi Riyal", "symbol": "SAR", "decimal_places": 2})
        CountryConfig.objects.get_or_create(country="SA", defaults={"name": "Saudi Arabia", "currency": sar})
        self.standard, _ = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})
        self.zero, _ = TaxCategory.objects.get_or_create(code="ZERO", defaults={"name": "Zero-Rated"})
        TaxCategory.objects.get_or_create(code="EXEMPT", defaults={"name": "Exempt"})
        import datetime
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
        import datetime
        TaxRate.objects.create(
            country="SA", tax_category=self.standard,
            rate=Decimal("0.0500"), name="SA Old Rate",
            effective_from=datetime.date(2018, 1, 1),
            is_active=False,
        )
        # Still returns the active rate
        self.assertEqual(get_tax_rate("SA", "STANDARD"), Decimal("0.1500"))
