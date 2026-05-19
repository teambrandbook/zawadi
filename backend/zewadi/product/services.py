from tax.models import Currency


def get_product_price(product, country: str):
    """
    Retrieve the price for a product in a specific country.

    Returns a tuple of (selling_price, currency).
    Falls back to SAR currency and product.selling_price if no country-specific price exists.

    Args:
        product: Product instance
        country: ISO country code (e.g., 'SA', 'AE') - case-insensitive

    Returns:
        tuple: (Decimal selling_price, Currency object)
    """
    from product.models import ProductCountryPrice

    try:
        cp = ProductCountryPrice.objects.select_related("currency").get(
            product=product,
            country=country.upper(),
            is_active=True,
        )
        return cp.selling_price, cp.currency
    except ProductCountryPrice.DoesNotExist:
        try:
            sar = Currency.objects.get(code="SAR")
        except Currency.DoesNotExist:
            sar = type("Currency", (), {"code": "SAR", "symbol": "SAR", "decimal_places": 2})()
        return product.selling_price, sar
