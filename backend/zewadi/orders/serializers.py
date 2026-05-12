from decimal import Decimal

from rest_framework import serializers

from .models import CartItem, Order, OrderReview


class OrderCreateSerializer(serializers.ModelSerializer):
    """Writable serializer used when a user places a new order.
    The `user` field is set by the view — it is excluded from input."""
    product_id = serializers.IntegerField(write_only=True, required=False)
    variant_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_id",
            "product_id",
            "variant_id",
            "product_name",
            "pack_name",
            "pack_price",
            "quantity",
            "subtotal",
            "delivery_charge",
            "total_amount",
            "full_name",
            "phone",
            "email",
            "city",
            "postal_code",
            "address",
            "instructions",
            "payment_method",
            "payment_status",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_id",
            "payment_status",
            "status",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        validated_data.pop("product_id", None)
        validated_data.pop("variant_id", None)
        return Order.objects.create(**validated_data)


class OrderListSerializer(serializers.ModelSerializer):
    """Compact representation for listing a user's orders."""

    class Meta:
        model = Order
        fields = [
            "order_id",
            "product_name",
            "pack_name",
            "quantity",
            "total_amount",
            "status",
            "payment_method",
            "payment_status",
            "created_at",
            "updated_at",
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Full read-only representation of a single order."""

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = fields


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Admin-only serializer to update just the status field."""

    class Meta:
        model = Order
        fields = ["status"]


class OrderReviewSerializer(serializers.ModelSerializer):
    """Used for both creating and reading an order review."""

    class Meta:
        model = OrderReview
        fields = [
            "id",
            "order",
            "user",
            "rating",
            "title",
            "comment",
            "recommend",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]

    def validate_order(self, order):
        request = self.context.get("request")
        if request and order.user != request.user:
            raise serializers.ValidationError(
                "You can only review your own orders."
            )
        if order.status != "delivered":
            raise serializers.ValidationError(
                "You can only review a delivered order."
            )
        if hasattr(order, "review"):
            raise serializers.ValidationError(
                "A review already exists for this order."
            )
        return order

    def create(self, validated_data):
        return OrderReview.objects.create(**validated_data)


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    product_subtitle = serializers.CharField(source="product.product_subtitle", read_only=True)
    product_code = serializers.CharField(source="product.product_code", read_only=True)
    category = serializers.CharField(source="product.category", read_only=True)
    short_description = serializers.CharField(source="product.short_description", read_only=True)
    health_benefits = serializers.CharField(source="product.health_benefits", read_only=True)
    image = serializers.SerializerMethodField()
    currency = serializers.CharField(source="product.currency", read_only=True)
    stock_quantity = serializers.IntegerField(source="product.stock_quantity", read_only=True)
    stock_status = serializers.CharField(source="product.stock_status", read_only=True)
    variant_id = serializers.IntegerField(source="variant.id", read_only=True, allow_null=True)
    variant_name = serializers.CharField(source="variant.variant_name", read_only=True, allow_null=True)
    variant_stock = serializers.IntegerField(source="variant.stock", read_only=True, allow_null=True)
    unit_price = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_subtitle",
            "product_code",
            "category",
            "short_description",
            "health_benefits",
            "image",
            "currency",
            "stock_quantity",
            "stock_status",
            "variant_id",
            "variant_name",
            "variant_stock",
            "quantity",
            "unit_price",
            "line_total",
            "created_at",
            "updated_at",
        ]

    def get_unit_price(self, obj):
        return f"{Decimal(obj.unit_price):.2f}"

    def get_line_total(self, obj):
        return f"{Decimal(obj.line_total):.2f}"

    def get_image(self, obj):
        if not obj.product.image:
            return None
        request = self.context.get("request")
        image_url = obj.product.image.url
        return request.build_absolute_uri(image_url) if request else image_url
