from rest_framework import serializers
from .models import Notification, UserNotificationReceipt


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "body",
            "notification_type",
            "target_role",
            "status",
            "created_at",
            "sent_at",
        ]
        read_only_fields = ["id", "created_at"]


class UserNotificationReceiptSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="notification.id", read_only=True)
    title = serializers.CharField(source="notification.title", read_only=True)
    body = serializers.CharField(source="notification.body", read_only=True)
    notification_type = serializers.CharField(source="notification.notification_type", read_only=True)
    created_at = serializers.DateTimeField(source="notification.created_at", read_only=True)
    receipt_id = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = UserNotificationReceipt
        fields = [
            "receipt_id",
            "id",
            "title",
            "body",
            "notification_type",
            "is_read",
            "read_at",
            "created_at",
        ]
        read_only_fields = ["receipt_id", "id", "title", "body", "notification_type", "read_at", "created_at"]
