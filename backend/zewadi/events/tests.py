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
            start_datetime=timezone.now() + timedelta(days=3),
            end_datetime=timezone.now() + timedelta(days=3, hours=1),
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
