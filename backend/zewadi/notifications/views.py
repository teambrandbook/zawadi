from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission

from .models import Notification, PushDevice, UserNotificationReceipt
from .serializers import NotificationSerializer, PushDeviceTokenSerializer, UserNotificationReceiptSerializer
from .utils import deliver_notification
from supperadmin.utils.permissions import has_permission


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and str(getattr(request.user, "role", "")).upper() in ("ADMIN", "INTERNAL_STAFF")
        )


class NotificationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_permission(request.user, "notifications", "view"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        notifications = Notification.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not has_permission(request.user, "notifications", "create"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = serializer.save()
            if notification.status == "SENT":
                if notification.sent_at is None:
                    notification.sent_at = timezone.now()
                    notification.save(update_fields=["sent_at"])
                deliver_notification(notification)
            return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:
            return None

    def get(self, request, pk):
        if not has_permission(request.user, "notifications", "view"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(NotificationSerializer(obj).data)

    def patch(self, request, pk):
        if not has_permission(request.user, "notifications", "edit"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        was_sent = obj.status == "SENT"
        serializer = NotificationSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            notification = serializer.save()
            if notification.status == "SENT" and not was_sent:
                if notification.sent_at is None:
                    notification.sent_at = timezone.now()
                    notification.save(update_fields=["sent_at"])
                deliver_notification(notification)
            return Response(NotificationSerializer(notification).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not has_permission(request.user, "notifications", "delete"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Community-user inbox endpoints ──────────────────────────────────────────

class UserNotificationListView(APIView):
    """
    GET /api/notifications/inbox/
    Returns the current user's SENT notification receipts.
    Supports ?unread=true to filter to unread only.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        receipts = UserNotificationReceipt.objects.filter(
            user=request.user,
            notification__status="SENT",
        ).select_related("notification")

        unread_only = request.query_params.get("unread", "").lower() == "true"
        if unread_only:
            receipts = receipts.filter(is_read=False)

        serializer = UserNotificationReceiptSerializer(receipts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserNotificationMarkReadView(APIView):
    """
    PATCH /api/notifications/inbox/<pk>/read/
    Marks a single receipt as read. <pk> is the receipt id.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            receipt = UserNotificationReceipt.objects.select_related("notification").get(
                pk=pk,
                user=request.user,
            )
        except UserNotificationReceipt.DoesNotExist:
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        now = timezone.now()
        updated = UserNotificationReceipt.objects.filter(
            user=request.user,
            is_read=False,
            notification__status="SENT",
        ).update(is_read=True, read_at=now)

        return Response({"marked_read": updated}, status=status.HTTP_200_OK)


class UserNotificationUnreadCountView(APIView):
    """
    GET /api/notifications/inbox/unread-count/
    Returns {"count": N} — the number of unread notifications for the current user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = UserNotificationReceipt.objects.filter(
            user=request.user,
            is_read=False,
            notification__status="SENT",
        ).count()
        return Response({"count": count}, status=status.HTTP_200_OK)


class UserNotificationDeleteView(APIView):
    """
    DELETE /api/notifications/inbox/<pk>/
    Removes one inbox receipt for the current user without deleting the
    underlying notification for other recipients.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        deleted, _ = UserNotificationReceipt.objects.filter(
            pk=pk,
            user=request.user,
        ).delete()
        if not deleted:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PushDeviceStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        token = request.query_params.get("token", "").strip()
        registered = bool(token) and PushDevice.objects.filter(
            user=request.user,
            token=token,
            is_active=True,
        ).exists()
        return Response({"registered": registered}, status=status.HTTP_200_OK)


class PushDeviceRegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PushDeviceTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["token"]
        device, _ = PushDevice.objects.update_or_create(
            token=token,
            defaults={
                "user": request.user,
                "platform": PushDevice.PLATFORM_WEB,
                "user_agent": request.META.get("HTTP_USER_AGENT", "")[:500],
                "is_active": True,
            },
        )
        device.save(update_fields=["last_seen_at", "updated_at"])
        return Response({"registered": True}, status=status.HTTP_200_OK)


class PushDeviceUnregisterView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        serializer = PushDeviceTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = PushDevice.objects.filter(
            user=request.user,
            token=serializer.validated_data["token"],
        ).update(is_active=False)
        return Response({"unregistered": bool(updated)}, status=status.HTTP_200_OK)
