from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission

from .models import Notification, UserNotificationReceipt
from .serializers import NotificationSerializer, UserNotificationReceiptSerializer
from .utils import create_receipts_for_notification


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and str(getattr(request.user, "role", "")).upper() in ("ADMIN", "INTERNAL_STAFF")
        )


class IsCommunityUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and str(getattr(request.user, "role", "")).upper() == "COMMUNITY_USER"
        )


class NotificationListCreateView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        notifications = Notification.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = serializer.save()
            # If status is SENT on creation, record sent_at
            if notification.status == "SENT" and notification.sent_at is None:
                notification.sent_at = timezone.now()
                notification.save(update_fields=["sent_at"])
            create_receipts_for_notification(notification)
            return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationDetailView(APIView):
    permission_classes = [IsAdminRole]

    def get_object(self, pk):
        try:
            return Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:
            return None

    def get(self, request, pk):
        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(NotificationSerializer(obj).data)

    def patch(self, request, pk):
        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = NotificationSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            notification = serializer.save()
            # Auto-set sent_at when status transitions to SENT
            if notification.status == "SENT" and notification.sent_at is None:
                notification.sent_at = timezone.now()
                notification.save(update_fields=["sent_at"])
            create_receipts_for_notification(notification)
            return Response(NotificationSerializer(notification).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Community-user inbox endpoints ──────────────────────────────────────────

class UserNotificationListView(APIView):
    """
    GET /api/notifications/inbox/
    Returns all SENT notifications targeted at ALL or community_user.
    Auto-creates a UserNotificationReceipt for each one the user hasn't seen.
    Supports ?unread=true to filter to unread only.
    """
    permission_classes = [IsCommunityUser]

    def get(self, request):
        notifications = Notification.objects.filter(
            status="SENT",
            target_role__in=["ALL", "community_user"],
        )

        # Ensure a receipt row exists for every qualifying notification
        existing_ids = set(
            UserNotificationReceipt.objects.filter(
                user=request.user,
                notification__in=notifications,
            ).values_list("notification_id", flat=True)
        )
        new_receipts = [
            UserNotificationReceipt(user=request.user, notification=n)
            for n in notifications
            if n.pk not in existing_ids
        ]
        if new_receipts:
            UserNotificationReceipt.objects.bulk_create(new_receipts, ignore_conflicts=True)

        receipts = UserNotificationReceipt.objects.filter(
            user=request.user,
            notification__status="SENT",
            notification__target_role__in=["ALL", "community_user"],
        ).select_related("notification")

        unread_only = request.query_params.get("unread", "").lower() == "true"
        if unread_only:
            receipts = receipts.filter(is_read=False)

        serializer = UserNotificationReceiptSerializer(receipts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserNotificationMarkReadView(APIView):
    """
    PATCH /api/notifications/inbox/<pk>/read/
    Marks a single receipt as read. <pk> is the notification id.
    """
    permission_classes = [IsCommunityUser]

    def patch(self, request, pk):
        try:
            receipt = UserNotificationReceipt.objects.select_related("notification").get(
                notification_id=pk,
                user=request.user,
            )
        except UserNotificationReceipt.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if not receipt.is_read:
            receipt.is_read = True
            receipt.read_at = timezone.now()
            receipt.save(update_fields=["is_read", "read_at"])

        return Response(UserNotificationReceiptSerializer(receipt).data, status=status.HTTP_200_OK)


class UserNotificationMarkAllReadView(APIView):
    """
    POST /api/notifications/inbox/mark-all-read/
    Marks every unread receipt for this user as read.
    """
    permission_classes = [IsCommunityUser]

    def post(self, request):
        now = timezone.now()
        updated = UserNotificationReceipt.objects.filter(
            user=request.user,
            is_read=False,
            notification__status="SENT",
            notification__target_role__in=["ALL", "community_user"],
        ).update(is_read=True, read_at=now)

        return Response({"marked_read": updated}, status=status.HTTP_200_OK)


class UserNotificationUnreadCountView(APIView):
    """
    GET /api/notifications/inbox/unread-count/
    Returns {"count": N} — the number of unread notifications for the current user.
    """
    permission_classes = [IsCommunityUser]

    def get(self, request):
        count = UserNotificationReceipt.objects.filter(
            user=request.user,
            is_read=False,
            notification__status="SENT",
            notification__target_role__in=["ALL", "community_user"],
        ).count()
        return Response({"count": count}, status=status.HTTP_200_OK)
