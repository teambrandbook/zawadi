from decimal import Decimal
import re

from rest_framework import serializers

from .models import CartItem, CustomGiftOrder, Order, OrderReview
from product.models import Product, ProductVariant


def _parse_weight_grams(value):
    match = re.search(r"(\d+(?:\.\d+)?)\s*(kg|g)", str(value or ""), re.IGNORECASE)
    if not match:
        return None
    amount = Decimal(match.group(1))
    return amount * Decimal("1000") if match.group(2).lower() == "kg" else amount


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
            "product",
            "product_id",
            "variant_id",
            "product_code",
            "product_name",
            "pack_name",
            "pack_price",
            "cost_price",
            "mrp_price",
            "selling_price",
            "discount_amount",
            "discount_percent",
            "quantity",
            "subtotal",
            "delivery_charge",
            "tax_amount",
            "tax_rate_snapshot",
            "tax_country_snapshot",
            "charged_currency",
            "charged_amount",
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
            "product",
            "payment_status",
            "status",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "product_name": {"required": False},
            "pack_name": {"required": False},
            "pack_price": {"required": False},
            "subtotal": {"required": False},
            "tax_rate_snapshot": {"required": False},
            "tax_country_snapshot": {"required": False},
            "charged_currency": {"required": False},
            "charged_amount": {"required": False},
            "total_amount": {"required": False},
        }

    def _format_pack_name(self, value, unit):
        parts = [str(part).strip() for part in (value, unit) if str(part).strip()]
        return " ".join(parts)

    def validate(self, attrs):
        product_id = attrs.get("product_id")
        quantity = attrs.get("quantity") or 1

        if not product_id:
            return attrs

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product not found."})

        attrs["product_name"] = product.product_name
        attrs["product"] = product
        attrs["product_code"] = product.product_code
        attrs["pack_name"] = self._format_pack_name(
            product.unit_quantity,
            product.product_unit,
        ) or product.product_name
        attrs["cost_price"] = product.cost_price
        attrs["mrp_price"] = product.mrp_price
        attrs["selling_price"] = product.selling_price
        attrs["pack_price"] = product.selling_price
        attrs["discount_amount"] = product.discount_amount
        attrs["discount_percent"] = product.discount_percent
        attrs["subtotal"] = Decimal(product.selling_price) * Decimal(quantity)
        attrs["tax_amount"] = attrs.get("tax_amount") or Decimal("0.00")
        attrs["total_amount"] = (
            Decimal(attrs["subtotal"])
            + Decimal(attrs.get("delivery_charge") or 0)
            + Decimal(attrs["tax_amount"])
        )
        from product.services import get_product_price

        _, currency = get_product_price(product, attrs.get("tax_country_snapshot") or "SA")
        attrs["charged_currency"] = currency.code
        attrs["charged_amount"] = attrs["total_amount"]

        return attrs

    def create(self, validated_data):
        validated_data.pop("product_id", None)
        validated_data.pop("variant_id", None)
        return Order.objects.create(**validated_data)


class CustomGiftOrderCreateSerializer(serializers.ModelSerializer):
    user_image = serializers.SerializerMethodField()

    class Meta:
        model = CustomGiftOrder
        fields = [
            "id",
            "custom_gift_id",
            "gift_type",
            "box_id",
            "box_name",
            "box_price",
            "box_capacity",
            "items",
            "message",
            "occasion",
            "full_name",
            "phone",
            "email",
            "city",
            "postal_code",
            "address",
            "subtotal",
            "delivery_charge",
            "tax_amount",
            "total_amount",
            "payment_method",
            "payment_status",
            "status",
            "user_image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "custom_gift_id",
            "payment_status",
            "status",
            "user_image",
            "created_at",
            "updated_at",
        ]

    def get_user_image(self, obj):
        if not obj.user or not obj.user.photo:
            return None
        return obj.user.photo

    def validate_items(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("Add at least one product to the gift box.")
        for item in value:
            size = str(item.get("size", "")).strip() if isinstance(item, dict) else ""
            if not size or _parse_weight_grams(size) is None:
                raise serializers.ValidationError("Each custom gift product must include a valid size.")
        return value

    def validate(self, attrs):
        required_fields = [
            "gift_type",
            "box_id",
            "box_name",
            "box_price",
            "box_capacity",
            "full_name",
            "phone",
            "address",
            "subtotal",
            "total_amount",
            "payment_method",
        ]
        missing = [field for field in required_fields if not str(attrs.get(field, "")).strip()]
        if missing:
            raise serializers.ValidationError(
                {"detail": "Please complete all required custom gift fields.", "missing": missing}
            )

        box_capacity_grams = _parse_weight_grams(attrs.get("box_capacity"))
        if box_capacity_grams is None:
            raise serializers.ValidationError({"box_capacity": "Choose a valid gift box size."})

        total_item_grams = Decimal("0")
        for item in attrs.get("items", []):
            try:
                quantity = int(item.get("quantity") or 1)
            except (TypeError, ValueError):
                raise serializers.ValidationError({"items": "Custom gift product quantity must be valid."})
            if quantity <= 0:
                raise serializers.ValidationError({"items": "Custom gift product quantity must be at least 1."})
            item_grams = _parse_weight_grams(item.get("size"))
            if item_grams is None:
                raise serializers.ValidationError({"items": "Each custom gift product must include a valid size."})
            total_item_grams += item_grams * quantity

        if total_item_grams > box_capacity_grams:
            raise serializers.ValidationError(
                {"items": "Selected products exceed the gift box capacity."}
            )

        payment_method = attrs.get("payment_method")
        if payment_method == "cod":
            attrs["payment_status"] = "confirmed"
            attrs["status"] = "confirmed"
        elif payment_method == "bank_transfer":
            attrs["payment_status"] = "pending"
            attrs["status"] = "pending"
        else:
            raise serializers.ValidationError({"payment_method": "Choose cash on delivery or bank transfer."})

        return attrs

    def create(self, validated_data):
        return CustomGiftOrder.objects.create(**validated_data)


class OrderListSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()
    user_image = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "order_id",
            "product_code",
            "product_name",
            "product_image",
            "user_image",
            "pack_name",
            "pack_price",
            "cost_price",
            "mrp_price",
            "selling_price",
            "discount_amount",
            "discount_percent",
            "quantity",
            "subtotal",
            "delivery_charge",
            "tax_amount",
            "charged_currency",
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
            "user",
        ]
        read_only_fields = [field.name for field in Order._meta.fields]

    def get_product_image(self, obj):
        product = Product.objects.filter(product_name=obj.product_name).only("image").first()
        if not product or not product.image:
            return None
        # product.image is a URLField (Cloudinary URL) — return directly
        return product.image

    def get_user_image(self, obj):
        if not obj.user or not obj.user.photo:
            return None
        # user.photo is a URLField (Cloudinary URL) — return directly
        return obj.user.photo


class OrderDetailSerializer(serializers.ModelSerializer):
    """Full read-only representation of a single order."""
    product_image = serializers.SerializerMethodField()
    user_image = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "order_id",
            "product_code",
            "product_name",
            "product_image",
            "user_image",
            "pack_name",
            "pack_price",
            "cost_price",
            "mrp_price",
            "selling_price",
            "discount_amount",
            "discount_percent",
            "quantity",
            "subtotal",
            "delivery_charge",
            "tax_amount",
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
            "user",
        ]
        read_only_fields = [field.name for field in Order._meta.fields]

    def get_product_image(self, obj):
        product = Product.objects.filter(product_name=obj.product_name).only("image").first()
        if not product or not product.image:
            return None
        # product.image is a URLField (Cloudinary URL) — return directly
        return product.image

    def get_user_image(self, obj):
        if not obj.user or not obj.user.photo:
            return None
        # user.photo is a URLField (Cloudinary URL) — return directly
        return obj.user.photo


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Admin-only serializer to update just the status field."""

    class Meta:
        model = Order
        fields = ["status"]


class CustomGiftOrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Admin-only serializer to update a custom gift fulfillment status."""

    class Meta:
        model = CustomGiftOrder
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
        if not order.product_id:
            raise serializers.ValidationError(
                "This order cannot be reviewed because its product is no longer available."
            )
        if hasattr(order, "review"):
            raise serializers.ValidationError(
                "A review already exists for this order."
            )
        return order

    def create(self, validated_data):
        return OrderReview.objects.create(**validated_data)


class CartItemSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    product_subtitle = serializers.CharField(source="product.product_subtitle", read_only=True)
    product_code = serializers.CharField(source="product.product_code", read_only=True)
    category = serializers.CharField(source="product.category", read_only=True)
    short_description = serializers.CharField(source="product.short_description", read_only=True)
    health_benefits = serializers.CharField(source="product.health_benefits", read_only=True)
    image = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    stock_quantity = serializers.IntegerField(source="product.stock_quantity", read_only=True)
    stock_status = serializers.CharField(source="product.stock_status", read_only=True)
    variant_id = serializers.IntegerField(source="variant.id", read_only=True, allow_null=True)
    variant_name = serializers.CharField(source="variant.variant_value", read_only=True, allow_null=True)
    variant_stock = serializers.IntegerField(source="variant.stock", read_only=True, allow_null=True)
    mrp_price = serializers.DecimalField(source="product.mrp_price", max_digits=10, decimal_places=2, read_only=True)
    selling_price = serializers.DecimalField(source="product.selling_price", max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()
    unit_price = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "user_id",
            "user_email",
            "user_name",
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
            "mrp_price",
            "selling_price",
            "discount_amount",
            "discount_percent",
            "quantity",
            "unit_price",
            "line_total",
            "created_at",
            "updated_at",
        ]

    def get_unit_price(self, obj):
        return f"{Decimal(obj.unit_price):.2f}"

    def get_currency(self, obj):
        from django.conf import settings
        from product.services import get_product_price

        country = getattr(settings, "DEFAULT_TAX_COUNTRY", "SA")
        _, currency = get_product_price(obj.product, country)
        return currency.code

    def get_line_total(self, obj):
        return f"{Decimal(obj.line_total):.2f}"

    def get_discount_amount(self, obj):
        return f"{obj.product.discount_amount:.2f}"

    def get_discount_percent(self, obj):
        return f"{obj.product.discount_percent:.2f}"

    def get_image(self, obj):
        if not obj.product.image:
            return None
        # product.image is a URLField (Cloudinary URL) — return directly
        return obj.product.image
