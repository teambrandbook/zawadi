from rest_framework import serializers
from .models import Product, ProductVariant
from zewadi.validators import validate_image_upload


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "variant_value",
            "variant_unit",
            "cost",
            "price",
            "stock",
        ]
        read_only_fields = ["id"]

    def to_internal_value(self, data):
        data = data.copy()
        if data.get("variant_unit"):
            data["variant_unit"] = str(data["variant_unit"]).lower()
        return super().to_internal_value(data)


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    brand_name = serializers.SerializerMethodField()
    allow_out_of_stock = serializers.BooleanField(source="allow_orders_when_out_of_stock", read_only=True)
    discount_amount = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()

    def get_brand_name(self, obj):
        return obj.brand_name

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        image_url = obj.image.url
        return request.build_absolute_uri(image_url) if request else image_url

    def get_discount_amount(self, obj):
        return f"{obj.discount_amount:.2f}"

    def get_discount_percent(self, obj):
        return f"{obj.discount_percent:.2f}"

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
            "discount_amount",
            "discount_percent",
            "currency",
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


class ProductCreateSerializer(serializers.ModelSerializer):
    """
    Create / Update Product with Multiple Variants
    """

    variants = ProductVariantSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = "__all__"

    def to_internal_value(self, data):
        data = data.copy()
        base_price = data.get("base_price")
        sale_price = data.get("sale_price")

        if data.get("cost_price") in (None, "") and base_price not in (None, ""):
            data["cost_price"] = base_price
        if data.get("selling_price") in (None, ""):
            data["selling_price"] = sale_price if sale_price not in (None, "") else base_price
        if data.get("mrp_price") in (None, ""):
            data["mrp_price"] = sale_price if sale_price not in (None, "") else base_price

        # Legacy fields are still required on the model during the transition.
        if data.get("base_price") in (None, "") and data.get("cost_price") not in (None, ""):
            data["base_price"] = data["cost_price"]
        if data.get("sale_price") in (None, "") and data.get("selling_price") not in (None, ""):
            data["sale_price"] = data["selling_price"]

        return super().to_internal_value(data)

    def validate(self, attrs):
        cost_price = attrs.get("cost_price")
        mrp_price = attrs.get("mrp_price")
        selling_price = attrs.get("selling_price")

        if self.instance:
            cost_price = self.instance.cost_price if cost_price is None else cost_price
            mrp_price = self.instance.mrp_price if mrp_price is None else mrp_price
            selling_price = self.instance.selling_price if selling_price is None else selling_price

        if mrp_price is not None and selling_price is not None and selling_price > mrp_price:
            raise serializers.ValidationError({
                "selling_price": "Selling price cannot be greater than MRP.",
            })
        if cost_price is not None and cost_price < 0:
            raise serializers.ValidationError({"cost_price": "Cost price cannot be negative."})
        if selling_price is not None and selling_price < 0:
            raise serializers.ValidationError({"selling_price": "Selling price cannot be negative."})
        return attrs

    def create(self, validated_data):

        # Variants remain in the database for compatibility, but this v1 flow
        # treats each sellable pack as a separate product/SKU.
        validated_data.pop("variants", [])

        # Create Product
        product = Product.objects.create(**validated_data)

        return product

    def update(self, instance, validated_data):

        validated_data.pop("variants", None)

        # Update Product
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
