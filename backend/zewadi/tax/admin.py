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
