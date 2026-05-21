# Tax & Currency System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded 8% flat tax with a DB-backed, admin-configurable GCC VAT system and replace the broken per-product `currency` CharField with proper per-country pricing.

**Architecture:** A new `tax` Django app owns `Currency`, `CountryConfig`, `TaxCategory`, and `TaxRate` models plus the `get_tax_rate()` service. A new `ProductCountryPrice` model in the `product` app stores per-country commercial prices. Orders snapshot the rate, country, and charged currency at checkout time so invoices stay accurate forever. The frontend renders tax-inclusive prices with the correct currency symbol per delivery country.

**Tech Stack:** Django 4.x, DRF, Django migrations (data migrations), Next.js 16 App Router, Redux Toolkit, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-19-tax-system-design.md`

---

## File Map

### New files (backend)
- `backend/zewadi/tax/__init__.py`
- `backend/zewadi/tax/apps.py`
- `backend/zewadi/tax/models.py` — Currency, CountryConfig, TaxCategory, TaxRate
- `backend/zewadi/tax/admin.py`
- `backend/zewadi/tax/services.py` — get_tax_rate()
- `backend/zewadi/tax/tests.py`
- `backend/zewadi/tax/migrations/0001_initial.py` (auto-generated)
- `backend/zewadi/tax/migrations/0002_seed_data.py` (data migration)
- `backend/zewadi/product/services.py` — get_product_price()

### Modified files (backend)
- `backend/zewadi/zewadi/settings.py` — INSTALLED_APPS + DEFAULT_TAX_COUNTRY
- `backend/zewadi/product/models.py` — add ProductCountryPrice, add tax_category FK, remove CurrencyChoices + currency field
- `backend/zewadi/product/admin.py` — ProductCountryPrice inline
- `backend/zewadi/product/serializers.py` — remove currency field, add tax_category + pricing fields
- `backend/zewadi/product/views.py` — accept ?country= param, pass to serializer context
- `backend/zewadi/product/tests.py` — new tests for get_product_price
- `backend/zewadi/orders/models.py` — add tax_rate_snapshot, tax_country_snapshot, charged_currency, charged_amount
- `backend/zewadi/orders/serializers.py` — add 4 new snapshot fields
- `backend/zewadi/orders/views.py` — update _cart_queryset, _cart_summary, CartCheckoutView; remove TAX_RATE constant
- `backend/zewadi/orders/tests.py` — update tax assertions, add snapshot assertions

### New files (frontend)
- `frontend/src/utils/formatPrice.ts`

### Modified files (frontend)
- `frontend/src/components/productcards/productcards.tsx` — tax-inclusive display
- `frontend/src/app/cart/page.tsx` — currency types + display
- `frontend/src/app/checkout/page.tsx` — currency types + display
- `frontend/.env.example` — add NEXT_PUBLIC_ZATCA_TRN
- `backend/zewadi/.env.example` — add ZATCA_TRN

---

## Task 1: Create `tax` Django app — models

**Files:**
- Create: `backend/zewadi/tax/__init__.py`
- Create: `backend/zewadi/tax/apps.py`
- Create: `backend/zewadi/tax/models.py`
- Modify: `backend/zewadi/zewadi/settings.py`

- [ ] **Step 1: Create the app directory and files**

```bash
cd backend/zewadi
python manage.py startapp tax
```

- [ ] **Step 2: Write `tax/models.py`**

Replace the auto-generated contents entirely:

```python
from django.db import models


class Currency(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    decimal_places = models.PositiveSmallIntegerField(default=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "currencies"
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} — {self.name}"


class CountryConfig(models.Model):
    country = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name="countries")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["country"]

    def __str__(self):
        return f"{self.country} ({self.currency.code})"


class TaxCategory(models.Model):
    name = models.CharField(max_length=100)
    code = models.SlugField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "tax categories"
        ordering = ["code"]

    def __str__(self):
        return self.name


class TaxRate(models.Model):
    country = models.CharField(max_length=2)
    region = models.CharField(max_length=10, null=True, blank=True)
    tax_category = models.ForeignKey(TaxCategory, on_delete=models.PROTECT, related_name="rates")
    rate = models.DecimalField(max_digits=5, decimal_places=4)
    name = models.CharField(max_length=100)
    effective_from = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["country", "tax_category"]
        constraints = [
            models.UniqueConstraint(
                fields=["country", "region", "tax_category"],
                condition=models.Q(is_active=True),
                name="unique_active_tax_rate_per_country_category",
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.rate * 100:.2f}%)"
```

- [ ] **Step 3: Write `tax/apps.py`**

```python
from django.apps import AppConfig


class TaxConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "tax"
```

- [ ] **Step 4: Register `tax` in INSTALLED_APPS**

In `backend/zewadi/zewadi/settings.py`, add `"tax"` to the Project apps section:

```python
    # Project apps
    "accounts",
    "recipes",
    "product",
    "blog",
    "supperadmin",
    "consultant",
    "communityuser",
    "orders",
    "events",
    "notifications",
    "tax",
```

Also add `DEFAULT_TAX_COUNTRY` at the bottom of settings.py:

```python
# ─── GCC Tax & Currency ────────────────────────────────────────────────────────
DEFAULT_TAX_COUNTRY = "SA"
```

- [ ] **Step 5: Generate and apply migration**

```bash
cd backend/zewadi
python manage.py makemigrations tax
python manage.py migrate tax
```

Expected: migration file created + applied with no errors.

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/tax/ backend/zewadi/zewadi/settings.py
git commit -m "feat(tax): add tax app with Currency, CountryConfig, TaxCategory, TaxRate models"
```

---

## Task 2: Seed data migration for `tax` app

**Files:**
- Create: `backend/zewadi/tax/migrations/0002_seed_data.py`

- [ ] **Step 1: Create the data migration**

```bash
cd backend/zewadi
python manage.py makemigrations tax --empty --name seed_data
```

- [ ] **Step 2: Write the migration body**

Open the generated `tax/migrations/0002_seed_data.py` and replace it with:

```python
from django.db import migrations
import datetime


def seed_forward(apps, schema_editor):
    Currency = apps.get_model("tax", "Currency")
    CountryConfig = apps.get_model("tax", "CountryConfig")
    TaxCategory = apps.get_model("tax", "TaxCategory")
    TaxRate = apps.get_model("tax", "TaxRate")

    # Currencies
    sar = Currency.objects.create(code="SAR", name="Saudi Riyal", symbol="SAR", decimal_places=2)
    aed = Currency.objects.create(code="AED", name="UAE Dirham", symbol="AED", decimal_places=2)
    bhd = Currency.objects.create(code="BHD", name="Bahraini Dinar", symbol="BHD", decimal_places=3)
    omr = Currency.objects.create(code="OMR", name="Omani Rial", symbol="OMR", decimal_places=3)

    # Country → currency mapping
    CountryConfig.objects.create(country="SA", name="Saudi Arabia", currency=sar)
    CountryConfig.objects.create(country="AE", name="United Arab Emirates", currency=aed)
    CountryConfig.objects.create(country="BH", name="Bahrain", currency=bhd)
    CountryConfig.objects.create(country="OM", name="Oman", currency=omr)

    # Tax categories
    standard = TaxCategory.objects.create(name="Standard Rate", code="STANDARD", description="Standard VAT rate")
    zero = TaxCategory.objects.create(name="Zero-Rated", code="ZERO", description="Zero-rated goods (e.g. basic food staples)")
    TaxCategory.objects.create(name="Exempt", code="EXEMPT", description="VAT exempt goods")

    # Saudi Arabia rates (effective 2020-07-01 when VAT rose to 15%)
    effective = datetime.date(2020, 7, 1)
    TaxRate.objects.create(country="SA", tax_category=standard, rate="0.1500", name="Saudi VAT Standard Rate 15%", effective_from=effective)
    TaxRate.objects.create(country="SA", tax_category=zero, rate="0.0000", name="Saudi VAT Zero-Rated", effective_from=effective)


def seed_reverse(apps, schema_editor):
    Currency = apps.get_model("tax", "Currency")
    CountryConfig = apps.get_model("tax", "CountryConfig")
    TaxCategory = apps.get_model("tax", "TaxCategory")
    TaxRate = apps.get_model("tax", "TaxRate")
    TaxRate.objects.all().delete()
    TaxCategory.objects.all().delete()
    CountryConfig.objects.all().delete()
    Currency.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("tax", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_forward, seed_reverse),
    ]
```

- [ ] **Step 3: Apply the migration**

```bash
cd backend/zewadi
python manage.py migrate tax
```

Expected: runs without error.

- [ ] **Step 4: Verify seed data in shell**

```bash
python manage.py shell -c "
from tax.models import Currency, TaxRate
print(list(Currency.objects.values('code', 'decimal_places')))
print(list(TaxRate.objects.values('country', 'rate', 'is_active')))
"
```

Expected output includes `{'code': 'SAR', 'decimal_places': 2}` and `{'country': 'SA', 'rate': Decimal('0.1500'), 'is_active': True}`.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/tax/migrations/0002_seed_data.py
git commit -m "feat(tax): add seed data migration — SAR/AED/BHD/OMR currencies, SA VAT 15%"
```

---

## Task 3: `tax/services.py` — get_tax_rate() with TDD

**Files:**
- Create: `backend/zewadi/tax/services.py`
- Create: `backend/zewadi/tax/tests.py`

- [ ] **Step 1: Write failing tests first**

Create `backend/zewadi/tax/tests.py`:

```python
from decimal import Decimal

from django.test import TestCase

from tax.models import Currency, CountryConfig, TaxCategory, TaxRate
from tax.services import get_tax_rate


class GetTaxRateTests(TestCase):
    def setUp(self):
        sar = Currency.objects.create(code="SAR", name="Saudi Riyal", symbol="SAR", decimal_places=2)
        CountryConfig.objects.create(country="SA", name="Saudi Arabia", currency=sar)
        self.standard = TaxCategory.objects.create(name="Standard Rate", code="STANDARD")
        self.zero = TaxCategory.objects.create(name="Zero-Rated", code="ZERO")
        TaxCategory.objects.create(name="Exempt", code="EXEMPT")
        import datetime
        TaxRate.objects.create(
            country="SA", tax_category=self.standard,
            rate=Decimal("0.1500"), name="SA Standard",
            effective_from=datetime.date(2020, 7, 1),
        )
        TaxRate.objects.create(
            country="SA", tax_category=self.zero,
            rate=Decimal("0.0000"), name="SA Zero",
            effective_from=datetime.date(2020, 7, 1),
        )

    def test_returns_standard_rate_for_sa(self):
        self.assertEqual(get_tax_rate("SA", "STANDARD"), Decimal("0.1500"))

    def test_returns_zero_for_zero_rated(self):
        self.assertEqual(get_tax_rate("SA", "ZERO"), Decimal("0.0000"))

    def test_returns_zero_for_exempt(self):
        self.assertEqual(get_tax_rate("SA", "EXEMPT"), Decimal("0.0000"))

    def test_returns_zero_for_unknown_country(self):
        # Qatar/Kuwait have no VAT configured
        self.assertEqual(get_tax_rate("QA", "STANDARD"), Decimal("0"))

    def test_case_insensitive_country_code(self):
        self.assertEqual(get_tax_rate("sa", "STANDARD"), Decimal("0.1500"))

    def test_inactive_rate_is_ignored(self):
        import datetime
        TaxRate.objects.create(
            country="SA", tax_category=self.standard,
            rate=Decimal("0.0500"), name="SA Old Rate",
            effective_from=datetime.date(2018, 1, 1),
            is_active=False,
        )
        # Still returns the active rate
        self.assertEqual(get_tax_rate("SA", "STANDARD"), Decimal("0.1500"))
```

- [ ] **Step 2: Run tests — expect failure**

```bash
cd backend/zewadi
python manage.py test tax.tests.GetTaxRateTests -v 2
```

Expected: ImportError — `tax.services` does not exist yet.

- [ ] **Step 3: Write `tax/services.py`**

```python
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
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
cd backend/zewadi
python manage.py test tax.tests.GetTaxRateTests -v 2
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/tax/services.py backend/zewadi/tax/tests.py
git commit -m "feat(tax): add get_tax_rate service with tests"
```

---

## Task 4: `tax/admin.py` — register models

**Files:**
- Modify: `backend/zewadi/tax/admin.py`

- [ ] **Step 1: Write the admin**

```python
from django.contrib import admin

from .models import Currency, CountryConfig, TaxCategory, TaxRate


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "symbol", "decimal_places", "is_active"]
    list_filter = ["is_active"]


@admin.register(CountryConfig)
class CountryConfigAdmin(admin.ModelAdmin):
    list_display = ["country", "name", "currency", "is_active"]
    list_filter = ["is_active"]


@admin.register(TaxCategory)
class TaxCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active"]


@admin.register(TaxRate)
class TaxRateAdmin(admin.ModelAdmin):
    list_display = ["name", "country", "tax_category", "rate", "effective_from", "is_active"]
    list_filter = ["country", "is_active", "tax_category"]
    ordering = ["country", "tax_category", "-effective_from"]
```

- [ ] **Step 2: Verify admin loads**

```bash
cd backend/zewadi
python manage.py check
```

Expected: System check passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/tax/admin.py
git commit -m "feat(tax): register all tax models in Django admin"
```

---

## Task 5: `product` app — `ProductCountryPrice` model + migration

**Files:**
- Modify: `backend/zewadi/product/models.py`
- Auto-generated migration

- [ ] **Step 1: Add `ProductCountryPrice` to `product/models.py`**

At the bottom of `product/models.py`, after the `ProductVariant` class, add:

```python
class ProductCountryPrice(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="country_prices")
    country = models.CharField(max_length=2)
    currency = models.ForeignKey("tax.Currency", on_delete=models.PROTECT, related_name="product_prices")
    selling_price = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["product", "country"], name="unique_product_country_price")
        ]
        ordering = ["country"]

    def __str__(self):
        return f"{self.product.product_code} / {self.country} / {self.currency.code} {self.selling_price}"
```

- [ ] **Step 2: Generate migration**

```bash
cd backend/zewadi
python manage.py makemigrations product --name add_product_country_price
```

- [ ] **Step 3: Apply migration**

```bash
python manage.py migrate product
```

Expected: applies cleanly.

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/product/models.py backend/zewadi/product/migrations/
git commit -m "feat(product): add ProductCountryPrice model"
```

---

## Task 6: Seed `ProductCountryPrice` from existing products

**Files:**
- Create data migration in `product/migrations/`

- [ ] **Step 1: Create empty data migration**

```bash
cd backend/zewadi
python manage.py makemigrations product --empty --name seed_product_country_prices
```

- [ ] **Step 2: Write the migration body**

Open the generated file and replace:

```python
from django.db import migrations


def seed_forward(apps, schema_editor):
    Product = apps.get_model("product", "Product")
    ProductCountryPrice = apps.get_model("product", "ProductCountryPrice")
    Currency = apps.get_model("tax", "Currency")

    try:
        sar = Currency.objects.get(code="SAR")
    except Currency.DoesNotExist:
        return  # tax seed migration hasn't run yet (test isolation)

    for product in Product.objects.all():
        ProductCountryPrice.objects.get_or_create(
            product=product,
            country="SA",
            defaults={"currency": sar, "selling_price": product.selling_price},
        )


def seed_reverse(apps, schema_editor):
    ProductCountryPrice = apps.get_model("product", "ProductCountryPrice")
    ProductCountryPrice.objects.filter(country="SA").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("product", "PREVIOUS_MIGRATION_NAME"),  # replace with actual generated name
        ("tax", "0002_seed_data"),
    ]

    operations = [
        migrations.RunPython(seed_forward, seed_reverse),
    ]
```

**Important:** Replace `"PREVIOUS_MIGRATION_NAME"` with the actual name of the `add_product_country_price` migration (check `product/migrations/` for the file name).

- [ ] **Step 3: Apply migration**

```bash
python manage.py migrate product
```

Expected: runs without error.

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/product/migrations/
git commit -m "feat(product): seed ProductCountryPrice from existing product selling_price"
```

---

## Task 7: Add `tax_category` FK + remove `currency` field from `Product`

**Files:**
- Modify: `backend/zewadi/product/models.py`
- Multiple auto-generated + data migrations

- [ ] **Step 1: Add `tax_category` FK (nullable) to `Product`**

In `product/models.py`, in the `Product` class Pricing section, after `selling_price`:

```python
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    tax_category = models.ForeignKey(
        "tax.TaxCategory",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="products",
    )
    currency = models.CharField(max_length=3, choices=CurrencyChoices.choices, default=CurrencyChoices.USD)
```

Keep `currency` for now — we'll remove it in a later step.

- [ ] **Step 2: Generate + apply migration**

```bash
cd backend/zewadi
python manage.py makemigrations product --name add_tax_category_nullable
python manage.py migrate product
```

- [ ] **Step 3: Create data migration to backfill Standard Rate**

```bash
python manage.py makemigrations product --empty --name backfill_tax_category
```

Write the migration:

```python
from django.db import migrations


def backfill_forward(apps, schema_editor):
    Product = apps.get_model("product", "Product")
    TaxCategory = apps.get_model("tax", "TaxCategory")
    try:
        standard = TaxCategory.objects.get(code="STANDARD")
    except TaxCategory.DoesNotExist:
        return
    Product.objects.filter(tax_category__isnull=True).update(tax_category=standard)


def backfill_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("product", "PREVIOUS_MIGRATION_NAME"),  # replace with add_tax_category_nullable name
        ("tax", "0002_seed_data"),
    ]

    operations = [
        migrations.RunPython(backfill_forward, backfill_reverse),
    ]
```

**Replace** `"PREVIOUS_MIGRATION_NAME"` with the actual migration name from step 2.

- [ ] **Step 4: Apply backfill**

```bash
python manage.py migrate product
```

- [ ] **Step 5: Remove `currency` field + `CurrencyChoices` + make `tax_category` non-nullable**

In `product/models.py`:

1. Delete the entire `CurrencyChoices` class (lines 37–41)
2. In `Product`, change `tax_category` to non-nullable:

```python
    tax_category = models.ForeignKey(
        "tax.TaxCategory",
        on_delete=models.PROTECT,
        related_name="products",
    )
```

3. Remove the `currency` field line entirely.

- [ ] **Step 6: Generate + apply the schema migration**

```bash
cd backend/zewadi
python manage.py makemigrations product --name remove_currency_field_make_tax_category_required
python manage.py migrate product
```

Expected: migration removes the `currency` column and makes `tax_category` non-nullable.

- [ ] **Step 7: Verify**

```bash
python manage.py shell -c "
from product.models import Product
p = Product.objects.first()
if p:
    print(p.tax_category.code)
    print(hasattr(p, 'currency'))
"
```

Expected: prints `STANDARD` and `False`.

- [ ] **Step 8: Commit**

```bash
git add backend/zewadi/product/models.py backend/zewadi/product/migrations/
git commit -m "feat(product): add tax_category FK, remove legacy currency CharField"
```

---

## Task 8: `product/services.py` — `get_product_price()` with TDD

**Files:**
- Create: `backend/zewadi/product/services.py`
- Create/modify: `backend/zewadi/product/tests.py`

- [ ] **Step 1: Write failing tests**

Create `backend/zewadi/product/tests.py`:

```python
from decimal import Decimal

from django.test import TestCase

from product.models import Product, ProductCountryPrice, ProductStatus
from product.services import get_product_price
from tax.models import Currency, TaxCategory


def make_currency(code="SAR", decimal_places=2):
    return Currency.objects.create(code=code, name=code, symbol=code, decimal_places=decimal_places)


def make_product():
    tc = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})[0]
    return Product.objects.create(
        product_name="Test Product",
        product_code="TP-001",
        category="food",
        product_status=ProductStatus.ACTIVE,
        short_description="Test",
        base_price=Decimal("100.00"),
        selling_price=Decimal("100.00"),
        cost_price=Decimal("100.00"),
        mrp_price=Decimal("100.00"),
        tax_category=tc,
    )


class GetProductPriceTests(TestCase):
    def setUp(self):
        self.sar = make_currency("SAR", 2)
        self.aed = make_currency("AED", 2)
        self.product = make_product()

    def test_returns_sa_price_when_country_price_exists(self):
        ProductCountryPrice.objects.create(
            product=self.product, country="SA", currency=self.sar, selling_price=Decimal("100.00")
        )
        price, currency = get_product_price(self.product, "SA")
        self.assertEqual(price, Decimal("100.000"))
        self.assertEqual(currency.code, "SAR")

    def test_returns_aed_price_for_ae(self):
        ProductCountryPrice.objects.create(
            product=self.product, country="AE", currency=self.aed, selling_price=Decimal("99.750")
        )
        price, currency = get_product_price(self.product, "AE")
        self.assertEqual(price, Decimal("99.750"))
        self.assertEqual(currency.code, "AED")

    def test_falls_back_to_sar_when_no_country_price(self):
        # No AE price, SAR currency exists
        price, currency = get_product_price(self.product, "AE")
        self.assertEqual(price, self.product.selling_price)
        self.assertEqual(currency.code, "SAR")

    def test_case_insensitive_country_code(self):
        ProductCountryPrice.objects.create(
            product=self.product, country="SA", currency=self.sar, selling_price=Decimal("100.00")
        )
        price, currency = get_product_price(self.product, "sa")
        self.assertEqual(currency.code, "SAR")
```

- [ ] **Step 2: Run tests — expect ImportError**

```bash
cd backend/zewadi
python manage.py test product.tests.GetProductPriceTests -v 2
```

Expected: ImportError — `product.services` does not exist.

- [ ] **Step 3: Write `product/services.py`**

```python
from decimal import Decimal

from tax.models import Currency


def get_product_price(product, country: str):
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
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
cd backend/zewadi
python manage.py test product.tests.GetProductPriceTests -v 2
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/product/services.py backend/zewadi/product/tests.py
git commit -m "feat(product): add get_product_price service with tests"
```

---

## Task 9: Update `product/serializers.py`

**Files:**
- Modify: `backend/zewadi/product/serializers.py`

- [ ] **Step 1: Update `ProductSerializer`**

Replace the existing `ProductSerializer` class entirely:

```python
class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    alternative_images = serializers.SerializerMethodField()
    brand_name = serializers.SerializerMethodField()
    allow_out_of_stock = serializers.BooleanField(source="allow_orders_when_out_of_stock", read_only=True)
    discount_amount = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()
    tax_category_code = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    currency_code = serializers.SerializerMethodField()
    currency_decimal_places = serializers.SerializerMethodField()

    def get_brand_name(self, obj):
        return obj.brand_name

    def get_image(self, obj):
        return obj.image or None

    def get_alternative_images(self, obj):
        return [pi.image for pi in obj.alternative_images.all() if pi.image]

    def get_discount_amount(self, obj):
        return f"{obj.discount_amount:.2f}"

    def get_discount_percent(self, obj):
        return f"{obj.discount_percent:.2f}"

    def get_tax_category_code(self, obj):
        return obj.tax_category.code if obj.tax_category_id else "STANDARD"

    def _get_country_price(self, obj):
        from product.services import get_product_price
        country = self.context.get("country", "SA")
        return get_product_price(obj, country)

    def get_display_price(self, obj):
        from tax.services import get_tax_rate
        price, currency = self._get_country_price(obj)
        cat_code = obj.tax_category.code if obj.tax_category_id else "STANDARD"
        country = self.context.get("country", "SA")
        rate = get_tax_rate(country, cat_code)
        inclusive = price * (1 + rate)
        dp = currency.decimal_places
        return f"{inclusive:.{dp}f}"

    def get_currency_code(self, obj):
        _, currency = self._get_country_price(obj)
        return currency.code

    def get_currency_decimal_places(self, obj):
        _, currency = self._get_country_price(obj)
        return currency.decimal_places

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "product_subtitle",
            "product_code",
            "brand_name",
            "category",
            "product_status",
            "image",
            "alternative_images",
            "product_unit",
            "unit_quantity",
            "alternative_unit_enabled",
            "short_description",
            "full_description",
            "key_ingredients",
            "health_benefits",
            "base_price",
            "sale_price",
            "cost_price",
            "mrp_price",
            "selling_price",
            "display_price",
            "currency_code",
            "currency_decimal_places",
            "discount_amount",
            "discount_percent",
            "tax_category_code",
            "stock_quantity",
            "low_stock_alert",
            "stock_status",
            "allow_out_of_stock",
            "allow_orders_when_out_of_stock",
            "enable_low_stock_alerts",
            "variants",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
```

- [ ] **Step 2: Run Django system check**

```bash
cd backend/zewadi
python manage.py check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/product/serializers.py
git commit -m "feat(product): update ProductSerializer — replace currency field with display_price, currency_code, tax_category_code"
```

---

## Task 10: Update `product/views.py` — accept `?country=` param

**Files:**
- Modify: `backend/zewadi/product/views.py`

- [ ] **Step 1: Update `ProductListCreateView.get` to pass `country` to serializer context**

In `ProductListCreateView.get`, change the two `ProductSerializer(...)` calls to include the country context. Find this block (around line 83):

```python
        paginator = StandardPagination()
        page = paginator.paginate_queryset(products, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True, context={"request": request})
```

Replace with:

```python
        country = request.query_params.get("country", "SA").upper()
        paginator = StandardPagination()
        page = paginator.paginate_queryset(products, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True, context={"request": request, "country": country})
```

Also update the fallback serializer call a few lines later (around line 92):

```python
        serializer = ProductSerializer(products, many=True, context={"request": request})
```

Replace with:

```python
        serializer = ProductSerializer(products, many=True, context={"request": request, "country": country})
```

And the same `country` variable is already defined above, so this works.

- [ ] **Step 2: Update `ProductDetailView.get` similarly**

Find the serializer call in `ProductDetailView.get` (around line 149) and update it:

```python
        country = request.query_params.get("country", "SA").upper()
        serializer = ProductSerializer(product, context={"request": request, "country": country})
```

- [ ] **Step 3: Update `prefetch_related` to include `tax_category`**

In `ProductListCreateView.get`, update both queryset lines to prefetch tax_category:

```python
            products = Product.objects.prefetch_related(
                "alternative_images", "country_prices__currency"
            ).select_related("tax_category").all().order_by("-created_at")
```

And for the public/cached path:

```python
            products = Product.objects.prefetch_related(
                "alternative_images", "country_prices__currency"
            ).select_related("tax_category").filter(product_status="active").order_by("-created_at")
```

- [ ] **Step 4: Run system check**

```bash
cd backend/zewadi
python manage.py check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/product/views.py
git commit -m "feat(product): accept ?country= param, pass to serializer for per-country pricing"
```

---

## Task 11: `product/admin.py` — `ProductCountryPrice` inline

**Files:**
- Modify: `backend/zewadi/product/admin.py`

- [ ] **Step 1: Check if admin.py exists, then add inline**

```bash
ls "d:/Brandbook/zawadi/backend/zewadi/product/admin.py" 2>/dev/null || echo "not found"
```

If it exists, add to the existing file. If not, create it.

```python
from django.contrib import admin

from .models import Product, ProductCountryPrice


class ProductCountryPriceInline(admin.TabularInline):
    model = ProductCountryPrice
    extra = 1
    fields = ["country", "currency", "selling_price", "is_active"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["product_code", "product_name", "selling_price", "tax_category", "product_status"]
    list_filter = ["product_status", "tax_category", "category"]
    search_fields = ["product_name", "product_code"]
    inlines = [ProductCountryPriceInline]
```

- [ ] **Step 2: Run check**

```bash
cd backend/zewadi
python manage.py check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/product/admin.py
git commit -m "feat(product): add ProductCountryPrice inline to Product admin"
```

---

## Task 12: `orders` app — add snapshot fields to `Order` + update `OrderCreateSerializer`

**Files:**
- Modify: `backend/zewadi/orders/models.py`
- Modify: `backend/zewadi/orders/serializers.py`
- Auto-generated migration

- [ ] **Step 1: Add 4 fields to `Order` model**

In `backend/zewadi/orders/models.py`, after `total_amount` (line 48), add:

```python
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate_snapshot = models.DecimalField(max_digits=5, decimal_places=4, default=0)
    tax_country_snapshot = models.CharField(max_length=2, blank=True, default="")
    charged_currency = models.CharField(max_length=3, default="SAR")
    charged_amount = models.DecimalField(max_digits=10, decimal_places=3, default=0)
```

- [ ] **Step 2: Generate + apply migration**

```bash
cd backend/zewadi
python manage.py makemigrations orders --name add_tax_currency_snapshot_fields
python manage.py migrate orders
```

- [ ] **Step 3: Add snapshot fields to `OrderCreateSerializer`**

In `backend/zewadi/orders/serializers.py`, update `OrderCreateSerializer.Meta`:

Add to `fields` list (after `"tax_amount"`):
```python
            "tax_rate_snapshot",
            "tax_country_snapshot",
            "charged_currency",
            "charged_amount",
```

Add to `read_only_fields` list: leave them as writable (the view will set them).

Add to `extra_kwargs`:
```python
            "tax_rate_snapshot": {"required": False},
            "tax_country_snapshot": {"required": False},
            "charged_currency": {"required": False},
            "charged_amount": {"required": False},
```

- [ ] **Step 4: Run system check**

```bash
cd backend/zewadi
python manage.py check
```

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/orders/models.py backend/zewadi/orders/serializers.py backend/zewadi/orders/migrations/
git commit -m "feat(orders): add tax_rate_snapshot, tax_country_snapshot, charged_currency, charged_amount to Order"
```

---

## Task 13: `orders/views.py` — replace `TAX_RATE` with service calls

**Files:**
- Modify: `backend/zewadi/orders/views.py`

- [ ] **Step 1: Remove `TAX_RATE` constant and update imports**

At the top of `orders/views.py`, remove line 26:
```python
TAX_RATE = Decimal("0.08")   # DELETE THIS LINE
```

Add import at the top of the file (after existing imports):
```python
from django.conf import settings
from tax.services import get_tax_rate
```

- [ ] **Step 2: Update `_cart_queryset` to prefetch tax_category**

Replace the existing `_cart_queryset` function:

```python
def _cart_queryset(user):
    return (
        CartItem.objects.filter(user=user)
        .select_related("product", "product__tax_category", "variant")
        .order_by("-updated_at")
    )
```

- [ ] **Step 3: Replace `_cart_summary` entirely**

Replace the existing `_cart_summary` function with:

```python
def _cart_summary(items, country=None):
    if country is None:
        country = getattr(settings, "DEFAULT_TAX_COUNTRY", "SA")

    item_count = 0
    subtotal = Decimal("0.00")
    tax_total = Decimal("0.00")

    for item in items:
        item_count += item.quantity
        line_price = _money(item.line_total)
        subtotal = _money(subtotal + line_price)

        cat_code = item.product.tax_category.code if item.product.tax_category_id else "STANDARD"
        rate = get_tax_rate(country, cat_code)
        tax_total = _money(tax_total + _money(line_price * rate))

    shipping = Decimal("0.00") if subtotal == 0 or subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING_CHARGE
    total = _money(subtotal + shipping + tax_total)
    standard_rate = get_tax_rate(country, "STANDARD")

    return {
        "item_count": item_count,
        "subtotal": f"{subtotal:.2f}",
        "shipping": f"{shipping:.2f}",
        "tax": f"{tax_total:.2f}",
        "tax_rate": f"{standard_rate:.4f}",
        "tax_country": country,
        "currency_code": "SAR",
        "currency_symbol": "SAR",
        "currency_decimal_places": 2,
        "total": f"{total:.2f}",
        "free_shipping_unlocked": subtotal >= FREE_SHIPPING_THRESHOLD,
    }
```

- [ ] **Step 4: Update `_cart_response` to accept and forward `country`**

Replace existing `_cart_response`:

```python
def _cart_response(request, country=None):
    items = list(_cart_queryset(request.user))
    return {
        "items": CartItemSerializer(items, many=True, context={"request": request}).data,
        "summary": _cart_summary(items, country=country),
    }
```

- [ ] **Step 5: Update `CartCheckoutView.post` to snapshot tax fields**

Inside `CartCheckoutView.post`, after `required_fields` check, add:

```python
        country = request.data.get("country", getattr(settings, "DEFAULT_TAX_COUNTRY", "SA")).upper()
```

Then find the line:
```python
                summary = _cart_summary(cart_items)
```
Replace with:
```python
                summary = _cart_summary(cart_items, country=country)
```

Then inside the `for index, item in enumerate(cart_items):` loop, after `_validate_and_decrement_stock`, add the per-item rate calculation. Find this block:

```python
                    line_subtotal = _money(item.line_total)
                    if subtotal > 0:
                        ratio = line_subtotal / subtotal
                        allocated_shipping = _money(shipping * ratio)
                        allocated_tax = _money(tax * ratio)
                    else:
                        allocated_shipping = Decimal("0.00")
                        allocated_tax = Decimal("0.00")
```

Replace with:

```python
                    line_subtotal = _money(item.line_total)
                    tax_cat_code = product.tax_category.code if product.tax_category_id else "STANDARD"
                    item_rate = get_tax_rate(country, tax_cat_code)
                    if subtotal > 0:
                        ratio = line_subtotal / subtotal
                        allocated_shipping = _money(shipping * ratio)
                        allocated_tax = _money(line_subtotal * item_rate)
                    else:
                        allocated_shipping = Decimal("0.00")
                        allocated_tax = Decimal("0.00")
```

Then find the last-item correction block and update the `used_tax` calculation to use `order.tax_amount`:

```python
                    if index == len(cart_items) - 1:
                        used_shipping = sum((Decimal(order.delivery_charge) for order in created_orders), Decimal("0.00"))
                        used_tax = sum((Decimal(order.tax_amount) for order in created_orders), Decimal("0.00"))
                        allocated_shipping = _money(shipping - used_shipping)
                        allocated_tax = _money(tax - used_tax)
```

Then find the `serializer = OrderCreateSerializer(data={...})` call and add the four snapshot fields to the data dict:

```python
                            "tax_amount": f"{allocated_tax:.2f}",
                            "total_amount": f"{_money(line_subtotal + allocated_shipping + allocated_tax):.2f}",
                            "tax_rate_snapshot": f"{item_rate:.4f}",
                            "tax_country_snapshot": country,
                            "charged_currency": summary["currency_code"],
                            "charged_amount": f"{_money(line_subtotal + allocated_shipping + allocated_tax):.2f}",
```

- [ ] **Step 6: Run system check**

```bash
cd backend/zewadi
python manage.py check
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add backend/zewadi/orders/views.py
git commit -m "feat(orders): replace hardcoded TAX_RATE with get_tax_rate service, snapshot tax/currency fields on checkout"
```

---

## Task 14: `orders/tests.py` — update assertions + add snapshot tests

**Files:**
- Modify: `backend/zewadi/orders/tests.py`

- [ ] **Step 1: Update `make_product` to include `tax_category`**

In `orders/tests.py`, update the `make_product` helper at the top:

```python
from decimal import Decimal

from rest_framework.test import APITestCase

from accounts.models import User
from notifications.models import Notification, UserNotificationReceipt
from orders.models import Order
from product.models import Product, ProductStatus, ProductVariant
from tax.models import Currency, CountryConfig, TaxCategory, TaxRate
import datetime


def _ensure_tax_config():
    sar, _ = Currency.objects.get_or_create(code="SAR", defaults={"name": "Saudi Riyal", "symbol": "SAR", "decimal_places": 2})
    CountryConfig.objects.get_or_create(country="SA", defaults={"name": "Saudi Arabia", "currency": sar})
    standard, _ = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})
    TaxCategory.objects.get_or_create(code="ZERO", defaults={"name": "Zero-Rated"})
    TaxRate.objects.get_or_create(
        country="SA", tax_category=standard, region=None, is_active=True,
        defaults={"rate": "0.1500", "name": "SA Standard 15%", "effective_from": datetime.date(2020, 7, 1)},
    )
    return standard


def make_user():
    return User.objects.create_user(
        email="buyer@example.com",
        password="Pass@1234",
        user_name="buyer",
        full_name="Buyer",
        phone="1234567890",
        role="COMMUNITY_USER",
    )


def make_product(**overrides):
    standard = _ensure_tax_config()
    data = {
        "product_name": "Buckwheat 500g",
        "product_code": "BWH-500",
        "category": "food",
        "product_status": ProductStatus.ACTIVE,
        "short_description": "Single SKU pack",
        "base_price": Decimal("80.00"),
        "sale_price": Decimal("120.00"),
        "cost_price": Decimal("80.00"),
        "mrp_price": Decimal("150.00"),
        "selling_price": Decimal("120.00"),
        "stock_quantity": 5,
        "tax_category": standard,
    }
    data.update(overrides)
    return Product.objects.create(**data)
```

- [ ] **Step 2: Update `test_checkout_snapshots_prices_and_decrements_product_stock`**

Find the assertion on line 99:

```python
        self.assertEqual(order.tax_amount, Decimal("19.20"))
```

Replace with:

```python
        # 15% VAT on subtotal 240.00 = 36.00
        self.assertEqual(order.tax_amount, Decimal("36.00"))
        self.assertEqual(order.tax_rate_snapshot, Decimal("0.1500"))
        self.assertEqual(order.tax_country_snapshot, "SA")
        self.assertEqual(order.charged_currency, "SAR")
        self.assertEqual(order.charged_amount, order.total_amount)
```

- [ ] **Step 3: Run all order tests**

```bash
cd backend/zewadi
python manage.py test orders -v 2
```

Expected: all tests pass.

- [ ] **Step 4: Run all backend tests**

```bash
cd backend/zewadi
python manage.py test -v 1
```

Expected: all tests pass across all apps.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/orders/tests.py
git commit -m "test(orders): update tax assertions to 15% SA VAT, add snapshot field assertions"
```

---

## Task 15: Frontend — `formatPrice` utility + CartSummary type update

**Files:**
- Create: `frontend/src/utils/formatPrice.ts`
- Modify: `frontend/src/app/cart/page.tsx` (type only)
- Modify: `frontend/src/app/checkout/page.tsx` (type only)

- [ ] **Step 1: Create `formatPrice.ts`**

```typescript
// frontend/src/utils/formatPrice.ts

export function formatPrice(
  amount: number | string,
  currencyCode: string,
  decimalPlaces: number = 2
): string {
  return `${currencyCode} ${Number(amount).toFixed(decimalPlaces)}`;
}

export function formatInclusivePrice(
  sellingPrice: number | string,
  taxRate: number | string,
  currencyCode: string,
  decimalPlaces: number = 2
): string {
  const inclusive = Number(sellingPrice) * (1 + Number(taxRate));
  return formatPrice(inclusive, currencyCode, decimalPlaces);
}
```

- [ ] **Step 2: Update `CartSummary` type in `cart/page.tsx`**

Find the existing `CartSummary` type (around line 39) and replace it:

```typescript
type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  tax_rate: string;
  tax_country: string;
  currency_code: string;
  currency_symbol: string;
  currency_decimal_places: number;
  total: string;
  free_shipping_unlocked: boolean;
};
```

- [ ] **Step 3: Update `CartSummary` type in `checkout/page.tsx`**

Find the existing `CartSummary` type in `checkout/page.tsx` (around lines 13-19) and replace with the same type above.

- [ ] **Step 4: Run lint to check types**

```bash
cd frontend
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/utils/formatPrice.ts frontend/src/app/cart/page.tsx frontend/src/app/checkout/page.tsx
git commit -m "feat(frontend): add formatPrice utility, update CartSummary type with currency fields"
```

---

## Task 16: Frontend — update `cart/page.tsx` display

**Files:**
- Modify: `frontend/src/app/cart/page.tsx`

- [ ] **Step 1: Update the "Estimated Tax" label**

Find the line in `cart/page.tsx` that renders the tax label (around line 191-194). It will look something like:

```tsx
<span>Estimated Tax</span>
```

Replace with a dynamic label using `tax_rate` and `tax_country` from the summary:

```tsx
<span>
  VAT ({summary?.tax_rate ? `${(parseFloat(summary.tax_rate) * 100).toFixed(0)}%` : "estimated"})
</span>
```

- [ ] **Step 2: Update currency display for all money values in the order summary**

For each money value (subtotal, shipping, tax, total) that currently renders as a number, wrap with `formatPrice`:

Add import at the top of the file:
```typescript
import { formatPrice } from "@/utils/formatPrice";
```

Then update each amount rendering. For example, if subtotal is currently:
```tsx
<span>{summary?.subtotal}</span>
```

Change to:
```tsx
<span>
  {summary?.subtotal
    ? formatPrice(summary.subtotal, summary.currency_code || "SAR", summary.currency_decimal_places || 2)
    : "—"}
</span>
```

Apply the same pattern to `shipping`, `tax`, and `total`.

- [ ] **Step 3: For guest cart, update the static tax="0" display**

Find the guest cart tax display (around line 474 — where `tax="0"` is passed). The tax label for guests should read "VAT (estimated at checkout)". Update the prop or the label component to show this when tax is "0".

- [ ] **Step 4: Run lint**

```bash
cd frontend
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/cart/page.tsx
git commit -m "feat(frontend): update cart page — dynamic VAT label, currency-aware price display"
```

---

## Task 17: Frontend — update `checkout/page.tsx` + `productcards.tsx`

**Files:**
- Modify: `frontend/src/app/checkout/page.tsx`
- Modify: `frontend/src/components/productcards/productcards.tsx`

- [ ] **Step 1: Update checkout page tax label (same pattern as cart)**

In `checkout/page.tsx`, find the "Estimated Tax" label (around lines 241-244) and replace with:

```tsx
import { formatPrice } from "@/utils/formatPrice";

// In the JSX:
<span>
  VAT ({summary?.tax_rate ? `${(parseFloat(summary.tax_rate) * 100).toFixed(0)}%` : "estimated"})
</span>
```

Update all money value displays in the order summary sidebar to use `formatPrice` (same pattern as Task 16 Step 2).

- [ ] **Step 2: Add ZATCA TRN to order confirmation**

In `checkout/page.tsx`, in the order confirmation/success section, add:

```tsx
{process.env.NEXT_PUBLIC_ZATCA_TRN && (
  <p className="text-xs text-gray-500 mt-2">
    VAT Registration No: {process.env.NEXT_PUBLIC_ZATCA_TRN}
  </p>
)}
```

- [ ] **Step 3: Update `productcards.tsx` to show tax-inclusive price**

Open `frontend/src/components/productcards/productcards.tsx`.

Add import at the top:
```typescript
import { formatInclusivePrice } from "@/utils/formatPrice";
```

Find where `selling_price` is rendered. The product data from the API now returns `display_price` (tax-inclusive) and `currency_code`. Update the price display to use `display_price`:

```tsx
{/* Replace existing selling_price display with: */}
<span className="font-semibold">
  {product.display_price
    ? formatPrice(product.display_price, product.currency_code || "SAR", product.currency_decimal_places || 2)
    : formatPrice(product.selling_price, "SAR")}
</span>
<span className="text-xs text-gray-400 ml-1">incl. VAT</span>
```

Add the import for `formatPrice` if not already imported:
```typescript
import { formatPrice } from "@/utils/formatPrice";
```

- [ ] **Step 4: Run lint**

```bash
cd frontend
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/checkout/page.tsx frontend/src/components/productcards/productcards.tsx
git commit -m "feat(frontend): tax-inclusive product prices with 'incl. VAT' label, ZATCA TRN on confirmation"
```

---

## Task 18: Env var updates

**Files:**
- Modify: `backend/zewadi/.env.example`
- Modify: `frontend/.env.example` (create if doesn't exist)

- [ ] **Step 1: Add backend env var**

Open `backend/zewadi/.env.example` and add:

```
# ZATCA VAT Registration Number (shown on invoices and order confirmations)
ZATCA_TRN=
```

- [ ] **Step 2: Add frontend env var**

Check if `frontend/.env.example` exists:
```bash
ls frontend/.env.example 2>/dev/null || echo "not found"
```

If it exists, add to it. If not, check `frontend/.env.local.example`. Add:

```
# ZATCA VAT Registration Number displayed on order confirmation
NEXT_PUBLIC_ZATCA_TRN=
```

- [ ] **Step 3: Verify `settings.py` has `DEFAULT_TAX_COUNTRY`**

```bash
grep "DEFAULT_TAX_COUNTRY" backend/zewadi/zewadi/settings.py
```

Expected: prints the line from Task 1 Step 4.

- [ ] **Step 4: Run full backend test suite one final time**

```bash
cd backend/zewadi
python manage.py test -v 1
```

Expected: all tests pass.

- [ ] **Step 5: Run frontend lint + build**

```bash
cd frontend
npm run lint && npm run build
```

Expected: both pass with no errors.

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/.env.example frontend/.env.example frontend/.env.local.example
git commit -m "feat: add ZATCA_TRN env var to .env.example files"
```

---

## Self-Review Checklist

After all tasks are done, verify:

- [ ] `python manage.py test -v 1` — all tests green
- [ ] `npm run build` — no TypeScript errors
- [ ] Django admin: visit `/admin/` and confirm `Currency`, `CountryConfig`, `TaxCategory`, `TaxRate` appear
- [ ] Django admin: confirm Product has `tax_category` dropdown and `ProductCountryPrice` inline table
- [ ] API: `GET /api/product/products/?country=SA` returns `display_price`, `currency_code` fields
- [ ] API: `GET /api/orders/cart/` returns `tax_rate`, `tax_country`, `currency_code` fields
- [ ] Cart label shows "VAT (15%)" not "Estimated Tax"
- [ ] Product cards show "incl. VAT" label
- [ ] Order created via checkout has `tax_rate_snapshot=0.1500`, `tax_country_snapshot="SA"`, `charged_currency="SAR"`
