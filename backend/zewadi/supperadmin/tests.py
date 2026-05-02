from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class AdminStatsAPITests(APITestCase):
    def test_stats_requires_authentication_without_server_error(self):
        response = self.client.get(reverse("admin-stats"))
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_stats_returns_200_for_admin_user(self):
        admin = User.objects.create_user(
            email="admin@example.com",
            password="Pass@1234",
            user_name="admin",
            full_name="Admin User",
            phone="+10000000000",
            role="ADMIN",
        )
        self.client.force_authenticate(user=admin)

        response = self.client.get(reverse("admin-stats"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "total_users": 1,
                "total_orders": 0,
                "total_products": 0,
                "total_events": 0,
                "total_consultations": 0,
                "total_revenue": 0.0,
            },
        )
