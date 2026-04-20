from django.contrib import admin
from .models import Order, OrderReview


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "order_id",
        "user",
        "product_name",
        "pack_name",
        "total_amount",
        "payment_method",
        "payment_status",
        "status",
        "created_at",
    ]
    list_filter = ["status", "payment_method", "payment_status", "created_at"]
    search_fields = ["order_id", "user__email", "full_name", "product_name"]
    readonly_fields = ["order_id", "created_at", "updated_at"]
    ordering = ["-created_at"]


@admin.register(OrderReview)
class OrderReviewAdmin(admin.ModelAdmin):
    list_display = ["order", "user", "rating", "recommend", "created_at"]
    list_filter = ["rating", "recommend", "created_at"]
    search_fields = ["order__order_id", "user__email", "title"]
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]
