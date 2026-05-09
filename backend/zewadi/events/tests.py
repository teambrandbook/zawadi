from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from events.models import Event, EventRegistration


class MyEventRegistrationsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="events-member@example.com",
            password="Pass@1234",
            user_name="eventsmember",
            full_name="Events Member",
            phone="+10000000021",
            role="COMMUNITY_USER",
        )
        self.client.force_authenticate(user=self.user)

    def test_my_registrations_returns_event_detail_payload(self):
        event = Event.objects.create(
            title="Community Wellness Session",
            short_description="Session short description",
            full_description="Session full description",
            event_type=Event.EventType.WORKSHOP,
            status=Event.EventStatus.PUBLISHED,
            event_date=(timezone.now() + timedelta(days=3)).date(),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=1)).time(),
            is_online=True,
            location="",
            show_in_community=True,
        )
        registration = EventRegistration.objects.create(
            event=event,
            user=self.user,
            status=EventRegistration.RegistrationStatus.CONFIRMED,
        )

        response = self.client.get("/api/events/my-registrations/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        payload = response.data[0]
        self.assertEqual(payload["id"], registration.id)
        self.assertEqual(payload["event"], event.id)
        self.assertIn("event_detail", payload)
        self.assertEqual(payload["event_detail"]["id"], event.id)
        self.assertEqual(payload["event_detail"]["title"], event.title)
        self.assertEqual(payload["event_detail"]["slug"], event.slug)
        self.assertEqual(payload["event_detail"]["event_type"], event.event_type)
        self.assertEqual(payload["event_detail"]["is_online"], event.is_online)
        self.assertEqual(payload["event_detail"]["status"], event.status)
        self.assertIsNone(payload["event_detail"]["cover_image"])

    def test_my_registrations_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/events/my-registrations/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EventManagementAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="events-admin@example.com",
            password="Pass@1234",
            user_name="eventsadmin",
            full_name="Events Admin",
            phone="+10000000022",
            role="ADMIN",
        )
        self.member = User.objects.create_user(
            email="events-create-member@example.com",
            password="Pass@1234",
            user_name="eventcreateuser",
            full_name="Events User",
            phone="+10000000023",
            role="COMMUNITY_USER",
        )

    def test_admin_can_create_published_event(self):
        self.client.force_authenticate(self.admin)
        start = timezone.now() + timedelta(days=5)
        end = start + timedelta(hours=1)

        response = self.client.post(
            "/api/events/",
            {
                "title": "Buckwheat Workshop",
                "short_description": "Learn buckwheat basics.",
                "full_description": "A practical workshop for the community.",
                "event_type": "workshop",
                "status": "published",
                "host_speaker_name": "Dr. Zara Mehak",
                "event_date": start.date().isoformat(),
                "start_time": start.time().isoformat(),
                "end_time": end.time().isoformat(),
                "is_online": True,
                "meeting_link": "https://example.com/session",
                "show_in_community": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "published")
        self.assertEqual(response.data["host_speaker_name"], "Dr. Zara Mehak")
        self.assertTrue(response.data["slug"])

    def test_community_user_cannot_create_event(self):
        self.client.force_authenticate(self.member)
        start = timezone.now() + timedelta(days=5)
        end = start + timedelta(hours=1)

        response = self.client.post(
            "/api/events/",
            {
                "title": "Blocked Event",
                "short_description": "Should not create.",
                "event_date": start.date().isoformat(),
                "start_time": start.time().isoformat(),
                "end_time": end.time().isoformat(),
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
