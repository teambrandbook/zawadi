from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from .models import BlockedDate, ConsultationBooking, Consultant, ConsultantSettings
from .serializers import *
from django.db import transaction
from .models import Availability
from accounts.models import User
from .util import generate_weekly_slots,convert_time,find_available_consultant,is_slot_available,create_or_update_client_from_booking
from datetime import datetime
from django.utils import timezone
from supperadmin.utils.permissions import has_permission





class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsConsultantUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "CONSULTANT"
            and hasattr(request.user, "consultant")
        )

class IsCommunityUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "COMMUNITY_USER"
        )


# admins side list

class ConsultantListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Check permission
        if not has_permission(request.user, "nutritionists", "view"):
            return Response(
                {"message": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        consultants = Consultant.objects.select_related("user").all()

        serializer = ConsultantListSerializer(
            consultants,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    




    


class ConsultantDetailView(APIView):

    permission_classes = [IsAuthenticated]

    # --------------------------------
    # GET CONSULTANT
    # --------------------------------
    def get(self, request, pk):

        if not has_permission(request.user, "nutritionists", "view"):
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            consultant = Consultant.objects.select_related("user").get(pk=pk)

        except Consultant.DoesNotExist:
            return Response(
                {"detail": "Consultant not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ConsultantListSerializer(consultant)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # --------------------------------
    # EDIT CONSULTANT
    # --------------------------------
    def patch(self, request, pk):

        if not has_permission(request.user, "nutritionists", "edit"):
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            consultant = Consultant.objects.select_related("user").get(pk=pk)

        except Consultant.DoesNotExist:
            return Response(
                {"detail": "Consultant not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        user = consultant.user
        data = request.data

        if "email" in data and data.get("email") != user.email:
            if User.objects.filter(email=data.get("email")).exclude(pk=user.pk).exists():
                return Response(
                    {"email": ["A user with this email already exists."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

        user_fields = [
            "full_name",
            "user_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "location",
        ]
        consultant_fields = [
            "years_of_experience",
            "qualification",
            "certifications",
            "short_bio",
            "languages_spoken",
            "experience_areas",
            "session_type",
            "consultation_fee",
            "session_duration",
        ]

        try:
            with transaction.atomic():
                for field in user_fields:
                    if field in data:
                        setattr(user, field, data.get(field))

                if "photo" in request.FILES:
                    user.photo = request.FILES["photo"]

                password = data.get("password")
                if password:
                    user.set_password(password)

                user.save()

                for field in consultant_fields:
                    if field in data:
                        setattr(consultant, field, data.get(field))

                consultant.save()

        except Exception as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ConsultantListSerializer(consultant)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # --------------------------------
    # DELETE CONSULTANT
    # --------------------------------
    def delete(self, request, pk):

        if not has_permission(request.user, "nutritionists", "delete"):
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            consultant = Consultant.objects.select_related("user").get(pk=pk)

        except Consultant.DoesNotExist:
            return Response(
                {"detail": "Consultant not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        consultant.delete()

        return Response(
            {"detail": "Consultant deleted successfully."},
            status=status.HTTP_200_OK
        )


class ConsultantProfileView(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def get(self, request):
        serializer = ConsultantProfileSerializer(request.user.consultant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = ConsultantProfileSerializer(
            request.user.consultant,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Profile updated successfully", "data": serializer.data},
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        return self.put(request)


class ConsultantClientListView(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def get(self, request):
        clients = User.objects.filter(role="COMMUNITY_USER").order_by("full_name", "email")
        serializer = ConsultantClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminConsultationListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        bookings = ConsultationBooking.objects.select_related(
            "consultant__user", "user"
        ).order_by("-created_at")
        status_filter = request.query_params.get("status")
        if status_filter:
            bookings = bookings.filter(status=status_filter)
        serializer = ConsultationBookingListSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminConsultationStatusUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            booking = ConsultationBooking.objects.get(pk=pk)
        except ConsultationBooking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        valid_statuses = [choice[0] for choice in ConsultationBooking.BookingStatus.choices]
        if not new_status:
            return Response({"detail": "status field is required."}, status=status.HTTP_400_BAD_REQUEST)
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Choose from: {', '.join(valid_statuses)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = new_status
        booking.save(update_fields=["status", "updated_at"])
        return Response(
            ConsultationBookingListSerializer(booking).data,
            status=status.HTTP_200_OK,
        )


class DietPlanCreateView(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def post(self, request):
        serializer = DietPlanCreateSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            diet_plan = serializer.save()
            return Response(
                DietPlanDetailSerializer(diet_plan).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class SaveAvailabilityView(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def get(self, request):
        availability = Availability.objects.filter(
            consultant=request.user.consultant
        ).order_by("day", "start_time")
        serializer = AvailabilitySerializer(availability, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):
        consultant = request.user.consultant

        serializer = AvailabilitySerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        Availability.objects.filter(consultant=consultant).delete()

        for item in serializer.validated_data:
            Availability.objects.create(
                consultant=consultant,
                day=item["day"],
                start_time=item["start_time"],
                end_time=item["end_time"]
            )

        generate_weekly_slots(consultant)

        return Response({
            "message": "Availability saved and slots generated successfully"
        })

class ConsultantSettingsView(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def get(self, request):
        consultant = request.user.consultant

        settings, _ = ConsultantSettings.objects.get_or_create(
            consultant=consultant
        )

        serializer = ConsultantSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        consultant = request.user.consultant

        settings, _ = ConsultantSettings.objects.get_or_create(
            consultant=consultant
        )

        serializer = ConsultantSettingsSerializer(
            settings,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Settings updated",
            "data": serializer.data
        })
    

class BlockedDateView(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def get(self, request):
        consultant = request.user.consultant

        blocked_dates = BlockedDate.objects.filter(consultant=consultant)
        serializer = BlockedDateSerializer(blocked_dates, many=True)

        return Response(serializer.data)

    def post(self, request):
        consultant = request.user.consultant

        serializer = BlockedDateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(consultant=consultant)

        return Response({
            "message": "Blocked date added",
            "data": serializer.data
        })

    def delete(self, request):
        block_id = request.data.get("id")

        try:
            block = BlockedDate.objects.get(id=block_id)
            block.delete()
            return Response({"message": "Deleted successfully"})
        except BlockedDate.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# For find consultent


class FindConsultantView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        date = datetime.strptime(request.data["date"], "%Y-%m-%d").date()
        time_str = request.data["time"]

        start_time = convert_time(time_str)

        consultant = find_available_consultant(date, start_time)

        if not consultant:
            return Response({"error": "No consultant available"}, status=400)

        return Response({
            "consultant_id": consultant.id,
            "consultant_name": consultant.user.user_name,
            "photo": consultant.user.photo.url if consultant.user.photo else None,
            "qualification": consultant.qualification,
            "consultation_fee": consultant.consultation_fee
        })

class CreateConsultationBookingView(APIView):
    permission_classes = [IsAuthenticated, IsCommunityUser]

    def post(self, request):
        serializer = ConsultationBookingCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        consultant = Consultant.objects.get(id=data["consultant_id"])
        date = data["booked_date"]
        time = data["time"]

        available, error = is_slot_available(consultant, date, time)
        if not available:
            return Response(
                {"error": error},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking = serializer.save()

        return Response({
            "message": "Booking created successfully",
            "booking_id": booking.id
        })
   
    def get(self, request):
        today = timezone.now().date()

        bookings = (
            ConsultationBooking.objects.filter(
                user=request.user,
                booked_date__gte=today,
                status__in=[
                    ConsultationBooking.BookingStatus.PENDING,
                    ConsultationBooking.BookingStatus.CONFIRMED,
                    ConsultationBooking.BookingStatus.CANCELLED,
                ],
            )
            .select_related("consultant__user")
            .order_by("booked_date", "booked_slot", "created_at")
        )

        serializer = ConsultationBookingListSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommunityBookingCancelView(APIView):
    permission_classes = [IsAuthenticated, IsCommunityUser]

    def patch(self, request, pk):
        try:
            booking = ConsultationBooking.objects.get(pk=pk)
        except ConsultationBooking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

        if booking.user != request.user:
            return Response({"detail": "You do not have permission to cancel this booking."}, status=status.HTTP_403_FORBIDDEN)

        cancellable_statuses = [
            ConsultationBooking.BookingStatus.PENDING,
            ConsultationBooking.BookingStatus.CONFIRMED,
        ]
        if booking.status not in cancellable_statuses:
            return Response(
                {"detail": f"Cannot cancel a booking with status '{booking.status}'. Only PENDING or CONFIRMED bookings can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = ConsultationBooking.BookingStatus.CANCELLED
        booking.save(update_fields=["status", "updated_at"])
        return Response(
            ConsultationBookingListSerializer(booking).data,
            status=status.HTTP_200_OK,
        )


class ConsultantBookingConformApi(APIView):
    permission_classes = [IsAuthenticated, IsConsultantUser]

    def get(self, request):
        bookings = ConsultationBooking.objects.filter(
            consultant=request.user.consultant,
            status__in=[
                ConsultationBooking.BookingStatus.PENDING,
                ConsultationBooking.BookingStatus.CONFIRMED
            ]
        )

        if not bookings.exists():
            return Response({
                "message": "No bookings available"
            })

        serializer = ConsultationBookingListSerializer(bookings, many=True)
        return Response(serializer.data)


    def post(self, request):
        serializer = ConsultantBookingConformSerializer(
            data=request.data,
            context={"request": request}
        )

        print("hello")
        serializer.is_valid(raise_exception=True)

        booking = serializer.validated_data["booking"]
        is_accept = serializer.validated_data["is_accept"]

        if is_accept:
            booking.status = ConsultationBooking.BookingStatus.CONFIRMED
            booking.save()

            create_or_update_client_from_booking(booking)

            return Response({
                "message": "Booking accepted and client created"
            })

        booking.status = ConsultationBooking.BookingStatus.CANCELLED
        booking.save()

        return Response({
            "message": "Booking rejected"
        })
