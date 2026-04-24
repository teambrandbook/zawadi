from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListCreateView(APIView):
    permission_classes = [IsAdminUser]

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
            return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationDetailView(APIView):
    permission_classes = [IsAdminUser]

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
            return Response(NotificationSerializer(notification).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if obj is None:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
