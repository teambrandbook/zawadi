from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from accounts.models import User
from blog.models import Blog
from communityuser.models import CommunityUser, CommunityUserAddress, UserType
from consultant.models import ConsultationBooking, Consultant
from events.models import Event, EventRegistration
from orders.models import Order
from recipes.models import Recipe


class CommunityProfileAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="member@example.com",
            password="Pass@1234",
            user_name="member",
            full_name="Member User",
            phone="+10000000003",
            role="COMMUNITY_USER",
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profile_auto_creates_community_profile(self):
        response = self.client.get("/api/community/profile/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "member@example.com")
        self.assertEqual(response.data["user_type"], "guest")
        self.assertEqual(CommunityUser.objects.filter(user=self.user).count(), 1)

    def test_patch_profile_updates_user(self):
        CommunityUser.objects.create(user=self.user, user_type="guest")
        payload = {
            "full_name": "Updated Member",
            "phone": "+10000000099",
            "user_type": "member",
        }

        response = self.client.patch("/api/community/profile/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        profile = CommunityUser.objects.get(user=self.user)

        self.assertEqual(self.user.full_name, "Updated Member")
        self.assertEqual(self.user.phone, "+10000000099")
        self.assertEqual(profile.user_type, "member")

    def test_non_community_user_cannot_access_profile(self):
        admin_user = User.objects.create_user(
            email="admin-profile@example.com",
            password="Pass@1234",
            user_name="adminprofile",
            full_name="Admin Profile",
            phone="+10000000004",
            role="ADMIN",
        )
        self.client.force_authenticate(user=admin_user)

        response = self.client.get("/api/community/profile/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CommunityDashboardSummaryAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="dash-user@example.com",
            password="Pass@1234",
            user_name="dashuser",
            full_name="Dashboard User",
            phone="+10000000005",
            role="COMMUNITY_USER",
        )
        self.client.force_authenticate(user=self.user)

    def test_summary_requires_community_user(self):
        staff = User.objects.create_user(
            email="staff@example.com",
            password="Pass@1234",
            user_name="staff",
            full_name="Staff User",
            phone="+10000000006",
            role="ADMIN",
        )
        self.client.force_authenticate(user=staff)

        response = self.client.get("/api/community/dashboard/summary/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_summary_returns_stats_and_latest_items(self):
        Order.objects.create(
            user=self.user,
            product_name="Buckwheat Flour",
            pack_name="1kg",
            pack_price="10.00",
            quantity=1,
            subtotal="10.00",
            delivery_charge="2.00",
            total_amount="12.00",
            full_name="Dashboard User",
            phone="+10000000005",
            email="dash-user@example.com",
            city="Test City",
            postal_code="12345",
            address="123 Test Street",
            payment_method="cod",
            payment_status="paid",
            status="pending",
        )

        consultant_user = User.objects.create_user(
            email="consultant@example.com",
            password="Pass@1234",
            user_name="consultant",
            full_name="Consultant User",
            phone="+10000000007",
            role="CONSULTANT",
        )
        consultant = Consultant.objects.create(
            user=consultant_user,
            years_of_experience=5,
            qualification="RD",
            certifications="Cert",
            short_bio="Bio",
            languages_spoken="English",
            experience_areas="General",
            session_type="Video",
            consultation_fee=200,
            session_duration=30,
        )
        ConsultationBooking.objects.create(
            user=self.user,
            consultant=consultant,
            session_type=ConsultationBooking.CommunicationType.VIDEO,
            booked_date=timezone.now().date(),
            booked_slot="10:00 AM",
            status=ConsultationBooking.BookingStatus.PENDING,
        )

        event = Event.objects.create(
            title="Community Event",
            short_description="Upcoming event",
            full_description="Details",
            event_type=Event.EventType.COMMUNITY,
            status=Event.EventStatus.PUBLISHED,
            start_datetime=timezone.now() + timedelta(days=2),
            end_datetime=timezone.now() + timedelta(days=2, hours=1),
            is_online=True,
            location="",
            show_in_community=True,
        )
        EventRegistration.objects.create(
            event=event,
            user=self.user,
            status=EventRegistration.RegistrationStatus.CONFIRMED,
        )

        Recipe.objects.create(
            author=self.user,
            title="My Recipe",
            short_description="Desc",
            prep_time_minutes=10,
            cooking_time_minutes=15,
            servings=2,
            status="draft",
        )
        Blog.objects.create(
            title="My Blog",
            short_excerpt="Excerpt",
            author=self.user,
            content="Content",
            status="published",
        )

        response = self.client.get("/api/community/dashboard/summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["stats"]["total_orders"], 1)
        self.assertEqual(response.data["stats"]["upcoming_events"], 1)
        self.assertEqual(response.data["stats"]["consultations"], 1)
        self.assertEqual(response.data["stats"]["submitted_recipes"], 1)
        self.assertEqual(response.data["stats"]["published_blogs"], 1)
        self.assertEqual(len(response.data["recent_orders"]), 1)


class AddressAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="addr@test.com",
            password="pass1234",
            full_name="Addr User",
            user_name="addruser",
            phone="1234567890",
            role="COMMUNITY_USER",
        )
        self.community_user = CommunityUser.objects.create(
            user=self.user, user_type=UserType.GUEST
        )
        self.client.force_authenticate(user=self.user)

    def test_list_addresses_empty(self):
        response = self.client.get("/api/community/addresses/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_create_address(self):
        payload = {
            "label": "Home",
            "full_name": "Addr User",
            "phone": "9876543210",
            "address_line": "123 Main St",
            "city": "Mumbai",
            "postal_code": "400001",
        }
        response = self.client.post("/api/community/addresses/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CommunityUserAddress.objects.count(), 1)

    def test_delete_address(self):
        addr = CommunityUserAddress.objects.create(
            user=self.community_user,
            address_line="123 Test",
            city="Mumbai",
            postal_code="400001",
        )
        response = self.client.delete(f"/api/community/addresses/{addr.pk}/")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(CommunityUserAddress.objects.count(), 0)
