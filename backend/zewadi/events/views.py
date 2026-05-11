from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Event, EventRegistration
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    EventRegistrationSerializer,
)
from supperadmin.utils.permissions import has_permission


ADMIN_ROLES = {"ADMIN", "INTERNAL_STAFF"}


# def _is_admin(user):
#     """Return True if the user holds an admin or internal-staff role."""
#     role = getattr(user, "role", None)
#     if role is None:
#         return False
#     return str(role).upper() in ADMIN_ROLES


class EventListCreateAPIView(APIView):
    """
    GET  /api/events/        — Public. Returns published events visible in the community.
    POST /api/events/        — Admin / Internal Staff only. Creates a new event.
    """

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):

        if (
            request.user.is_authenticated
            and has_permission(request.user, "events", "view")
        ):
            events = Event.objects.all()

        else:
            events = Event.objects.filter(
                status=Event.EventStatus.PUBLISHED,
                show_in_community=True,
            )

        serializer = EventListSerializer(
            events,
            many=True,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        if not has_permission(request.user, "events", "create"):
            return Response(
                {"detail": "You do not have permission to create events."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EventCreateUpdateSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save(created_by=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class EventDetailAPIView(APIView):
    """
    GET    /api/events/<pk>/   — Public. Returns full event detail.
    PATCH  /api/events/<pk>/   — Users with update permission can update events.
    DELETE /api/events/<pk>/   — Users with delete permission can delete events.
    """

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def _get_event(self, pk):
        return get_object_or_404(Event, pk=pk)

    def get(self, request, pk):
        event = self._get_event(pk)

        serializer = EventDetailSerializer(
            event,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        if not has_permission(request.user, "events", "update"):
            return Response(
                {"detail": "You do not have permission to update events."},
                status=status.HTTP_403_FORBIDDEN,
            )

        event = self._get_event(pk)

        serializer = EventCreateUpdateSerializer(
            event,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):

        if not has_permission(request.user, "events", "delete"):
            return Response(
                {"detail": "You do not have permission to delete events."},
                status=status.HTTP_403_FORBIDDEN,
            )

        event = self._get_event(pk)

        event.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

class EventRegistrationAPIView(APIView):
    """
    POST   /api/events/<pk>/register/  — Authenticated user registers for an event.
    DELETE /api/events/<pk>/register/  — Authenticated user cancels their registration.
    """

    permission_classes = [IsAuthenticated]

    def _get_event(self, pk):
        return get_object_or_404(Event, pk=pk)

    def post(self, request, pk):

        # Allow only COMMUNITY_USER
        if request.user.role != "COMMUNITY_USER":
            return Response(
                {"detail": "Only community users can register for events."},
                status=status.HTTP_403_FORBIDDEN,
            )

        event = self._get_event(pk)

        if event.status != Event.EventStatus.PUBLISHED:
            return Response(
                {"detail": "Registrations are only open for published events."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if EventRegistration.objects.filter(event=event, user=request.user).exists():
            return Response(
                {"detail": "You are already registered for this event."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Enforce capacity limit
        if event.max_attendees is not None:
            confirmed_count = event.registrations.exclude(
                status=EventRegistration.RegistrationStatus.CANCELLED
            ).count()

            if confirmed_count >= event.max_attendees:
                return Response(
                    {"detail": "This event has reached its maximum capacity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        registration = EventRegistration.objects.create(
            event=event,
            user=request.user,
            status=EventRegistration.RegistrationStatus.CONFIRMED,
        )

        serializer = EventRegistrationSerializer(
            registration,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):

        # Allow only COMMUNITY_USER
        if request.user.role != "COMMUNITY_USER":
            return Response(
                {"detail": "Only community users can cancel registrations."},
                status=status.HTTP_403_FORBIDDEN,
            )

        event = self._get_event(pk)

        registration = EventRegistration.objects.filter(
            event=event,
            user=request.user
        ).first()

        if not registration:
            return Response(
                {"detail": "You are not registered for this event."},
                status=status.HTTP_404_NOT_FOUND,
            )

        registration.status = EventRegistration.RegistrationStatus.CANCELLED
        registration.save()

        return Response(
            {"detail": "Your registration has been cancelled."},
            status=status.HTTP_200_OK,
        )
class MyEventRegistrationsAPIView(APIView):
    """
    GET /api/events/my-registrations/  — Returns all registrations for the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        registrations = EventRegistration.objects.filter(user=request.user).select_related("event")
        serializer = EventRegistrationSerializer(
            registrations, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
