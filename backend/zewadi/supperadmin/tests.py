from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from supperadmin.models import RolePermission
from supperadmin.serializer import RoleSerializer


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


class RoleSerializerTests(APITestCase):
    def test_full_access_permission_enables_the_full_row_on_create(self):
        serializer = RoleSerializer(
            data={
                "role_name": "Operations Manager",
                "role_status": "active",
                "access_level": "medium",
                "permissions": [
                    {
                        "module": "orders",
                        "full_access": True,
                    }
                ],
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        role = serializer.save()
        permission = RolePermission.objects.get(role=role, module="orders")

        self.assertTrue(permission.full_access)
        self.assertTrue(permission.can_view)
        self.assertTrue(permission.can_create)
        self.assertTrue(permission.can_edit)
        self.assertTrue(permission.can_delete)
        self.assertTrue(permission.can_approve)
        self.assertTrue(permission.can_export)

    def test_role_serializer_returns_member_count_without_members_relation(self):
        role = RoleSerializer(
            data={
                "role_name": "Support Manager",
                "role_status": "active",
                "access_level": "low",
            }
        )
        self.assertTrue(role.is_valid(), role.errors)
        saved_role = role.save()

        data = RoleSerializer(saved_role).data

        self.assertEqual(data["member_count"], 0)
