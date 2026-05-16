from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from product.models import Product, ProductStatus
from .models import Notification, UserNotificationReceipt
from .utils import send_low_stock_notification


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
