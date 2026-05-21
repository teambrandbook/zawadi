from django.db import OperationalError, ProgrammingError
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from accounts.permissions import IsMemberUser
from .models import CommunityUser, CommunityUserAddress, UserType
from .serializers import CommunityProfileSerializer, DeliveryAddressSerializer
from blog.models import Blog, BlogStatus
from consultant.models import ConsultationBooking
from events.models import EventRegistration
from notifications.models import UserNotificationReceipt
from orders.models import Order
from recipes.models import Recipe


class CommunityPublicStatsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from consultant.models import Consultant
        from events.models import Event
        from product.models import Product, ProductStatus

        def safe_query(query_fn, default=0):
            try:
                return query_fn()
            except (ProgrammingError, OperationalError):
                return default

        return Response(
            {
                "community_members": safe_query(
                    lambda: CommunityUser.objects.filter(user_type=UserType.MEMBER).count()
                ),
                "events_hosted": safe_query(
                    lambda: Event.objects.filter(
                        show_in_community=True,
                        status__in=[
                            Event.EventStatus.PUBLISHED,
                            Event.EventStatus.COMPLETED,
                        ],
                    ).count()
                ),
                "consultants": safe_query(
                    lambda: Consultant.objects.filter(
                        available=True,
                        user__is_active=True,
                    ).count()
                ),
                "healthy_products": safe_query(
                    lambda: Product.objects.filter(product_status=ProductStatus.ACTIVE).count()
                ),
            },
            status=status.HTTP_200_OK,
        )


class IsCommunityUser(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user
            and user.is_authenticated
            and str(getattr(user, "role", "")).upper() == "COMMUNITY_USER"
        )


class CommunityProfileAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCommunityUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def _get_or_create_profile(self, user):
        profile, _ = CommunityUser.objects.get_or_create(
            user=user,
            defaults={"user_type": UserType.GUEST},
        )
        return profile

    def get(self, request):
        profile = self._get_or_create_profile(request.user)
        serializer = CommunityProfileSerializer(profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        profile = self._get_or_create_profile(request.user)
        serializer = CommunityProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommunityDashboardSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCommunityUser, IsMemberUser]

    def get(self, request):
        user = request.user
        now = timezone.now()

        def safe_query(query_fn, default):
            try:
                return query_fn()
            except (ProgrammingError, OperationalError):
                return default

        recent_orders = safe_query(
            lambda: list(
                Order.objects.filter(user=user)
                .order_by("-created_at")[:5]
                .values(
                    "order_id",
                    "product_name",
                    "status",
                    "total_amount",
                    "created_at",
                )
            ),
            [],
        )
        upcoming_event_registrations = safe_query(
            lambda: list(
                EventRegistration.objects.filter(user=user)
                .exclude(status=EventRegistration.RegistrationStatus.CANCELLED)
                .select_related("event")
                .order_by("event__event_date", "event__start_time")[:5]
            ),
            [],
        )
        recent_consultations = safe_query(
            lambda: list(
                ConsultationBooking.objects.filter(user=user)
                .select_related("consultant__user")
                .order_by("-created_at")[:5]
            ),
            [],
        )
        recent_recipes = safe_query(
            lambda: list(
                Recipe.objects.filter(author=user)
                .order_by("-created_at")[:5]
                .values("id", "title", "status", "created_at")
            ),
            [],
        )
        recent_blogs = safe_query(
            lambda: list(
                Blog.objects.filter(author=user)
                .order_by("-created_at")[:5]
                .values("id", "title", "status", "created_at")
            ),
            [],
        )

        summary = {
            "user": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
            },
            "stats": {
                "total_orders": safe_query(lambda: Order.objects.filter(user=user).count(), 0),
                "upcoming_events": safe_query(
                    lambda: EventRegistration.objects.filter(user=user)
                    .exclude(status=EventRegistration.RegistrationStatus.CANCELLED)
                    .filter(event__event_date__gte=now.date())
                    .count(),
                    0,
                ),
                "consultations": safe_query(
                    lambda: ConsultationBooking.objects.filter(user=user).count(), 0
                ),
                "submitted_recipes": safe_query(
                    lambda: Recipe.objects.filter(author=user).count(), 0
                ),
                "published_blogs": safe_query(
                    lambda: Blog.objects.filter(
                        author=user, status=BlogStatus.PUBLISHED
                    ).count(),
                    0,
                ),
                "unread_notifications": safe_query(
                    lambda: UserNotificationReceipt.objects.filter(
                        user=user,
                        is_read=False,
                        notification__status="SENT",
                        notification__target_role__in=["ALL", "community_user"],
                    ).count(),
                    0,
                ),
            },
            "recent_orders": [
                {
                    "order_id": item["order_id"],
                    "product_name": item["product_name"],
                    "status": item["status"],
                    "total_amount": float(item["total_amount"]),
                    "created_at": item["created_at"],
                }
                for item in recent_orders
            ],
            "upcoming_events": [
                {
                    "registration_id": item.id,
                    "event_id": item.event.id,
                    "title": item.event.title,
                    "event_date": item.event.event_date,
                    "start_time": item.event.start_time,
                    "end_time": item.event.end_time,
                    "status": item.status,
                }
                for item in upcoming_event_registrations
                if item.event.event_date and item.event.event_date >= now.date()
            ],
            "recent_consultations": [
                {
                    "booking_id": item.id,
                    "consultant_name": item.consultant.user.full_name,
                    "session_type": item.session_type,
                    "booked_date": item.booked_date,
                    "booked_slot": item.booked_slot,
                    "status": item.status,
                }
                for item in recent_consultations
            ],
            "recent_recipes": [
                {
                    "id": item["id"],
                    "title": item["title"],
                    "status": item["status"],
                    "created_at": item["created_at"],
                }
                for item in recent_recipes
            ],
            "recent_blogs": [
                {
                    "id": item["id"],
                    "title": item["title"],
                    "status": item["status"],
                    "created_at": item["created_at"],
                }
                for item in recent_blogs
            ],
        }

        return Response(summary, status=status.HTTP_200_OK)


class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            community_user = request.user.communityuser
        except CommunityUser.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
        addresses = community_user.addresses.all().order_by("-is_default", "-id")
        return Response(
            DeliveryAddressSerializer(addresses, many=True).data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        try:
            community_user = request.user.communityuser
        except CommunityUser.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = DeliveryAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=community_user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            community_user = request.user.communityuser
            address = community_user.addresses.get(pk=pk)
        except (CommunityUser.DoesNotExist, CommunityUserAddress.DoesNotExist):
            return Response(
                {"error": "Address not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
