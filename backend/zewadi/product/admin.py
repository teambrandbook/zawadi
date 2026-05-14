from django.contrib import admin
from .models import Product, ProductVariant


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ["variant_value", "variant_unit", "cost", "price", "stock"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "product_name",
        "product_code",
        "category",
        "product_status",
        "stock_status",
        "base_price",
        "currency",
        "created_at",
    ]
    list_filter = ["category", "product_status", "stock_status", "currency"]
    search_fields = ["product_name", "product_code"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ProductVariantInline]
    fieldsets = (
        ("Basic Info", {
            "fields": (
                "product_name",
                "product_subtitle",
                "product_code",
                "category",
                "product_status",
                "image",
                "product_unit",
                "unit_quantity",
                "alternative_unit_enabled",
            )
        }),
        ("Description", {
            "fields": ("short_description", "full_description")
        }),
        ("Nutrition & Wellness", {
            "fields": ("key_ingredients", "health_benefits")
        }),
        ("Pricing", {
            "fields": ("base_price", "sale_price", "currency")
        }),
        ("Inventory", {
            "fields": (
                "stock_quantity",
                "low_stock_alert",
                "stock_status",
                "allow_orders_when_out_of_stock",
                "enable_low_stock_alerts",
            )
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )


admin.site.register(ProductVariant)
