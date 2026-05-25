import datetime
from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase
from django.core.management import call_command
from django.utils import timezone
from unittest.mock import patch

from accounts.models import User
from product.models import Product, ProductStatus
from tax.models import Currency, CountryConfig, TaxCategory, TaxRate
from .models import Notification, UserNotificationReceipt
from .utils import send_low_stock_notification


def _ensure_tax_config():
    sar, _ = Currency.objects.get_or_create(
        code="SAR", defaults={"name": "Saudi Riyal", "symbol": "SAR", "decimal_places": 2}
    )
    CountryConfig.objects.get_or_create(country="SA", defaults={"name": "Saudi Arabia", "currency": sar})
    standard, _ = TaxCategory.objects.get_or_create(code="STANDARD", defaults={"name": "Standard Rate"})
    TaxCategory.objects.get_or_create(code="ZERO", defaults={"name": "Zero-Rated"})
    TaxRate.objects.get_or_create(
        country="SA", tax_category=standard, region=None, is_active=True,
        defaults={"rate": "0.1500", "name": "SA Standard 15%", "effective_from": datetime.date(2020, 7, 1)},
    )
    return standard


class NotificationReceiptTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.com",
            password="Pass@1234",
            full_name="Admin User",
            user_name="adminuser",
            phone="+10000000003",
            role="ADMIN",
        )
        self.community_user = User.objects.create_user(
            email="member@example.com",
            password="Pass@1234",
            full_name="Member User",
            user_name="memberuser",
            phone="+10000000004",
            role="COMMUNITY_USER",
        )
        self.consultant = User.objects.create_user(
            email="consultant@example.com",
            password="Pass@1234",
            full_name="Consultant User",
            user_name="consultantuser",
            phone="+10000000005",
            role="CONSULTANT",
        )

    def test_sent_notification_creates_receipts_for_matching_role(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/notifications/",
            {
                "title": "Community update",
                "body": "New event published.",
                "notification_type": "SYSTEM",
                "target_role": "community_user",
                "status": "SENT",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        notification = Notification.objects.get(pk=response.data["id"])
        self.assertTrue(
            UserNotificationReceipt.objects.filter(
                user=self.community_user,
                notification=notification,
            ).exists()
        )
        self.assertFalse(
            UserNotificationReceipt.objects.filter(
                user=self.consultant,
                notification=notification,
            ).exists()
        )

    @patch("notifications.email.send_mail")
    def test_email_only_notification_does_not_create_in_app_receipts(self, send_mail_mock):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/notifications/",
            {
                "title": "Email update",
                "body": "This should be email only.",
                "notification_type": "SYSTEM",
                "target_role": "community_user",
                "delivery_channels": ["email"],
                "status": "SENT",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        notification = Notification.objects.get(pk=response.data["id"])
        self.assertFalse(UserNotificationReceipt.objects.filter(notification=notification).exists())
        send_mail_mock.assert_called_once()

    def test_scheduled_notification_waits_until_command_runs(self):
        self.client.force_authenticate(self.admin)
        scheduled_at = timezone.now() + datetime.timedelta(minutes=10)

        response = self.client.post(
            "/api/notifications/",
            {
                "title": "Scheduled update",
                "body": "This should wait.",
                "notification_type": "REMINDER",
                "target_role": "community_user",
                "delivery_channels": ["in_app"],
                "status": "SCHEDULED",
                "scheduled_at": scheduled_at.isoformat(),
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        notification = Notification.objects.get(pk=response.data["id"])
        self.assertEqual(notification.status, "SCHEDULED")
        self.assertFalse(UserNotificationReceipt.objects.filter(notification=notification).exists())

        notification.scheduled_at = timezone.now() - datetime.timedelta(minutes=1)
        notification.save(update_fields=["scheduled_at"])
        call_command("send_scheduled_notifications")

        notification.refresh_from_db()
        self.assertEqual(notification.status, "SENT")
        self.assertTrue(
            UserNotificationReceipt.objects.filter(
                user=self.community_user,
                notification=notification,
            ).exists()
        )


class LowStockNotificationTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="stock-admin@example.com",
            password="Pass@1234",
            full_name="Stock Admin",
            user_name="stockadmin",
            phone="+10000000006",
            role="ADMIN",
        )
        self.internal_staff = User.objects.create_user(
            email="staff@example.com",
            password="Pass@1234",
            full_name="Internal Staff",
            user_name="staffuser",
            phone="+10000000007",
            role="INTERNAL_STAFF",
        )
        self.community_user = User.objects.create_user(
            email="stock-member@example.com",
            password="Pass@1234",
            full_name="Stock Member",
            user_name="stockmember",
            phone="+10000000008",
            role="COMMUNITY_USER",
        )
        standard = _ensure_tax_config()
        self.product = Product.objects.create(
            product_name="Buckwheat 500g",
            product_code="BWH-LOW",
            category="food",
            product_status=ProductStatus.ACTIVE,
            short_description="Single SKU pack",
            base_price=Decimal("80.00"),
            sale_price=Decimal("120.00"),
            cost_price=Decimal("80.00"),
            mrp_price=Decimal("150.00"),
            selling_price=Decimal("120.00"),
            stock_quantity=3,
            low_stock_alert=5,
            tax_category=standard,
        )

    def test_low_stock_notification_targets_admin_and_internal_staff_only(self):
        send_low_stock_notification(self.product)

        notification = Notification.objects.get(title="Low Stock Alert - Buckwheat 500g")
        self.assertEqual(notification.notification_type, "ALERT")
        self.assertEqual(notification.target_role, "admin")
        self.assertTrue(
            UserNotificationReceipt.objects.filter(
                user=self.admin,
                notification=notification,
                is_read=False,
            ).exists()
        )
        self.assertTrue(
            UserNotificationReceipt.objects.filter(
                user=self.internal_staff,
                notification=notification,
                is_read=False,
            ).exists()
        )
        self.assertFalse(
            UserNotificationReceipt.objects.filter(
                user=self.community_user,
                notification=notification,
            ).exists()
        )

    def test_low_stock_notification_is_not_duplicated_for_same_product(self):
        send_low_stock_notification(self.product)
        send_low_stock_notification(self.product)

        self.assertEqual(
            Notification.objects.filter(title="Low Stock Alert - Buckwheat 500g").count(),
            1,
        )
