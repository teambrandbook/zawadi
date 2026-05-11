from django.db import models, transaction
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("upi", "UPI"),
        ("card", "Card"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    order_id = models.CharField(max_length=20, unique=True, blank=True)
    user = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="orders"
    )
    product_name = models.CharField(max_length=255)
    pack_name = models.CharField(max_length=255)
    pack_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_charge = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Shipping / contact details
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    address = models.TextField()
    instructions = models.TextField(blank=True)

    # Payment & status
    payment_method = models.CharField(
        max_length=10,
        choices=PAYMENT_METHOD_CHOICES,
        default="cod",
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="pending",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.order_id:
            with transaction.atomic():
                year = timezone.now().year
                count = (
                    Order.objects.select_for_update()
                    .filter(order_id__startswith=f"ZW-{year}-")
                    .count()
                )
                self.order_id = f"ZW-{year}-{str(count + 1).zfill(3)}"
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_id} — {self.user}"


class OrderReview(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name="review"
    )
    user = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="order_reviews"
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=255, blank=True)
    comment = models.TextField()
    recommend = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review for {self.order.order_id} — {self.rating}/5"


class CartItem(models.Model):
    user = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="cart_items"
    )
    product = models.ForeignKey(
        "product.Product", on_delete=models.CASCADE, related_name="cart_items"
    )
    variant = models.ForeignKey(
        "product.ProductVariant",
        on_delete=models.SET_NULL,
        related_name="cart_items",
        blank=True,
        null=True,
    )
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product", "variant"],
                name="unique_cart_product_variant_per_user",
            )
        ]

    @property
    def unit_price(self):
        if self.variant:
            return self.variant.price
        return self.product.sale_price or self.product.base_price

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.user} — {self.product.product_name} x {self.quantity}"
