from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "variant_name", "sku", "price", "stock"]


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "product_subtitle",
            "product_code",
            "category",
            "product_status",
            "image",
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
            "allow_orders_when_out_of_stock",
            "enable_low_stock_alerts",
            "variants",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProductCreateSerializer(serializers.ModelSerializer):
    """
    Used for create / update — accepts nested variants as writable input.
    """
    variants = ProductVariantSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            "product_name",
            "product_subtitle",
            "product_code",
            "category",
            "product_status",
            "image",
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
            "allow_orders_when_out_of_stock",
            "enable_low_stock_alerts",
            "variants",
        ]

    def create(self, validated_data):
        variants_data = validated_data.pop("variants", [])
        product = Product.objects.create(**validated_data)
        for variant in variants_data:
            ProductVariant.objects.create(product=product, **variant)
        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop("variants", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if variants_data is not None:
            # Replace all variants on a full update
            instance.variants.all().delete()
            for variant in variants_data:
                ProductVariant.objects.create(product=instance, **variant)

        return instance
