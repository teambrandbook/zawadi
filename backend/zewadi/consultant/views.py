from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from .models import BlockedDate, ConsultationBooking, Consultant, ConsultantSettings
from .serializers import *
from django.db import transaction
from .models import Availability
from .util import generate_weekly_slots,convert_time,find_available_consultant,is_slot_available
from datetime import datetime





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


class ConsultantListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        consultants = Consultant.objects.select_related("user").all()
        serializer = ConsultantListSerializer(consultants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsultantDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            consultant = Consultant.objects.select_related("user").get(pk=pk)
        except Consultant.DoesNotExist:
            return Response({"detail": "Consultant not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ConsultantDetailSerializer(consultant)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsultationBookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConsultationBookingCreateSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            booking = serializer.save()
            return Response(
                ConsultationBookingListSerializer(booking).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConsultationBookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = ConsultationBooking.objects.filter(user=request.user).select_related(
            "consultant__user"
        ).order_by("-created_at")
        serializer = ConsultationBookingListSerializer(bookings, many=True)
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
            "consultation_fee": consultant.consiltation_fee
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

        if not is_slot_available(consultant, date, time):
            return Response(
                {"error": "This time slot is already booked"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking = serializer.save()

        return Response({
            "message": "Booking created successfully",
            "booking_id": booking.id
        })