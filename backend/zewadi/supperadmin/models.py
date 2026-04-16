from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models


class AccessLevel(models.TextChoices):
    LOW = "low", "Low Access"
    MEDIUM = "medium", "Medium Access"
    HIGH = "high", "High Access"
    FULL = "full", "Full Access"


class RoleStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    INACTIVE = "inactive", "Inactive"


class PermissionModule(models.TextChoices):
    DASHBOARD = "dashboard", "Dashboard"
    USERS = "users", "Users"
    ORDERS = "orders", "Orders"
    PRODUCTS = "products", "Products"
    RECIPES = "recipes", "Recipes"
    BLOGS = "blogs", "Blogs"
    CONSULTATIONS = "consultations", "Consultations"
    NUTRITIONISTS = "nutritionists", "Nutritionists"
    NOTIFICATIONS = "notifications", "Notifications"
    REPORTS = "reports", "Reports"





class Role(models.Model):
    role_name = models.CharField(max_length=60, unique=True)
    role_status = models.CharField(max_length=20, choices=RoleStatus.choices, default=RoleStatus.ACTIVE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        

    def __str__(self):
        return self.role_name


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="permissions")
    module = models.CharField(max_length=30, choices=PermissionModule.choices)

    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    can_approve = models.BooleanField(default=False)
    can_export = models.BooleanField(default=False)
    full_access = models.BooleanField(default=False)

    class Meta:
        unique_together = ("role", "module")
        ordering = ["module"]

    

    def __str__(self):
        return f"{self.role.role_name} - {self.get_module_display()}"
