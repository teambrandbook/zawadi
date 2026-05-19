from decimal import Decimal

from .models import TaxRate


def get_tax_rate(country: str, tax_category_code: str) -> Decimal:
    try:
        obj = TaxRate.objects.get(
            country=country.upper(),
            region__isnull=True,
            tax_category__code=tax_category_code,
            is_active=True,
        )
        return obj.rate
    except TaxRate.DoesNotExist:
        return Decimal("0")
