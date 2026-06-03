from datetime import time, timedelta
from unittest.mock import patch

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import OTP, User
from consultant.models import ConsultationBooking, Consultant, WeeklySlot


class ConsultationBookingOTPTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="community-otp@example.com",
            password="Pass@1234",
            user_name="communityotp",
            full_name="Community OTP",
            phone="+10000000010",
            role="COMMUNITY_USER",
            is_active=True,
        )
        self.other_user = User.objects.create_user(
            email="other-community-otp@example.com",
            password="Pass@1234",
            user_name="othercommunityotp",
            full_name="Other Community OTP",
            phone="+10000000011",
            role="COMMUNITY_USER",
            is_active=True,
        )
        consultant_user = User.objects.create_user(
            email="consultant-otp@example.com",
            password="Pass@1234",
            user_name="consultantotp",
            full_name="Consultant OTP",
            phone="+10000000012",
            role="CONSULTANT",
            is_active=True,
        )
        self.consultant = Consultant.objects.create(
            user=consultant_user,
            years_of_experience=5,
            qualification="Nutritionist",
            languages_spoken="English",
            experience_areas="Wellness",
            session_type="video",
            consultation_fee=75,
            session_duration=30,
        )
        self.booking_date = timezone.now().date() + timedelta(days=7)
        self.weekday = self.booking_date.strftime("%A").lower()
        WeeklySlot.objects.create(
            consultant=self.consultant,
            day=self.weekday,
            start_time=time(9, 0),
            end_time=time(9, 30),
        )
        WeeklySlot.objects.create(
            consultant=self.consultant,
            day=self.weekday,
            start_time=time(10, 0),
            end_time=time(10, 30),
        )
        self.create_payload = {
            "consultant_id": self.consultant.id,
            "time": "09:00 AM",
            "booked_date": self.booking_date.isoformat(),
            "session_type": "video",
            "primary_goal": "lose fat",
            "primary_wellness_goal": "fitness",
            "focuses_area": "belly",
            "diet_preferences": "vegetarian",
            "lifestyle_activity_level": "moderate",
            "buckwheat_journey_goal": "lose 5kg",
            "message": "Need help",
            "language": "english",
            "is_agreed": True,
        }

    def _request_otp(self, user=None, payload=None, action="create"):
        self.client.force_authenticate(user=user or self.user)
        return self.client.post(
            "/api/consultant/community/booking-otp/request/",
            {"action": action, "booking": payload or self.create_payload},
            format="json",
        )

    def _confirm_otp(self, code, user=None, payload=None, action="create"):
        self.client.force_authenticate(user=user or self.user)
        return self.client.post(
            "/api/consultant/community/booking-otp/confirm/",
            {"action": action, "booking": payload or self.create_payload, "code": code},
            format="json",
        )

    @patch("consultant.views.send_otp_email")
    def test_otp_request_sends_email_for_new_booking_without_creating_booking(self, send_otp_email):
        response = self._request_otp()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ConsultationBooking.objects.count(), 0)
        otp = OTP.objects.get(user=self.user, purpose=OTP.PURPOSE_CONSULTATION_BOOKING)
        send_otp_email.assert_called_once_with(
            self.user.email,
            otp.code,
            OTP.PURPOSE_CONSULTATION_BOOKING,
        )

    @patch("consultant.views.send_otp_email")
    def test_otp_confirm_creates_booking_after_valid_code(self, send_otp_email):
        self._request_otp()
        otp = OTP.objects.get(user=self.user, purpose=OTP.PURPOSE_CONSULTATION_BOOKING)

        response = self._confirm_otp(otp.code)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = ConsultationBooking.objects.get()
        self.assertEqual(booking.user, self.user)
        self.assertEqual(booking.status, ConsultationBooking.BookingStatus.PENDING)

    @patch("consultant.views.send_otp_email")
    def test_invalid_otp_does_not_create_booking(self, send_otp_email):
        self._request_otp()

        response = self._confirm_otp("000000")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ConsultationBooking.objects.count(), 0)

    @patch("consultant.views.send_otp_email")
    def test_slot_availability_is_rechecked_on_confirm(self, send_otp_email):
        self._request_otp()
        otp = OTP.objects.get(user=self.user, purpose=OTP.PURPOSE_CONSULTATION_BOOKING)
        ConsultationBooking.objects.create(
            user=self.other_user,
            consultant=self.consultant,
            booked_date=self.booking_date,
            booked_slot="09:00 AM",
            status=ConsultationBooking.BookingStatus.PENDING,
            is_agreed=True,
        )

        response = self._confirm_otp(otp.code)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ConsultationBooking.objects.filter(user=self.user).count(), 0)

    @patch("consultant.views.send_otp_email")
    def test_reschedule_requires_valid_otp_before_updating_booking(self, send_otp_email):
        booking = ConsultationBooking.objects.create(
            user=self.user,
            consultant=self.consultant,
            booked_date=self.booking_date,
            booked_slot="10:00 AM",
            status=ConsultationBooking.BookingStatus.CONFIRMED,
            is_agreed=True,
        )
        payload = {
            "booking_id": booking.id,
            "consultant_id": self.consultant.id,
            "booked_date": self.booking_date.isoformat(),
            "booked_slot": "09:00 AM",
        }
        self._request_otp(payload=payload, action="reschedule")
        otp = OTP.objects.get(user=self.user, purpose=OTP.PURPOSE_CONSULTATION_BOOKING)

        response = self._confirm_otp(otp.code, payload=payload, action="reschedule")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.booked_slot, "09:00 AM")
        self.assertEqual(booking.status, ConsultationBooking.BookingStatus.PENDING)

    @patch("consultant.views.send_otp_email")
    def test_user_cannot_request_reschedule_otp_for_another_users_booking(self, send_otp_email):
        booking = ConsultationBooking.objects.create(
            user=self.other_user,
            consultant=self.consultant,
            booked_date=self.booking_date,
            booked_slot="10:00 AM",
            status=ConsultationBooking.BookingStatus.CONFIRMED,
            is_agreed=True,
        )
        payload = {
            "booking_id": booking.id,
            "consultant_id": self.consultant.id,
            "booked_date": self.booking_date.isoformat(),
            "booked_slot": "09:00 AM",
        }

        response = self._request_otp(payload=payload, action="reschedule")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        send_otp_email.assert_not_called()
