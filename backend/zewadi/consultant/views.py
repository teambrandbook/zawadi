from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from .models import Consultant, ConsultationBooking
from .serializers import (
    ConsultantListSerializer,
    ConsultantDetailSerializer,
    ConsultationBookingCreateSerializer,
    ConsultationBookingListSerializer,
)


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


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
