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

    def get_brand_name(self, obj):
        return obj.brand_name

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        image_url = obj.image.url
        return request.build_absolute_uri(image_url) if request else image_url

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

    def create(self, validated_data):

        variants_data = validated_data.pop("variants", [])

        # Create Product
        product = Product.objects.create(**validated_data)

        # Create Multiple Variants
        variant_objects = [
            ProductVariant(product=product, **variant)
            for variant in variants_data
        ]

        ProductVariant.objects.bulk_create(variant_objects)

        return product

    def update(self, instance, validated_data):

        variants_data = validated_data.pop("variants", None)

        # Update Product
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Update Variants
        if variants_data is not None:

            # Delete old variants
            instance.variants.all().delete()

            # Create new variants
            variant_objects = [
                ProductVariant(product=instance, **variant)
                for variant in variants_data
            ]

            ProductVariant.objects.bulk_create(variant_objects)

        return instance
