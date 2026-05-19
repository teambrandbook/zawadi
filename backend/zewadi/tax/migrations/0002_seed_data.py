from django.db import migrations
import datetime


def seed_forward(apps, schema_editor):
    Currency = apps.get_model("tax", "Currency")
    CountryConfig = apps.get_model("tax", "CountryConfig")
    TaxCategory = apps.get_model("tax", "TaxCategory")
    TaxRate = apps.get_model("tax", "TaxRate")

    sar, _ = Currency.objects.get_or_create(code="SAR", defaults={"name": "Saudi Riyal", "symbol": "SAR", "decimal_places": 2})
    aed, _ = Currency.objects.get_or_create(code="AED", defaults={"name": "UAE Dirham", "symbol": "AED", "decimal_places": 2})
    bhd, _ = Currency.objects.get_or_create(code="BHD", defaults={"name": "Bahraini Dinar", "symbol": "BHD", "decimal_places": 3})
    omr, _ = Currency.objects.get_or_create(code="OMR", defaults={"name": "Omani Rial", "symbol": "OMR", "decimal_places": 3})

    CountryConfig.objects.get_or_create(country="SA", defaults={"name": "Saudi Arabia", "currency": sar})
    CountryConfig.objects.get_or_create(country="AE", defaults={"name": "United Arab Emirates", "currency": aed})
    CountryConfig.objects.get_or_create(country="BH", defaults={"name": "Bahrain", "currency": bhd})
    CountryConfig.objects.get_or_create(country="OM", defaults={"name": "Oman", "currency": omr})

    standard, _ = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate", "description": "Standard VAT rate"})
    zero, _ = TaxCategory.objects.get_or_create(code="ZERO", defaults={"name": "Zero-Rated", "description": "Zero-rated goods (e.g. basic food staples)"})
    TaxCategory.objects.get_or_create(code="EXEMPT", defaults={"name": "Exempt", "description": "VAT exempt goods"})

    effective = datetime.date(2020, 7, 1)
    TaxRate.objects.get_or_create(
        country="SA", tax_category=standard, region=None, is_active=True,
        defaults={"rate": "0.1500", "name": "Saudi VAT Standard Rate 15%", "effective_from": effective},
    )
    TaxRate.objects.get_or_create(
        country="SA", tax_category=zero, region=None, is_active=True,
        defaults={"rate": "0.0000", "name": "Saudi VAT Zero-Rated", "effective_from": effective},
    )


def seed_reverse(apps, schema_editor):
    TaxRate = apps.get_model("tax", "TaxRate")
    TaxCategory = apps.get_model("tax", "TaxCategory")
    CountryConfig = apps.get_model("tax", "CountryConfig")
    Currency = apps.get_model("tax", "Currency")

    TaxRate.objects.filter(country="SA", name__in=["Saudi VAT Standard Rate 15%", "Saudi VAT Zero-Rated"]).delete()
    TaxCategory.objects.filter(code__in=["STANDARD", "ZERO", "EXEMPT"]).delete()
    CountryConfig.objects.filter(country__in=["SA", "AE", "BH", "OM"]).delete()
    Currency.objects.filter(code__in=["SAR", "AED", "BHD", "OMR"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('tax', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_forward, seed_reverse),
    ]
