# Country Field in Delivery Address with Dynamic Tax

**Date:** 2026-05-21
**Status:** Approved

---

## Problem

Community users are shown a tax amount (SA Standard VAT) before they enter any address, because the backend defaults to `DEFAULT_TAX_COUNTRY = "SA"`. The delivery address form has no country field, so users from other GCC countries are always taxed at the SA rate. The available countries should mirror exactly what the admin has configured in the tax dashboard — no hardcoding on the frontend.

---

## Solution Overview

Add a country `<select>` to the delivery address form. Countries are fetched from a new backend endpoint that returns only countries with active tax rates. When the country changes, the cart is re-fetched with `?country=X` so the tax in the order summary updates live. The selected country travels through the checkout session into the payment page, which also passes it to the cart API.

---

## Architecture

### Backend — New endpoint

```
GET /api/tax/countries/
Auth: IsAuthenticated
```

Queries `TaxRate` for distinct `country` values where `is_active=True`, returns a list with a human-readable name derived from Python's `pycountry` or a simple hardcoded GCC map (simpler, no extra dep):

```json
[
  { "code": "SA", "name": "Saudi Arabia" },
  { "code": "AE", "name": "UAE" }
]
```

Only countries that have at least one active tax rate appear. No new model needed.

Route added to `tax/urls.py`.

---

### Frontend — Data flow

```
DeliveryInformation
  └─ fetches /tax/countries/ on mount
  └─ <select> defaults to "SA"
  └─ onChange → calls OrderPage.onDeliveryChange("country", code)

OrderPage
  └─ country in DeliveryForm state (default "SA")
  └─ useEffect: when country changes AND mode=cart → re-fetch /orders/cart/?country=X
  └─ checkout session payload includes country in delivery object

CommunityPaymentMethodPage
  └─ reads country from session.delivery.country (fallback "SA")
  └─ fetches /orders/cart/?country=X on mount
  └─ tax in Order Summary reflects user's chosen country
```

---

## Detailed Changes

### 1. `backend/zewadi/tax/views.py`

Add `tax_countries` view:

```python
GCC_NAMES = {"SA": "Saudi Arabia", "AE": "UAE", "BH": "Bahrain", "OM": "Oman", "KW": "Kuwait", "QA": "Qatar"}

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
```

### 2. `backend/zewadi/tax/urls.py`

Add:
```python
path("countries/", views.tax_countries, name="tax-countries"),
```

### 3. `frontend/src/components/communityUsers/myorder/orderDetails/types.ts`

Add `country: string` to `DeliveryForm`.

### 4. `frontend/src/components/communityUsers/myorder/orderDetails/DeliveryInformation.tsx`

- Fetch `/tax/countries/` on mount, store in local state
- Render a `<select>` for country, placed after City/Postal Code row
- On error/empty response, fall back to `[{ code: "SA", name: "Saudi Arabia" }]`
- Default selected value is `"SA"`

### 5. `frontend/src/components/communityUsers/myorder/orderDetails/OrderPage.tsx`

- Add `country: "SA"` to `initialForm`
- Add `useEffect` that watches `deliveryForm.country`: when it changes and `isCartCheckout`, call `/orders/cart/?country=X` and update cart summary state
- Include `country` in the cart checkout session payload under `delivery`

### 6. `frontend/src/components/communityUsers/payment/CommunityPaymentMethodPage.tsx`

- Add `country` to the `DeliveryPayload` type
- When loading cart: read `country` from `session.delivery?.country ?? "SA"` and pass as `?country=X`

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| `/tax/countries/` fetch fails | Falls back to `[{ code: "SA", name: "Saudi Arabia" }]` |
| Cart re-fetch on country change fails | Show toast "Could not update tax estimate", keep previous summary |
| Session has no country | Payment page defaults to `"SA"` |

---

## What Is NOT changing

- The `DEFAULT_TAX_COUNTRY = "SA"` backend setting remains — it still protects API calls that don't pass a country param
- Single-product checkout flow (`mode: "single"`) shows `tax: "0.00"` as before — no change
- Admin dashboard tax configuration UI is not touched
- No changes to order creation logic or `Order` model

---

## Success Criteria

1. Country dropdown appears in delivery form, populated from the backend
2. Changing country updates the "Estimated Tax" line in the order summary live
3. Payment page shows the same tax as the order summary
4. Adding a new country+rate in the admin tax dashboard automatically makes it available in the dropdown (no frontend deploy needed)
5. SA is always the default
5. Checkout still works if the countries endpoint fails
