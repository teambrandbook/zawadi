from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Notification, UserNotificationReceipt


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
