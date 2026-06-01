from django.contrib import admin
from .models import CartItem, CustomGiftOrder, Order, OrderReview,CustomGiftOrder


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "order_id",
        "user",
        "product",
        "product_name",
        "product_code",
        "pack_name",
        "selling_price",
        "total_amount",
        "payment_method",
        "payment_status",
        "status",
        "created_at",
    ]
    list_filter = ["status", "payment_method", "payment_status", "created_at"]
    search_fields = ["order_id", "user__email", "full_name", "product_name", "product__product_name"]
    readonly_fields = ["order_id", "created_at", "updated_at"]
    ordering = ["-created_at"]


@admin.register(OrderReview)
class OrderReviewAdmin(admin.ModelAdmin):
    list_display = ["order", "user", "rating", "recommend", "created_at"]
    list_filter = ["rating", "recommend", "created_at"]
    search_fields = ["order__order_id", "user__email", "title"]
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]


@admin.register(CustomGiftOrder)
class CustomGiftOrderAdmin(admin.ModelAdmin):
    list_display = [
        "custom_gift_id",
        "user",
        "gift_type",
        "box_name",
        "total_amount",
        "payment_method",
        "payment_status",
        "status",
        "created_at",
    ]
    list_filter = ["gift_type", "payment_method", "payment_status", "status", "created_at"]
    search_fields = ["custom_gift_id", "user__email", "full_name", "phone", "box_name"]
    readonly_fields = ["custom_gift_id", "created_at", "updated_at"]
    ordering = ["-created_at"]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "variant", "quantity", "updated_at"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["user__email", "product__product_name", "variant__variant_value"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-updated_at"]


