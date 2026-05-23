from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Currency, TaxCategory, TaxRate


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def currency_list(request):
    currencies = Currency.objects.filter(is_active=True).values(
        "code", "name", "symbol", "decimal_places"
    )
    return Response(list(currencies))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def currency_list_all(request):
    currencies = Currency.objects.all().values(
        "code", "name", "symbol", "decimal_places", "is_active"
    )
    return Response(list(currencies))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tax_category_list(request):
    categories = TaxCategory.objects.filter(is_active=True).values("code", "name")
    return Response(list(categories))


def _rate_to_dict(tr):
    return {
        "id": tr.id,
        "country": tr.country,
        "region": tr.region,
        "tax_category": tr.tax_category.code,
        "tax_category_name": tr.tax_category.name,
        "rate": str(tr.rate),
        "rate_percent": round(float(tr.rate) * 100, 4),
        "name": tr.name,
        "effective_from": str(tr.effective_from),
        "is_active": tr.is_active,
    }


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def tax_rate_list(request):
    if request.method == "GET":
        rates = TaxRate.objects.select_related("tax_category").order_by(
            "country", "tax_category__code"
        )
        return Response([_rate_to_dict(r) for r in rates])

    # POST — create a new rate
    country = str(request.data.get("country", "")).upper().strip()
    tax_category_code = str(request.data.get("tax_category", "")).upper().strip()
    rate_percent = request.data.get("rate_percent")
    name = str(request.data.get("name", "")).strip()
    effective_from = request.data.get("effective_from")

    errors = {}
    if not country or len(country) != 2:
        errors["country"] = "2-letter country code is required."
    if not tax_category_code:
        errors["tax_category"] = "Tax category code is required."
    if rate_percent is None:
        errors["rate_percent"] = "Rate is required."
    if not name:
        errors["name"] = "Name is required."
    if not effective_from:
        errors["effective_from"] = "Effective from date is required."
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        tax_category = TaxCategory.objects.get(code=tax_category_code)
    except TaxCategory.DoesNotExist:
        return Response(
            {"tax_category": f"Tax category '{tax_category_code}' not found."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        rate_decimal = float(rate_percent) / 100
    except (ValueError, TypeError):
        return Response({"rate_percent": "Must be a number."}, status=status.HTTP_400_BAD_REQUEST)

    tr = TaxRate.objects.create(
        country=country,
        tax_category=tax_category,
        rate=rate_decimal,
        name=name,
        effective_from=effective_from,
        is_active=True,
    )
    return Response(_rate_to_dict(tr), status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def tax_rate_detail(request, pk):
    try:
        tr = TaxRate.objects.select_related("tax_category").get(pk=pk)
    except TaxRate.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        tr.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # PATCH
    if "is_active" in request.data:
        tr.is_active = bool(request.data["is_active"])
    if "name" in request.data:
        tr.name = str(request.data["name"]).strip()
    if "rate_percent" in request.data:
        try:
            tr.rate = float(request.data["rate_percent"]) / 100
        except (ValueError, TypeError):
            return Response({"rate_percent": "Must be a number."}, status=status.HTTP_400_BAD_REQUEST)
    tr.save()
    return Response(_rate_to_dict(tr))


GCC_NAMES = {
    "SA": "Saudi Arabia",
    "AE": "UAE",
    "BH": "Bahrain",
    "OM": "Oman",
    "KW": "Kuwait",
    "QA": "Qatar",
}


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tax_countries(request):
    codes = (
        TaxRate.objects.filter(is_active=True)
        .values_list("country", flat=True)
        .distinct()
        .order_by("country")
    )
    return Response([{"code": c, "name": GCC_NAMES.get(c, c)} for c in codes])
