from decimal import Decimal

from django.db.models import Avg, Count
from rest_framework import serializers
from .models import Product, ProductCategory, ProductCountryPrice, ProductImage, ProductVariant
from tax.models import Currency

MAX_ALTERNATIVE_IMAGES = 4


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["id", "name", "slug", "is_active", "sort_order", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Category name is required.")
        return value

    def validate_slug(self, value):
        return value.strip().lower().replace("-", "_")

    def validate(self, attrs):
        from django.utils.text import slugify

        name = attrs.get("name", getattr(self.instance, "name", ""))
        slug = attrs.get("slug") or getattr(self.instance, "slug", "") or slugify(name).replace("-", "_")
        attrs["slug"] = slug
        existing = ProductCategory.objects.filter(slug=slug)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)
        if existing.exists():
            raise serializers.ValidationError({"slug": "A category with this slug already exists."})
        return attrs


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
    alternative_images = serializers.SerializerMethodField()
    brand_name = serializers.SerializerMethodField()
    allow_out_of_stock = serializers.BooleanField(source="allow_orders_when_out_of_stock", read_only=True)
    discount_amount = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()
    tax_category_code = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    currency_code = serializers.SerializerMethodField()
    currency_decimal_places = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_brand_name(self, obj):
        return obj.brand_name

    def get_category_name(self, obj):
        if not obj.category:
            return ""
        category = ProductCategory.objects.filter(slug=obj.category).only("name").first()
        return category.name if category else obj.category.replace("_", " ").title()

    def get_image(self, obj):
        return obj.image or None

    def get_alternative_images(self, obj):
        return [pi.image for pi in obj.alternative_images.all() if pi.image]

    def get_discount_amount(self, obj):
        return f"{obj.discount_amount:.2f}"

    def get_discount_percent(self, obj):
        return f"{obj.discount_percent:.2f}"

    def get_tax_category_code(self, obj):
        return obj.tax_category.code if obj.tax_category_id else "STANDARD"

    def _get_rating_stats(self, obj):
        if not hasattr(obj, "_rating_stats_cache"):
            obj._rating_stats_cache = obj.orders.filter(
                status="delivered",
                review__isnull=False,
            ).aggregate(
                average=Avg("review__rating"),
                count=Count("review"),
            )
        return obj._rating_stats_cache

    def get_average_rating(self, obj):
        average = self._get_rating_stats(obj)["average"]
        return f"{average:.1f}" if average is not None else None

    def get_review_count(self, obj):
        return self._get_rating_stats(obj)["count"] or 0

    def to_representation(self, obj):
        from product.services import get_product_price
        country = self.context.get("country", "SA")
        self._country_price_cache = get_product_price(obj, country)
        return super().to_representation(obj)

    def _get_country_price(self, obj):
        if not hasattr(self, "_country_price_cache"):
            from product.services import get_product_price
            country = self.context.get("country", "SA")
            self._country_price_cache = get_product_price(obj, country)
        return self._country_price_cache

    def get_display_price(self, obj):
        from tax.services import get_tax_rate
        price, currency = self._get_country_price(obj)
        cat_code = obj.tax_category.code if obj.tax_category_id else "STANDARD"
        country = self.context.get("country", "SA")
        rate = get_tax_rate(country, cat_code)
        inclusive = price * (Decimal("1") + rate)
        dp = currency.decimal_places
        return f"{inclusive:.{dp}f}"

    def get_currency_code(self, obj):
        _, currency = self._get_country_price(obj)
        return currency.code

    def get_currency(self, obj):
        return self.get_currency_code(obj)

    def get_currency_decimal_places(self, obj):
        _, currency = self._get_country_price(obj)
        return currency.decimal_places

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "product_subtitle",
            "product_code",
            "brand_name",
            "category",
            "category_name",
            "product_status",
            "image",
            "alternative_images",
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
            "display_price",
            "currency",
            "currency_code",
            "currency_decimal_places",
            "average_rating",
            "review_count",
            "discount_amount",
            "discount_percent",
            "tax_category_code",
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

    from tax.models import TaxCategory as _TaxCategory
    tax_category = serializers.SlugRelatedField(
        slug_field="code",
        queryset=_TaxCategory.objects.all(),
        required=False,
        allow_null=True,
    )
    variants = ProductVariantSerializer(many=True, required=False)
    alternative_images = serializers.ListField(
        child=serializers.URLField(required=False, allow_null=True, allow_blank=True),
        write_only=True,
        required=False,
        allow_empty=True,
    )
    currency = serializers.SlugRelatedField(
        slug_field="code",
        queryset=Currency.objects.filter(is_active=True),
        write_only=True,
        required=False,
    )

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

    def validate_alternative_images(self, value):
        if len(value) > MAX_ALTERNATIVE_IMAGES:
            raise serializers.ValidationError(f"Upload no more than {MAX_ALTERNATIVE_IMAGES} alternative images.")
        return value

    def validate_category(self, value):
        if not value:
            raise serializers.ValidationError("Category is required.")
        if not ProductCategory.objects.filter(slug=value, is_active=True).exists():
            raise serializers.ValidationError("Select an active product category.")
        return value

    def create(self, validated_data):

        # Variants remain in the database for compatibility, but this v1 flow
        # treats each sellable pack as a separate product/SKU.
        validated_data.pop("variants", [])
        alternative_images = validated_data.pop("alternative_images", [])
        currency = validated_data.pop("currency", None)

        # Create Product
        product = Product.objects.create(**validated_data)
        self._update_default_country_price(product, currency)
        self._replace_alternative_images(product, alternative_images)

        return product

    def update(self, instance, validated_data):

        validated_data.pop("variants", None)
        alternative_images = validated_data.pop("alternative_images", None)
        currency = validated_data.pop("currency", None)

        # Update Product
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        self._update_default_country_price(instance, currency)
        if alternative_images is not None:
            self._replace_alternative_images(instance, alternative_images)

        return instance

    def _update_default_country_price(self, product, currency):
        country_price = product.country_prices.filter(country="SA").select_related("currency").first()
        selected_currency = currency or (country_price.currency if country_price else None)
        if not selected_currency:
            selected_currency = Currency.objects.get(code="SAR")

        ProductCountryPrice.objects.update_or_create(
            product=product,
            country="SA",
            defaults={
                "currency": selected_currency,
                "selling_price": product.selling_price,
                "is_active": True,
            },
        )

    def _replace_alternative_images(self, product, images):
        if images is None:
            return

        product.alternative_images.all().delete()
        for index, image in enumerate([image for image in images if image]):
            ProductImage.objects.create(product=product, image=image, sort_order=index)
