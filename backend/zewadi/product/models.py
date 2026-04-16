from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.


class ProductCategory(models.TextChoices):
    FOOD = "food", "Food"
    SEED="seed","Seed"
    SUPPLEMENT = "supplement", "Supplement"
    OTHER = "other", "Other"


class ProductStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    ACTIVE = "active", "Active"
    INACTIVE = "inactive", "Inactive"


class StockStatus(models.TextChoices):
    IN_STOCK = "in_stock", "In Stock"
    LOW_STOCK = "low_stock", "Low Stock"
    OUT_OF_STOCK = "out_of_stock", "Out of Stock"


class CurrencyChoices(models.TextChoices):
    USD = "USD", "USD ($)"
    INR = "INR", "INR (₹)"
    AED = "AED", "AED (د.إ)"


class Product(models.Model):
    # Basic information
    product_name = models.CharField(max_length=150)
    product_subtitle = models.CharField(max_length=180, blank=True, null=True)
    product_code = models.CharField(max_length=50, unique=True)
    brand_name = "Zewadi"
    category = models.CharField(max_length=30, choices=ProductCategory.choices, default=ProductCategory.OTHER)
    product_status = models.CharField(max_length=20, choices=ProductStatus.choices, default=ProductStatus.DRAFT)
    
    image = models.ImageField(upload_to="products/images/")

    # Description
    short_description = models.CharField(max_length=150)
    full_description = models.TextField(blank=True, null=True)

    # Nutrition and wellness information
    key_ingredients = models.TextField(blank=True, null=True)
    health_benefits = models.TextField(blank=True, null=True)

    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
    )
    currency = models.CharField(max_length=3, choices=CurrencyChoices.choices, default=CurrencyChoices.USD)

    # Inventory
    stock_quantity = models.PositiveIntegerField(default=0)
    low_stock_alert = models.PositiveIntegerField(default=5)
    stock_status = models.CharField(max_length=20, choices=StockStatus.choices, default=StockStatus.IN_STOCK)
    allow_orders_when_out_of_stock = models.BooleanField(default=False)
    enable_low_stock_alerts = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

   

    def __str__(self):
        return f"{self.product_name} ({self.sku})"



class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    variant_name = models.CharField(max_length=120)
    sku = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.product.product_name} - {self.variant_name}"
