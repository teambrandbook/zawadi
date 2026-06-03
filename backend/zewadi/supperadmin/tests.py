from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from blog.models import Blog
from events.models import Event, EventRegistration
from recipes.models import Recipe
from supperadmin.models import Role, RolePermission, SiteSettings
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
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["total_users"], 1)
        self.assertEqual(data["total_orders"], 0)
        self.assertEqual(data["total_products"], 0)
        self.assertEqual(data["total_events"], 0)
        self.assertEqual(data["total_consultations"], 0)
        self.assertEqual(data["total_revenue"], 0.0)
        self.assertIn("total_shipping", data)
        self.assertIn("total_tax", data)

    def test_stats_returns_200_for_internal_staff_with_dashboard_view_permission(self):
        role = Role.objects.create(role_name="Dashboard Viewer")
        RolePermission.objects.create(role=role, module="dashboard", can_view=True)
        staff = User.objects.create_user(
            email="dashboard-staff@example.com",
            password="Pass@1234",
            user_name="dashboard-staff",
            full_name="Dashboard Staff",
            phone="+10000000003",
            role="INTERNAL_STAFF",
            role_obj=role,
        )
        self.client.force_authenticate(user=staff)

        response = self.client.get(reverse("admin-stats"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_users"], 1)


class SiteConfigAPITests(APITestCase):
    def test_admin_can_get_and_patch_site_config(self):
        admin = User.objects.create_user(
            email="config-admin@example.com",
            password="Pass@1234",
            user_name="configadmin",
            full_name="Config Admin",
            phone="+10000000001",
            role="ADMIN",
        )
        self.client.force_authenticate(user=admin)

        get_response = self.client.get(reverse("site-config"))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)

        patch_response = self.client.patch(
            reverse("site-config"),
            {"platform_name": "Zewadi Admin"},
            format="json",
        )

        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(SiteSettings.get().platform_name, "Zewadi Admin")

    def test_internal_staff_cannot_get_or_patch_site_config(self):
        staff = User.objects.create_user(
            email="config-staff@example.com",
            password="Pass@1234",
            user_name="configstaff",
            full_name="Config Staff",
            phone="+10000000002",
            role="INTERNAL_STAFF",
        )
        self.client.force_authenticate(user=staff)

        get_response = self.client.get(reverse("site-config"))
        patch_response = self.client.patch(
            reverse("site-config"),
            {"platform_name": "Blocked"},
            format="json",
        )

        self.assertEqual(get_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(patch_response.status_code, status.HTTP_403_FORBIDDEN)


class AdminReportsAPITests(APITestCase):
    def test_events_and_content_analytics_include_records_created_before_selected_period(self):
        admin = User.objects.create_user(
            email="reports-admin@example.com",
            password="Pass@1234",
            user_name="reports-admin",
            full_name="Reports Admin",
            phone="+10000000004",
            role="ADMIN",
        )
        event = Event.objects.create(title="Older Event", short_description="Older event")
        EventRegistration.objects.create(event=event, user=admin)
        recipe = Recipe.objects.create(
            author=admin,
            title="Older Recipe",
            short_description="Older recipe",
            prep_time_minutes=5,
            cooking_time_minutes=10,
            servings=2,
            status="published",
        )
        blog = Blog.objects.create(
            author=admin,
            title="Older Blog",
            short_excerpt="Older blog",
            content="Older blog content",
            status="published",
        )
        older_date = timezone.now() - timedelta(days=45)
        Event.objects.filter(pk=event.pk).update(created_at=older_date)
        EventRegistration.objects.filter(event=event).update(registered_at=older_date)
        Recipe.objects.filter(pk=recipe.pk).update(created_at=older_date)
        Blog.objects.filter(pk=blog.pk).update(created_at=older_date)
        self.client.force_authenticate(user=admin)

        response = self.client.get(reverse("admin-reports"), {"period": "today"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["analytics"]["events"], {"total": 1, "registrations": 1, "avg_per_event": 1.0})
        self.assertEqual(
            response.data["analytics"]["content"],
            {"recipes": 1, "blogs": 1, "approval_rate": 100.0, "recipes_published_pct": 100.0},
        )


class InternalStaffPermissionsAPITests(APITestCase):
    def test_internal_staff_can_get_their_permissions(self):
        role = Role.objects.create(
            role_name="Content Manager",
            access_level="medium",
        )
        RolePermission.objects.create(
            role=role,
            module="blogs",
            can_view=True,
            can_approve=True,
        )
        staff = User.objects.create_user(
            email="staff@example.com",
            password="Pass@1234",
            user_name="staff",
            full_name="Internal Staff",
            phone="+10000000001",
            role="INTERNAL_STAFF",
            role_obj=role,
        )
        self.client.force_authenticate(user=staff)

        response = self.client.get(reverse("internal-staff-permissions"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], "INTERNAL_STAFF")
        self.assertEqual(response.data["role_obj"]["role_name"], "Content Manager")
        self.assertEqual(response.data["permissions"][0]["module"], "blogs")
        self.assertTrue(response.data["permissions"][0]["can_view"])
        self.assertTrue(response.data["permissions"][0]["can_approve"])

    def test_admin_cannot_get_internal_staff_permissions(self):
        admin = User.objects.create_user(
            email="admin-permissions@example.com",
            password="Pass@1234",
            user_name="admin",
            full_name="Admin User",
            phone="+10000000002",
            role="ADMIN",
        )
        self.client.force_authenticate(user=admin)

        response = self.client.get(reverse("internal-staff-permissions"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


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
