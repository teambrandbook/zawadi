from django.db import models


class Currency(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    decimal_places = models.PositiveSmallIntegerField(default=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "currencies"
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} — {self.name}"


class CountryConfig(models.Model):
    country = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name="countries")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "country configurations"
        ordering = ["country"]

    def __str__(self):
        return f"{self.country} ({self.currency.code})"


class TaxCategory(models.Model):
    name = models.CharField(max_length=100)
    code = models.SlugField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "tax categories"
        ordering = ["code"]

    def __str__(self):
        return self.name


class TaxRate(models.Model):
    country = models.CharField(max_length=2)
    region = models.CharField(max_length=10, null=True, blank=True)
    tax_category = models.ForeignKey(TaxCategory, on_delete=models.PROTECT, related_name="rates")
    rate = models.DecimalField(max_digits=5, decimal_places=4)
    name = models.CharField(max_length=100)
    effective_from = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["country", "tax_category"]
        constraints = [
            models.UniqueConstraint(
                fields=["country", "region", "tax_category"],
                condition=models.Q(is_active=True),
                name="unique_active_tax_rate_per_country_category",
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.rate * 100:.2f}%)"
