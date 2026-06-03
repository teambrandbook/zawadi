import datetime
from decimal import Decimal
from types import SimpleNamespace

from rest_framework import status
from rest_framework.test import APITestCase
from django.core.management import call_command
from django.test import override_settings
from django.utils import timezone
from unittest.mock import patch

from accounts.models import User
from product.models import Product, ProductStatus
from tax.models import Currency, CountryConfig, TaxCategory, TaxRate
from .fcm import send_pushes_for_notification
from .models import Notification, PushDevice, UserNotificationReceipt
from .utils import send_low_stock_notification, send_user_notification


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

    def test_admin_target_creates_receipts_for_admin_users(self):
        lowercase_admin = User.objects.create_user(
            email="lower-admin@example.com",
            password="Pass@1234",
            full_name="Lower Admin",
            user_name="loweradmin",
            phone="+10000000009",
            role="admin",
        )
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/notifications/",
            {
                "title": "Admin update",
                "body": "This should go to admins.",
                "notification_type": "SYSTEM",
                "target_role": "admin",
                "delivery_channels": ["in_app"],
                "status": "SENT",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        notification = Notification.objects.get(pk=response.data["id"])
        self.assertTrue(
            UserNotificationReceipt.objects.filter(
                user=self.admin,
                notification=notification,
            ).exists()
        )
        self.assertTrue(
            UserNotificationReceipt.objects.filter(
                user=lowercase_admin,
                notification=notification,
            ).exists()
        )
        self.assertFalse(
            UserNotificationReceipt.objects.filter(
                user=self.community_user,
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

    def test_direct_notification_is_visible_only_to_target_user(self):
        other_member = User.objects.create_user(
            email="other-member@example.com",
            password="Pass@1234",
            full_name="Other Member",
            user_name="othermember",
            phone="+10000000010",
            role="COMMUNITY_USER",
        )

        send_user_notification(
            self.community_user,
            "Order shipped",
            "Your order is on its way.",
            action_url="/communityDashBoard/myorders",
        )

        notification = Notification.objects.get(title="Order shipped")
        self.assertEqual(notification.target_user, self.community_user)
        self.assertTrue(UserNotificationReceipt.objects.filter(user=self.community_user, notification=notification).exists())
        self.assertFalse(UserNotificationReceipt.objects.filter(user=other_member, notification=notification).exists())

    def test_external_action_url_is_rejected(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/notifications/",
            {
                "title": "Unsafe link",
                "body": "Do not accept this.",
                "target_role": "community_user",
                "status": "DRAFT",
                "action_url": "https://example.com/phishing",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_delete_only_their_own_inbox_receipt(self):
        notification = Notification.objects.create(
            title="Dismissable update",
            body="Remove this from one inbox only.",
            status="SENT",
        )
        own_receipt = UserNotificationReceipt.objects.create(
            user=self.community_user,
            notification=notification,
        )
        other_receipt = UserNotificationReceipt.objects.create(
            user=self.consultant,
            notification=notification,
        )
        self.client.force_authenticate(self.community_user)

        forbidden = self.client.delete(f"/api/notifications/inbox/{other_receipt.pk}/")
        self.assertEqual(forbidden.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(UserNotificationReceipt.objects.filter(pk=other_receipt.pk).exists())

        deleted = self.client.delete(f"/api/notifications/inbox/{own_receipt.pk}/")
        self.assertEqual(deleted.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(UserNotificationReceipt.objects.filter(pk=own_receipt.pk).exists())
        self.assertTrue(Notification.objects.filter(pk=notification.pk).exists())


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


class PushDeviceTests(APITestCase):
    def setUp(self):
        self.first_user = User.objects.create_user(
            email="push-one@example.com",
            password="Pass@1234",
            full_name="Push One",
            user_name="pushone",
            phone="+10000000011",
            role="COMMUNITY_USER",
        )
        self.second_user = User.objects.create_user(
            email="push-two@example.com",
            password="Pass@1234",
            full_name="Push Two",
            user_name="pushtwo",
            phone="+10000000012",
            role="COMMUNITY_USER",
        )

    def test_register_refresh_reassign_and_current_browser_unregister(self):
        token = "browser-token"
        self.client.force_authenticate(self.first_user)
        register = self.client.post("/api/notifications/push-devices/register/", {"token": token}, format="json")
        self.assertEqual(register.status_code, status.HTTP_200_OK)
        status_response = self.client.get("/api/notifications/push-devices/status/", {"token": token})
        self.assertTrue(status_response.data["registered"])
        device = PushDevice.objects.get(token=token)
        first_seen_at = device.last_seen_at

        refresh = self.client.post("/api/notifications/push-devices/register/", {"token": token}, format="json")
        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        device.refresh_from_db()
        self.assertGreaterEqual(device.last_seen_at, first_seen_at)

        self.client.force_authenticate(self.second_user)
        reassign = self.client.post("/api/notifications/push-devices/register/", {"token": token}, format="json")
        self.assertEqual(reassign.status_code, status.HTTP_200_OK)
        device.refresh_from_db()
        self.assertEqual(device.user, self.second_user)
        self.assertTrue(device.is_active)

        self.client.force_authenticate(self.first_user)
        wrong_user = self.client.delete("/api/notifications/push-devices/unregister/", {"token": token}, format="json")
        self.assertFalse(wrong_user.data["unregistered"])
        device.refresh_from_db()
        self.assertTrue(device.is_active)

        self.client.force_authenticate(self.second_user)
        unregister = self.client.delete("/api/notifications/push-devices/unregister/", {"token": token}, format="json")
        self.assertTrue(unregister.data["unregistered"])
        device.refresh_from_db()
        self.assertFalse(device.is_active)

    def test_logout_all_deactivates_all_user_devices(self):
        PushDevice.objects.create(user=self.first_user, token="first-browser")
        PushDevice.objects.create(user=self.first_user, token="second-browser")
        PushDevice.objects.create(user=self.second_user, token="other-users-browser")
        self.client.force_authenticate(self.first_user)

        response = self.client.post("/api/account/logout-all/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(PushDevice.objects.filter(user=self.first_user, is_active=True).exists())
        self.assertTrue(PushDevice.objects.filter(user=self.second_user, is_active=True).exists())

    def test_prune_stale_devices_deactivates_only_old_tokens(self):
        stale = PushDevice.objects.create(user=self.first_user, token="stale-token")
        fresh = PushDevice.objects.create(user=self.first_user, token="fresh-token")
        PushDevice.objects.filter(pk=stale.pk).update(last_seen_at=timezone.now() - datetime.timedelta(days=31))

        call_command("prune_stale_push_devices")

        stale.refresh_from_db()
        fresh.refresh_from_db()
        self.assertFalse(stale.is_active)
        self.assertTrue(fresh.is_active)


class FakeMessaging:
    class Notification:
        def __init__(self, **kwargs):
            self.kwargs = kwargs

    class WebpushNotification:
        def __init__(self, **kwargs):
            self.kwargs = kwargs

    class WebpushFCMOptions:
        def __init__(self, **kwargs):
            self.kwargs = kwargs

    class WebpushConfig:
        def __init__(self, **kwargs):
            self.kwargs = kwargs

    class MulticastMessage:
        def __init__(self, **kwargs):
            self.tokens = kwargs["tokens"]
            self.data = kwargs["data"]
            self.webpush = kwargs["webpush"]

    def __init__(self):
        self.messages = []

    def send_each_for_multicast(self, message):
        self.messages.append(message)
        responses = [
            SimpleNamespace(
                success=token != "expired-token",
                exception=Exception("registration-token-not-registered") if token == "expired-token" else None,
            )
            for token in message.tokens
        ]
        return SimpleNamespace(responses=responses)


class PushDeliveryTests(APITestCase):
    @override_settings(FRONTEND_URL="https://app.zewadi.test")
    def test_push_delivery_batches_tokens_and_deactivates_expired_tokens(self):
        user = User.objects.create_user(
            email="batch-user@example.com",
            password="Pass@1234",
            full_name="Batch User",
            user_name="batchuser",
            phone="+10000000013",
            role="COMMUNITY_USER",
        )
        devices = [PushDevice(user=user, token=f"token-{index}") for index in range(500)]
        devices.append(PushDevice(user=user, token="expired-token"))
        PushDevice.objects.bulk_create(devices)
        notification = Notification.objects.create(
            title="Batch alert",
            body="Batch body",
            target_role="community_user",
            status="SENT",
            delivery_channels=[Notification.CHANNEL_PUSH],
            action_url="/communityDashBoard/myorders",
            sent_at=timezone.now(),
        )
        messaging = FakeMessaging()

        with patch("notifications.fcm._messaging", return_value=messaging):
            send_pushes_for_notification(notification)

        self.assertEqual([len(message.tokens) for message in messaging.messages], [500, 1])
        self.assertEqual(messaging.messages[0].data["action_url"], "https://app.zewadi.test/communityDashBoard/myorders")
        self.assertFalse(PushDevice.objects.get(token="expired-token").is_active)

    @override_settings(FRONTEND_URL="http://localhost:3000")
    def test_push_delivery_omits_https_only_click_option_during_local_development(self):
        user = User.objects.create_user(
            email="local-push@example.com",
            password="Pass@1234",
            full_name="Local Push",
            user_name="localpush",
            phone="+10000000014",
            role="COMMUNITY_USER",
        )
        PushDevice.objects.create(user=user, token="local-token")
        notification = Notification.objects.create(
            title="Local alert",
            body="Local body",
            target_role="community_user",
            status="SENT",
            delivery_channels=[Notification.CHANNEL_PUSH],
            action_url="/communityDashBoard/notifications",
            sent_at=timezone.now(),
        )
        messaging = FakeMessaging()

        with patch("notifications.fcm._messaging", return_value=messaging):
            send_pushes_for_notification(notification)

        self.assertEqual(len(messaging.messages), 1)
        self.assertEqual(
            messaging.messages[0].data["action_url"],
            "http://localhost:3000/communityDashBoard/notifications",
        )
        self.assertNotIn("fcm_options", messaging.messages[0].webpush.kwargs)
