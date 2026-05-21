from decimal import Decimal

from .models import TaxRate


def get_tax_rate(country: str, tax_category_code: str) -> Decimal:
    obj = TaxRate.objects.filter(
        country=country.upper(),
        region__isnull=True,
        tax_category__code=tax_category_code,
        is_active=True,
    ).first()
    return obj.rate if obj else Decimal("0")
