from product.models import ProductCountryPrice
from tax.models import Currency


def get_product_price(product, country: str):
    try:
        cp = ProductCountryPrice.objects.select_related("currency").get(
            product=product,
            country=country.upper(),
            is_active=True,
        )
        return cp.selling_price, cp.currency
    except ProductCountryPrice.DoesNotExist:
        sar = Currency.objects.get(code="SAR")
        return product.selling_price, sar
