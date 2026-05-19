# Tax System Design — Zawadi GCC E-Commerce

**Date:** 2026-05-19  
**Status:** Approved  
**Author:** Brainstorming session with Hiran

---

## Context

Zawadi currently applies a hardcoded 8% flat tax rate (`TAX_RATE = Decimal("0.08")`) in `backend/zewadi/orders/views.py:24`. This is wrong for production — Saudi Arabia (primary market) charges 15% VAT, and the platform is expanding to UAE (5%), Bahrain (10%), and Oman (5%). The system needs to be configurable by admin without code deployments, support per-product tax categories, and comply with Saudi ZATCA invoice requirements.

---

## Goals

- Replace hardcoded tax rate with admin-configurable, database-backed rates
- Support per-product tax categories (Standard Rate, Zero-Rated, Exempt)
- Apply the correct rate based on the order's delivery country (ISO 3166-1 alpha-2)
- Display prices tax-inclusive on the frontend (GCC legal requirement and industry standard)
- Show VAT as a clearly labelled line item at cart and checkout
- Snapshot the tax rate and country on every order for audit/accounting
- Display ZATCA-required fields (seller TRN) on order confirmation
- Design for future global expansion (nullable `region` field for US/India)

---

## Out of Scope

- Full ZATCA Fatoorah XML e-invoicing integration (separate phase)
- US state/county-level tax jurisdiction (hook exists via nullable `region` field)
- India GST (CGST/SGST/IGST) split — hook exists, not implemented
- Tax-exempt customers (e.g., resellers, charities)

---

## Data Models

### New: `tax` Django App

#### `TaxCategory`
Classifies products for tax purposes.

| Field | Type | Notes |
|-------|------|-------|
| `id` | AutoField | |
| `name` | CharField(100) | e.g. "Standard Rate", "Zero-Rated", "Exempt" |
| `code` | SlugField(20, unique) | e.g. "STANDARD", "ZERO", "EXEMPT" |
| `description` | TextField(blank) | Optional explanation |
| `is_active` | BooleanField(default=True) | |

**Initial seed data:**
- Standard Rate / STANDARD
- Zero-Rated / ZERO
- Exempt / EXEMPT

#### `TaxRate`
Maps a country + category to a percentage, with history support.

| Field | Type | Notes |
|-------|------|-------|
| `id` | AutoField | |
| `country` | CharField(2) | ISO 3166-1 alpha-2: "SA", "AE", "BH", "OM" |
| `region` | CharField(10, null, blank) | Future: US state, India state. Null for all current markets |
| `tax_category` | ForeignKey(TaxCategory) | |
| `rate` | DecimalField(5,4) | e.g. 0.1500 for 15% |
| `name` | CharField(100) | e.g. "Saudi VAT Standard Rate 15%" |
| `effective_from` | DateField | Rate valid from this date |
| `is_active` | BooleanField(default=True) | Only one active row per country+category at a time |
| `created_at` | DateTimeField(auto_now_add) | |

**Unique constraint:** `(country, region, tax_category, is_active)` where `is_active=True` — enforced via `UniqueConstraint` with condition.

**Initial seed data:**
| country | tax_category | rate | name | effective_from |
|---------|-------------|------|------|----------------|
| SA | STANDARD | 0.1500 | Saudi VAT Standard Rate | 2020-07-01 |
| SA | ZERO | 0.0000 | Saudi VAT Zero-Rated | 2020-07-01 |
| SA | EXEMPT | 0.0000 | Saudi VAT Exempt | 2020-07-01 |

---

### Modified: `product` App

**`Product` model — add one field:**
```python
tax_category = models.ForeignKey(
    'tax.TaxCategory',
    on_delete=models.PROTECT,
    null=True,  # nullable during migration only
    related_name='products',
)
```
Migration strategy: add as nullable → backfill all existing products to Standard Rate → remove null=True.

---

### Modified: `orders` App

**`Order` model — add two snapshot fields:**
```python
tax_rate_snapshot = models.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0'))
tax_country_snapshot = models.CharField(max_length=2, blank=True, default='')
```
These are written at checkout time and never updated. Existing `tax_amount` field is preserved.

---

## Service Layer

### `tax/services.py` — `get_tax_rate(country: str, tax_category_code: str) -> Decimal`

Single function centralising all tax lookups. All views call this; nothing calculates tax inline.

```python
def get_tax_rate(country: str, tax_category_code: str) -> Decimal:
    """
    Returns the active tax rate for a given country and category code.
    Falls back to 0 if no rate is configured (e.g. Qatar, Kuwait — no VAT yet).
    """
    try:
        rate_obj = TaxRate.objects.get(
            country=country.upper(),
            region__isnull=True,
            tax_category__code=tax_category_code,
            is_active=True,
        )
        return rate_obj.rate
    except TaxRate.DoesNotExist:
        return Decimal('0')
```

---

## Pricing Strategy

**Database:** Prices stored **tax-exclusive** (`selling_price` = base price before VAT).  
**Frontend display:** Always shows **tax-inclusive** price (`selling_price × (1 + rate)`).  
**Checkout breakdown:** VAT shown as a separate labelled line item.

This matches Amazon.sa and Noon — one product price works across all GCC countries; only the displayed inclusive amount changes per market.

### Tax Calculation at Checkout

```
For each cart item:
    country = delivery_address.country  (ISO code)
    rate = get_tax_rate(country, product.tax_category.code)
    item_tax = item.selling_price × rate

subtotal = Σ item.selling_price          (tax-exclusive)
tax_total = Σ item_tax
shipping  = (free if subtotal ≥ threshold, else standard charge)
            shipping is VAT-exempt — standard GCC practice
total = subtotal + shipping + tax_total
```

Rounding: `ROUND_HALF_UP` to 2 decimal places per item tax, final sum for `tax_total`. Last-item remainder correction preserved from existing implementation.

### Guest Cart

Delivery country unknown until address is entered. Guest cart continues to show `tax="0"` with label "VAT (estimated at checkout)" — consistent with current behaviour.

### Logged-in User Without a Saved Address

If a logged-in user has no delivery address on file, the cart defaults to the store's primary market country. This is controlled by a Django setting `DEFAULT_TAX_COUNTRY = "SA"` (in `settings.py`). The frontend labels this as "VAT (estimated)" until an address is confirmed.

---

## API Changes

### `GET /orders/cart/` — `CartSummary` response

Add two fields to the existing response:
```json
{
  "subtotal": "100.00",
  "shipping": "5.00",
  "tax": "15.00",
  "tax_rate": "0.1500",
  "tax_country": "SA",
  "total": "120.00"
}
```
Frontend uses `tax_rate` and `tax_country` to render the label "VAT 15% (SA)" instead of "Estimated Tax".

---

## Frontend Changes

### Product Cards (`productcards.tsx`)
- New utility: `formatInclusivePrice(sellingPrice: number, taxRate: number): string`  
  → `(sellingPrice * (1 + taxRate)).toFixed(2)`
- Display: `SAR 115.00` with a small `incl. VAT` label below — matches Amazon.sa pattern
- Tax rate passed down from a store-level config endpoint or injected into page props

### Cart Page (`cart/page.tsx`)
- "Estimated Tax" label → `"VAT (${(tax_rate * 100).toFixed(0)}%)"` e.g. "VAT (15%)"
- `CartSummary` type gains `tax_rate: string` and `tax_country: string`

### Checkout Page (`checkout/page.tsx`)
- Same label update as cart
- Order confirmation shows seller TRN: read from `NEXT_PUBLIC_ZATCA_TRN` env var

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `ZATCA_TRN` | backend `.env` | Seller VAT Registration Number shown on invoices |
| `NEXT_PUBLIC_ZATCA_TRN` | frontend `.env.local` | TRN displayed on order confirmation page |

---

## Admin Interface

Both models registered in Django admin with list display and filters:

**TaxCategory admin:** list_display = name, code, is_active  
**TaxRate admin:** list_display = country, tax_category, rate, effective_from, is_active; list_filter = country, is_active

Product form gains a `tax_category` dropdown (default: Standard Rate). This is the only day-to-day change for product managers.

---

## Existing Code Preserved

- `Order.tax_amount` — field stays, continues to store the calculated tax amount
- `supperadmin/views.py` tax aggregation reports — unchanged, still sum `tax_amount`
- Excel exports — unchanged
- Rounding logic (`ROUND_HALF_UP`, last-item remainder correction) — preserved in new service

---

## Migration Sequence (zero downtime)

1. Create `tax` app: `TaxCategory` + `TaxRate` models + seed data migration
2. Add `tax_category` FK to `Product` (nullable)
3. Data migration: set all existing products to Standard Rate
4. Make `tax_category` non-nullable
5. Add `tax_rate_snapshot` + `tax_country_snapshot` to `Order`
6. Replace `TAX_RATE` constant in `orders/views.py` with `get_tax_rate()` call
7. Update `CartSummary` API response to include `tax_rate` + `tax_country`
8. Update frontend: price display utility, cart/checkout labels, TRN display
9. Add `ZATCA_TRN` / `NEXT_PUBLIC_ZATCA_TRN` to env files

---

## Future Expansion

### Adding a new GCC country (e.g. UAE)
Admin adds via Django admin — no code change:
```
country: AE, tax_category: STANDARD, rate: 0.0500, effective_from: 2026-01-01
```

### If a country changes its rate (e.g. SA raised 5%→15% in 2021)
1. Set old row `is_active=False`
2. Add new row with new rate + `effective_from` date
3. Historical orders retain their `tax_rate_snapshot` — invoices stay accurate

### US / India (future)
`region` field on `TaxRate` is nullable — add state-level rows without schema changes.  
US would require a third-party service (Avalara/TaxJar) for jurisdiction resolution — out of scope.

---

## Testing

- Unit test `get_tax_rate()`: SA standard → 0.15, SA zero-rated → 0.00, unknown country → 0.00
- Update existing order test (`subtotal=240.00`): expected `tax_amount=36.00` (15%) not 19.20 (8%)
- Test checkout with mixed cart (1 standard item + 1 zero-rated item)
- Test `tax_rate_snapshot` and `tax_country_snapshot` are written correctly on order creation
