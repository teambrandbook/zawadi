from rest_framework import serializers
from .models import Order, OrderReview


class OrderCreateSerializer(serializers.ModelSerializer):
    """Writable serializer used when a user places a new order.
    The `user` field is set by the view — it is excluded from input."""

    class Meta:
        model = Order
        exclude = ["order_id", "user", "created_at", "updated_at"]

    def create(self, validated_data):
        return Order.objects.create(**validated_data)


class OrderListSerializer(serializers.ModelSerializer):
    """Compact representation for listing a user's orders."""

    class Meta:
        model = Order
        fields = [
            "order_id",
            "product_name",
            "total_amount",
            "status",
            "payment_method",
            "created_at",
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
