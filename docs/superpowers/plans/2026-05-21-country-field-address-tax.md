# Country Field in Delivery Address with Dynamic Tax — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a country dropdown to the delivery address form that is populated from active backend tax rates, defaults to SA, and causes the cart tax to update live when the country changes.

**Architecture:** A new `GET /api/tax/countries/` endpoint returns distinct active-rate country codes. `DeliveryInformation` fetches this list and renders a `<select>`. `OrderPage` re-fetches the cart with `?country=X` when the selection changes and stores the country in the checkout session. `CommunityPaymentMethodPage` reads the country from the session and passes it when loading the cart summary.

**Tech Stack:** Django REST Framework, Django TestCase + APIClient, Next.js 16 App Router, React 19, TypeScript, Axios (`api` service)

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/tax/views.py` |
| Modify | `backend/zewadi/tax/urls.py` |
| Modify | `backend/zewadi/tax/tests.py` |
| Modify | `frontend/src/components/communityUsers/myorder/orderDetails/types.ts` |
| Modify | `frontend/src/components/communityUsers/myorder/orderDetails/DeliveryInformation.tsx` |
| Modify | `frontend/src/components/communityUsers/myorder/orderDetails/OrderPage.tsx` |
| Modify | `frontend/src/components/communityUsers/payment/CommunityPaymentMethodPage.tsx` |

---

## Task 1: Backend — `/api/tax/countries/` endpoint

**Files:**
- Modify: `backend/zewadi/tax/views.py`
- Modify: `backend/zewadi/tax/urls.py`
- Modify: `backend/zewadi/tax/tests.py`

- [ ] **Step 1: Write failing tests**

Open `backend/zewadi/tax/tests.py` and append this class after `GetTaxRateTests`:

```python
import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

# (these imports are already at the top of the file — don't duplicate them)

User = get_user_model()


class TaxCountriesViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="taxcountries@example.com", password="pass1234")
        self.client.force_authenticate(user=self.user)

        standard, _ = TaxCategory.objects.get_or_create(
            code="STANDARD", defaults={"name": "Standard Rate"}
        )
        # SA — active (may already exist from seed migration; get_or_create is safe)
        TaxRate.objects.get_or_create(
            country="SA", tax_category=standard, region=None, is_active=True,
            defaults={
                "rate": Decimal("0.15"),
                "name": "SA Standard VAT",
                "effective_from": datetime.date(2020, 1, 1),
            },
        )
        # AE — active (new)
        TaxRate.objects.get_or_create(
            country="AE", tax_category=standard, region=None, is_active=True,
            defaults={
                "rate": Decimal("0.05"),
                "name": "AE VAT",
                "effective_from": datetime.date(2020, 1, 1),
            },
        )
        # BH — inactive (should be excluded)
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test tax.tests.TaxCountriesViewTests -v 2
```

Expected: 3 failures with `404 Not Found` or `AttributeError: module 'tax.views' has no attribute 'tax_countries'`.

- [ ] **Step 3: Implement the view**

Open `backend/zewadi/tax/views.py`. At the top of the file, after the existing imports, add the `GCC_NAMES` constant and the view. Add these after the existing `tax_rate_detail` function:

```python
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
```

- [ ] **Step 4: Register the URL**

Open `backend/zewadi/tax/urls.py`. Add the new route:

```python
from django.urls import path

from . import views

urlpatterns = [
    path("currencies/", views.currency_list, name="currency-list"),
    path("currencies/all/", views.currency_list_all, name="currency-list-all"),
    path("categories/", views.tax_category_list, name="tax-category-list"),
    path("rates/", views.tax_rate_list, name="tax-rate-list"),
    path("rates/<int:pk>/", views.tax_rate_detail, name="tax-rate-detail"),
    path("countries/", views.tax_countries, name="tax-countries"),
]
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test tax.tests.TaxCountriesViewTests -v 2
```

Expected: `Ran 3 tests ... OK`

- [ ] **Step 6: Run the full tax test suite to confirm no regressions**

```bash
cd backend/zewadi
python manage.py test tax -v 2
```

Expected: All existing tests still pass.

- [ ] **Step 7: Commit**

```bash
git add backend/zewadi/tax/views.py backend/zewadi/tax/urls.py backend/zewadi/tax/tests.py
git commit -m "feat(tax): add /api/tax/countries/ endpoint returning active-rate countries"
```

---

## Task 2: Frontend — Add `country` to `DeliveryForm` type and `DeliveryInformation` component

**Files:**
- Modify: `frontend/src/components/communityUsers/myorder/orderDetails/types.ts`
- Modify: `frontend/src/components/communityUsers/myorder/orderDetails/DeliveryInformation.tsx`

- [ ] **Step 1: Add `country` to `DeliveryForm`**

Open `frontend/src/components/communityUsers/myorder/orderDetails/types.ts`. Replace the entire file content:

```typescript
export type PackOption = {
  id: string;
  name: string;
  price: number;
  unitNote: string;
  badge?: string;
};

export type DeliveryForm = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  postalCode: string;
  address: string;
  instructions: string;
  country: string;
};

export type PaymentMethod = "cod";
```

- [ ] **Step 2: Update `DeliveryInformation.tsx` to fetch countries and render the select**

Open `frontend/src/components/communityUsers/myorder/orderDetails/DeliveryInformation.tsx`. Replace the entire file:

```tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { DeliveryForm } from "./types";

type Country = { code: string; name: string };

const FALLBACK_COUNTRIES: Country[] = [{ code: "SA", name: "Saudi Arabia" }];

type Props = {
  form: DeliveryForm;
  onChange: <K extends keyof DeliveryForm>(field: K, value: DeliveryForm[K]) => void;
};

const inputClass =
  "h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F4F6] px-3 text-sm text-[#0A4833] placeholder:text-[#8A8A8A] outline-none focus:border-[#0A4833]";

export default function DeliveryInformation({ form, onChange }: Props) {
  const [countries, setCountries] = useState<Country[]>(FALLBACK_COUNTRIES);

  useEffect(() => {
    api
      .get<Country[]>("/tax/countries/")
      .then((res) => {
        if (res.data.length > 0) setCountries(res.data);
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h3 className="text-xl font-semibold text-[#0A4833]">Delivery Information</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">Full Name</label>
          <input className={inputClass} value={form.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">Phone Number</label>
          <input className={inputClass} value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Email Address</label>
          <input className={inputClass} value={form.email} onChange={(e) => onChange("email", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">City</label>
          <input className={inputClass} value={form.city} onChange={(e) => onChange("city", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">Postal Code</label>
          <input className={inputClass} value={form.postalCode} onChange={(e) => onChange("postalCode", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Country</label>
          <select
            className={inputClass}
            value={form.country}
            onChange={(e) => onChange("country", e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Delivery Address</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-[#DFDFDF] bg-[#F3F4F6] p-3 text-sm text-[#0A4833] placeholder:text-[#8A8A8A] outline-none focus:border-[#0A4833]"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Delivery Instructions (Optional)</label>
          <input
            className={inputClass}
            value={form.instructions}
            onChange={(e) => onChange("instructions", e.target.value)}
            placeholder="e.g. Ring the doorbell"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run lint to catch type errors**

```bash
cd frontend
npm run lint
```

Expected: No errors. (TypeScript will complain about `country` being missing from `initialForm` in `OrderPage.tsx` — that's expected and will be fixed in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/communityUsers/myorder/orderDetails/types.ts \
        frontend/src/components/communityUsers/myorder/orderDetails/DeliveryInformation.tsx
git commit -m "feat(checkout): add country field to DeliveryForm and DeliveryInformation component"
```

---

## Task 3: Frontend — Wire country into `OrderPage` (live tax re-fetch + session payload)

**Files:**
- Modify: `frontend/src/components/communityUsers/myorder/orderDetails/OrderPage.tsx`

- [ ] **Step 1: Add `country` to `initialForm`**

Open `frontend/src/components/communityUsers/myorder/orderDetails/OrderPage.tsx`.

Find `initialForm` (around line 77):

```typescript
const initialForm: DeliveryForm = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  postalCode: "",
  address: "",
  instructions: "",
};
```

Replace with:

```typescript
const initialForm: DeliveryForm = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  postalCode: "",
  address: "",
  instructions: "",
  country: "SA",
};
```

- [ ] **Step 2: Add `useRef` import and the country-change effect**

At the top of `OrderPage.tsx`, `useRef` is not currently imported. Find the existing React import line:

```typescript
import { useEffect, useMemo, useState } from "react";
```

Replace with:

```typescript
import { useEffect, useMemo, useRef, useState } from "react";
```

Then, inside the `OrderPage` component, declare the ref alongside the other state declarations (around line 164, after the `busyProductId` state):

```typescript
const isFirstCountryRender = useRef(true);
```

After all the existing `useEffect` hooks (around line 270, after the `requestedQuantity` effect), add:

```typescript
useEffect(() => {
  if (isFirstCountryRender.current) {
    isFirstCountryRender.current = false;
    return;
  }
  if (!isCartCheckout) return;

  async function refreshCartTax() {
    try {
      const res = await api.get<CartResponse>(`/orders/cart/?country=${deliveryForm.country}`);
      setCartItems(res.data.items);
      setCartSummary(res.data.summary);
    } catch {
      toast.error("Could not update tax estimate.");
    }
  }

  void refreshCartTax();
}, [deliveryForm.country, isCartCheckout]);
```

**Important:** The `useRef` declaration must be inside the component function body, not at module level.

- [ ] **Step 3: Include `country` in the cart checkout session payload**

Inside the `placeOrder` function (around line 327), find the cart checkout branch that builds the payload:

```typescript
const payload = {
  mode: "cart" as const,
  delivery: {
    full_name: deliveryForm.fullName.trim(),
    phone: deliveryForm.phone.trim(),
    email: deliveryForm.email.trim(),
    city: deliveryForm.city.trim(),
    postal_code: deliveryForm.postalCode.trim(),
    address: deliveryForm.address.trim(),
    instructions: deliveryForm.instructions.trim(),
  },
};
```

Replace with:

```typescript
const payload = {
  mode: "cart" as const,
  delivery: {
    full_name: deliveryForm.fullName.trim(),
    phone: deliveryForm.phone.trim(),
    email: deliveryForm.email.trim(),
    city: deliveryForm.city.trim(),
    postal_code: deliveryForm.postalCode.trim(),
    address: deliveryForm.address.trim(),
    instructions: deliveryForm.instructions.trim(),
    country: deliveryForm.country,
  },
};
```

- [ ] **Step 4: Run lint**

```bash
cd frontend
npm run lint
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/communityUsers/myorder/orderDetails/OrderPage.tsx
git commit -m "feat(checkout): live cart tax re-fetch on country change, pass country in session"
```

---

## Task 4: Frontend — `CommunityPaymentMethodPage` reads country from session

**Files:**
- Modify: `frontend/src/components/communityUsers/payment/CommunityPaymentMethodPage.tsx`

- [ ] **Step 1: Add `country` to `DeliveryPayload` type**

Open `frontend/src/components/communityUsers/payment/CommunityPaymentMethodPage.tsx`.

Find the `DeliveryPayload` type (line 20):

```typescript
type DeliveryPayload = {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  postal_code: string;
  address: string;
  instructions: string;
};
```

Replace with:

```typescript
type DeliveryPayload = {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  postal_code: string;
  address: string;
  instructions: string;
  country?: string;
};
```

- [ ] **Step 2: Pass country when loading the cart**

Inside the `loadCart` function (around line 145), find:

```typescript
const response = await api.get<CartResponse>("/orders/cart/");
```

Replace with:

```typescript
const country = session.delivery.country ?? "SA";
const response = await api.get<CartResponse>(`/orders/cart/?country=${country}`);
```

At this point in `loadCart`, TypeScript narrows `session` to `CartCheckoutSession` (after the `mode !== "cart"` guard), so `session.delivery` is `DeliveryPayload` and `.country` is `string | undefined`.

- [ ] **Step 3: Run lint and build**

```bash
cd frontend
npm run lint && npm run build
```

Expected: No type errors, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/communityUsers/payment/CommunityPaymentMethodPage.tsx
git commit -m "feat(payment): pass country from checkout session to cart API for correct tax"
```

---

## Verification Checklist

After all 4 tasks are done, manually verify:

1. Open the order/checkout page at `/communityDashBoard/products/order?cart=1`
2. Confirm a **Country** dropdown appears in the Delivery Information form
3. Confirm it lists only countries that have active tax rates in the admin dashboard (Settings → Tax & Currency)
4. Change the country — confirm the **Tax** line in the Order Summary updates to match the new rate
5. Click "Continue to Payment" — confirm the **Estimated Tax** on the payment page matches the selected country's rate
6. Add a new country+rate in the admin dashboard — without a frontend redeploy, refresh the checkout page and confirm the new country appears in the dropdown
