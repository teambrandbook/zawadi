# Tax & Currency System Design — Zawadi GCC E-Commerce

**Date:** 2026-05-19  
**Status:** Approved  
**Author:** Brainstorming session with Hiran

---

## Context

Two problems in the current codebase:

**Tax:** A hardcoded `TAX_RATE = Decimal("0.08")` (8%) in `orders/views.py:24`. Saudi Arabia charges 15% VAT; UAE 5%, Bahrain 10%, Oman 5%. The single hardcoded rate is wrong for production and not admin-configurable.

**Currency:** A `currency = CharField(choices=[USD, INR, AED])` on `Product` (`product/models.py:83`) that defaults to USD. SAR is not even in the choices list. The field has no connection to checkout logic — it stores a label but does nothing. This is a dead-end design.

---

## Goals

- Replace hardcoded tax rate with admin-configurable, database-backed rates per country + product category
- Apply the correct VAT rate based on the order's delivery country
- Display prices tax-inclusive on the frontend (GCC legal requirement; Amazon.sa / Noon standard)
- Show VAT as a clearly labelled line item at cart and checkout
- Replace the broken per-product `currency` field with a proper `ProductCountryPrice` model
- Show customers prices in their local currency (SAR, AED, BHD, OMR)
- Snapshot tax rate, country, charged currency, and charged amount on every Order for accounting and gateway-readiness
- Display ZATCA-required fields (seller TRN) on order confirmation
- Design for payment gateway integration without schema changes

---

## Out of Scope

- Full ZATCA Fatoorah XML e-invoicing integration (separate phase)
- Live exchange rate API (commercial prices set per country, not converted)
- US state/county-level tax jurisdiction (hook exists via nullable `region` field)
- India GST (CGST/SGST/IGST) split — hook exists, not implemented
- Tax-exempt customers (e.g., resellers, charities)
- Payment gateway implementation (this spec lays the data hooks; gateway is next phase)

---

## Data Models

### New: `tax` Django App

This app owns all country-level configuration: tax rates, currencies, and the country→currency mapping.

---

#### `Currency`
Master list of currencies Zawadi operates in.

| Field | Type | Notes |
|-------|------|-------|
| `code` | CharField(3, unique) | ISO 4217: "SAR", "AED", "BHD", "OMR" |
| `name` | CharField(100) | e.g. "Saudi Riyal" |
| `symbol` | CharField(10) | e.g. "SAR" — ISO code used as symbol for English UI |
| `decimal_places` | PositiveSmallIntegerField | SAR/AED/OMR = 2, BHD = 3 |
| `is_active` | BooleanField(default=True) | |

**Initial seed data:**
| code | name | symbol | decimal_places |
|------|------|--------|----------------|
| SAR | Saudi Riyal | SAR | 2 |
| AED | UAE Dirham | AED | 2 |
| BHD | Bahraini Dinar | BHD | 3 |
| OMR | Omani Rial | OMR | 3 |

Note: BHD and OMR use 3 decimal places — this must be respected in all price formatting and storage.

---

#### `CountryConfig`
Maps each market country to its operating currency. Single source of truth for "what currency does SA use?"

| Field | Type | Notes |
|-------|------|-------|
| `country` | CharField(2, unique) | ISO 3166-1 alpha-2: "SA", "AE", "BH", "OM" |
| `name` | CharField(100) | e.g. "Saudi Arabia" |
| `currency` | ForeignKey(Currency) | |
| `is_active` | BooleanField(default=True) | |

**Initial seed data:**
| country | name | currency |
|---------|------|----------|
| SA | Saudi Arabia | SAR |
| AE | United Arab Emirates | AED |
| BH | Bahrain | BHD |
| OM | Oman | OMR |

---

#### `TaxCategory`
Classifies products for tax purposes.

| Field | Type | Notes |
|-------|------|-------|
| `name` | CharField(100) | e.g. "Standard Rate", "Zero-Rated", "Exempt" |
| `code` | SlugField(20, unique) | e.g. "STANDARD", "ZERO", "EXEMPT" |
| `description` | TextField(blank) | |
| `is_active` | BooleanField(default=True) | |

**Initial seed data:** Standard Rate / STANDARD, Zero-Rated / ZERO, Exempt / EXEMPT

---

#### `TaxRate`
Maps a country + category to a percentage, with history support.

| Field | Type | Notes |
|-------|------|-------|
| `country` | CharField(2) | ISO 3166-1 alpha-2 |
| `region` | CharField(10, null, blank) | Future: US state, India state. Null for all GCC |
| `tax_category` | ForeignKey(TaxCategory) | |
| `rate` | DecimalField(5,4) | e.g. 0.1500 for 15% |
| `name` | CharField(100) | e.g. "Saudi VAT Standard Rate 15%" |
| `effective_from` | DateField | Rate is valid from this date |
| `is_active` | BooleanField(default=True) | Set old row False, add new row for rate changes |
| `created_at` | DateTimeField(auto_now_add) | |

**Unique constraint:** `(country, region, tax_category)` where `is_active=True`.

**Initial seed data:**
| country | tax_category | rate | effective_from |
|---------|-------------|------|----------------|
| SA | STANDARD | 0.1500 | 2020-07-01 |
| SA | ZERO | 0.0000 | 2020-07-01 |
| SA | EXEMPT | 0.0000 | 2020-07-01 |

---

### Modified: `product` App

#### Remove
- `CurrencyChoices` class (entire class deleted)
- `currency = CharField(...)` on `Product` (replaced by `ProductCountryPrice`)

#### Add: `ProductCountryPrice`
Stores the commercial selling price per product per country in that country's local currency. This is how Amazon.sa and Noon manage multi-country pricing — no live exchange rates, commercial prices set per market.

| Field | Type | Notes |
|-------|------|-------|
| `product` | ForeignKey(Product, CASCADE) | |
| `country` | CharField(2) | ISO code |
| `currency` | ForeignKey(tax.Currency, PROTECT) | |
| `selling_price` | DecimalField(10, 3) | 3 dp handles BHD/OMR; SAR/AED always end in .00x |
| `is_active` | BooleanField(default=True) | |

**Unique constraint:** `(product, country)`

When a product is created with an SA price, a `ProductCountryPrice` row is created automatically for SA/SAR. Adding UAE pricing later = adding an AE/AED row. No exchange rate logic.

#### Add to `Product`
```python
tax_category = models.ForeignKey(
    'tax.TaxCategory',
    on_delete=models.PROTECT,
    null=True,  # nullable during migration only
    related_name='products',
)
```
Migration strategy: add nullable → backfill all existing products to Standard Rate → make non-nullable.

The existing `selling_price` field on `Product` is preserved as the SAR base price. Migration creates `ProductCountryPrice(SA, SAR, product.selling_price)` for all existing products.

---

### Modified: `orders` App

**`Order` model — add four snapshot fields:**

```python
tax_rate_snapshot = models.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0'))
tax_country_snapshot = models.CharField(max_length=2, blank=True, default='')
charged_currency = models.CharField(max_length=3, default='SAR')
charged_amount = models.DecimalField(max_digits=10, decimal_places=3, default=Decimal('0'))
```

- `tax_rate_snapshot` + `tax_country_snapshot` — audit trail for invoices; never updated after creation
- `charged_currency` + `charged_amount` — payment gateway hook; the exact currency and amount that will be/was charged. For now always SAR = `total_amount`. When the gateway is wired up, these fields are read directly by the payment initiation view — no schema change needed.

Existing `tax_amount` and `total_amount` fields are preserved.

---

## Service Layer (`tax/services.py`)

Two functions. Nothing outside this file does currency or tax lookups.

### `get_tax_rate(country, tax_category_code) → Decimal`

```python
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
        return Decimal('0')  # Qatar/Kuwait: no VAT configured → 0
```

### `get_product_price(product, country) → (Decimal, Currency)`

```python
def get_product_price(product, country: str):
    try:
        cp = ProductCountryPrice.objects.select_related('currency').get(
            product=product,
            country=country.upper(),
            is_active=True,
        )
        return cp.selling_price, cp.currency
    except ProductCountryPrice.DoesNotExist:
        # Fallback to SAR base price if no country-specific price is set
        sar = Currency.objects.get(code='SAR')
        return product.selling_price, sar
```

---

## Pricing Strategy

**Storage:** Prices in `ProductCountryPrice` are tax-exclusive in the local currency.  
**Display:** Always tax-inclusive. `display_price = selling_price × (1 + tax_rate)`  
**Checkout:** VAT shown as a separate labelled line item.  

### Full Checkout Calculation

```
country = delivery_address.country   (or DEFAULT_TAX_COUNTRY = "SA")

For each cart item:
    price, currency = get_product_price(product, country)
    rate            = get_tax_rate(country, product.tax_category.code)
    item_tax        = price × rate  [ROUND_HALF_UP, 3 dp]

subtotal     = Σ price              (tax-exclusive, local currency)
tax_total    = Σ item_tax
shipping     = free if subtotal ≥ threshold, else standard charge
               shipping is VAT-exempt — standard GCC practice
total        = subtotal + shipping + tax_total

Order fields written at checkout:
    tax_amount           = tax_total
    total_amount         = total
    tax_rate_snapshot    = the rate applied to this specific Order's item
                           (each cart item creates one Order; zero-rated items snapshot 0.0000)
    tax_country_snapshot = country
    charged_currency     = currency.code
    charged_amount       = total   ← payment gateway reads this
```

Rounding: `ROUND_HALF_UP` to `currency.decimal_places` at every step. Last-item remainder correction preserved.

### Default Country / Guest Cart

| Scenario | Country used | Tax label |
|----------|-------------|-----------|
| Guest cart | None | "VAT (estimated at checkout)" |
| Logged-in, no address | `DEFAULT_TAX_COUNTRY = "SA"` (Django setting) | "VAT (estimated)" |
| Logged-in, address on file | Delivery address country | "VAT (15%)" |

---

## API Changes

### Product list / detail

Products API returns price and currency for the requesting country. Country passed as query param, defaults to SA.

```
GET /api/product/products/?country=SA
```

Response gains two fields per product:
```json
{
  "selling_price": "100.000",
  "display_price": "115.000",
  "currency_code": "SAR",
  "currency_symbol": "SAR",
  "currency_decimal_places": 2
}
```
`display_price` = `selling_price × (1 + tax_rate)` — tax-inclusive, ready to render.  
`selling_price` is still returned for cart calculations.

### `GET /orders/cart/` — `CartSummary` response

```json
{
  "subtotal": "100.000",
  "shipping": "5.000",
  "tax": "15.000",
  "tax_rate": "0.1500",
  "tax_country": "SA",
  "currency_code": "SAR",
  "currency_symbol": "SAR",
  "currency_decimal_places": 2,
  "total": "120.000"
}
```

---

## Frontend Changes

### New utility: `formatPrice(amount, currency)`

```ts
// src/utils/formatPrice.ts
export function formatPrice(
  amount: number | string,
  currencyCode: string,
  decimalPlaces: number = 2
): string {
  return `${currencyCode} ${Number(amount).toFixed(decimalPlaces)}`
  // e.g. "SAR 115.00" | "BHD 38.500" | "AED 157.75"
}

export function formatInclusivePrice(
  sellingPrice: number,
  taxRate: number,
  currencyCode: string,
  decimalPlaces: number = 2
): string {
  return formatPrice(sellingPrice * (1 + taxRate), currencyCode, decimalPlaces)
}
```

### Redux store

Add currency state to user/session slice, populated when delivery country is known:
```ts
currency: {
  code: string        // "SAR"
  symbol: string      // "SAR"
  decimalPlaces: number  // 2
}
```

### Product Cards (`productcards.tsx`)
- Show `display_price` from API (already inclusive) with `currency_code` prefix
- Small `incl. VAT` label — matches Amazon.sa pattern
- Falls back to SAR when no session currency set

### Cart Page (`cart/page.tsx`)
- All amounts rendered with `formatPrice(amount, currency_code, decimal_places)`
- "Estimated Tax" → `"VAT (${(tax_rate * 100).toFixed(0)}%)"` e.g. "VAT (15%)"
- `CartSummary` type updated to include currency fields

### Checkout Page (`checkout/page.tsx`)
- Same currency formatting throughout
- Order confirmation: show seller TRN from `NEXT_PUBLIC_ZATCA_TRN`
- Order confirmation: show `charged_currency` + `charged_amount` (ready for gateway receipt)

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `ZATCA_TRN` | backend `.env` | Seller VAT Registration Number |
| `NEXT_PUBLIC_ZATCA_TRN` | frontend `.env.local` | TRN on order confirmation |
| `DEFAULT_TAX_COUNTRY` | `settings.py` | Fallback country for users with no address (default: "SA") |

---

## Admin Interface

| Model | Admin config |
|-------|-------------|
| `Currency` | list_display: code, name, decimal_places, is_active |
| `CountryConfig` | list_display: country, name, currency, is_active |
| `TaxCategory` | list_display: name, code, is_active |
| `TaxRate` | list_display: country, tax_category, rate, effective_from, is_active; filter: country, is_active |
| `ProductCountryPrice` | Inline on Product admin — table: Country, Currency, Price |

**Product creation form changes:**
- `tax_category` dropdown (default: Standard Rate)
- `ProductCountryPrice` inline — SA/SAR row pre-filled from `selling_price`, other countries added as markets open
- Old `currency` CharField dropdown removed

---

## Existing Code Preserved

- `Order.tax_amount` + `Order.total_amount` — stay, continue to work
- `Product.selling_price` — stays as SAR base price, also seeded into `ProductCountryPrice`
- `supperadmin/views.py` tax aggregation reports — unchanged
- Excel exports — unchanged
- Rounding logic (`ROUND_HALF_UP`, last-item remainder correction) — preserved

---

## Migration Sequence (zero downtime)

1. Create `tax` app: `Currency` + `CountryConfig` + `TaxCategory` + `TaxRate` models + seed data
2. Create `ProductCountryPrice` model in `product` app
3. Data migration: for every existing `Product`, create `ProductCountryPrice(SA, SAR, product.selling_price)`
4. Add `tax_category` FK to `Product` (nullable)
5. Data migration: set all products to Standard Rate
6. Make `tax_category` non-nullable
7. Remove `CurrencyChoices` class and `currency` CharField from `Product`
8. Add `tax_rate_snapshot`, `tax_country_snapshot`, `charged_currency`, `charged_amount` to `Order`
9. Replace `TAX_RATE` constant in `orders/views.py` with service calls
10. Update products API to accept `?country=` and return `display_price`, `currency_code`
11. Update `CartSummary` API to include currency fields
12. Update frontend: `formatPrice` utility, Redux currency state, product cards, cart, checkout
13. Add env vars to `.env.example` files

---

## Payment Gateway Readiness

When the gateway (Checkout.com / Telr / PayTabs) is integrated, the checkout view reads:

```python
order.charged_currency   # e.g. "SAR", "AED"
order.charged_amount     # e.g. Decimal("120.000")
```

And passes them directly to the gateway API. No schema changes, no migrations. The gateway integration is purely a new view + API call.

GCC-compatible gateways (Checkout.com, Telr, PayTabs) all accept `currency` + `amount` in this exact format. Checkout.com additionally accepts minor units (multiply by 10^decimal_places) — the `Currency.decimal_places` field provides this automatically.

---

## Future Expansion

### Adding a new GCC country (e.g. UAE)
1. Admin adds `CountryConfig(AE, AED)` + `TaxRate(AE, STANDARD, 0.05)` via Django admin
2. For each product, admin adds `ProductCountryPrice(AE, AED, price)` — or bulk import via management command
3. No code changes, no deployments

### Rate changes (e.g. ZATCA raises SA rate again)
1. Set old `TaxRate` row `is_active=False`
2. Add new row with updated rate + new `effective_from`
3. Historical orders retain `tax_rate_snapshot` — invoices accurate forever

### Non-GCC expansion
Most countries: just add `CountryConfig` + `TaxRate` + `ProductCountryPrice` rows.  
US/India: `TaxRate.region` nullable field is the hook — see original design notes.

---

## Testing

- `get_tax_rate()`: SA standard → 0.15; SA zero-rated → 0.00; unknown country → 0.00
- `get_product_price()`: returns AED price when AE row exists; falls back to SAR when not
- Update existing order test: `subtotal=240.00` → `tax_amount=36.00` (15%), not 19.20 (8%)
- Mixed cart: 1 standard + 1 zero-rated item → only standard item taxed
- `tax_rate_snapshot`, `tax_country_snapshot`, `charged_currency`, `charged_amount` all written on order creation
- BHD price formatting: `BHD 38.500` (3 decimal places)
- Currency fallback: product with no AE price → returns SAR price
