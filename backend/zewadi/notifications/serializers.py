from rest_framework import serializers
from django.utils import timezone
from .models import Notification, UserNotificationReceipt


class NotificationSerializer(serializers.ModelSerializer):
    def validate_delivery_channels(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Delivery channels must be a list.")
        allowed = {Notification.CHANNEL_IN_APP, Notification.CHANNEL_EMAIL}
        normalized = []
        for item in value:
            if item not in allowed:
                raise serializers.ValidationError("Unsupported delivery channel.")
            if item not in normalized:
                normalized.append(item)
        if not normalized:
            raise serializers.ValidationError("Select at least one delivery channel.")
        return normalized

    def validate(self, attrs):
        status = attrs.get("status", getattr(self.instance, "status", Notification._meta.get_field("status").default))
        scheduled_at = attrs.get("scheduled_at", getattr(self.instance, "scheduled_at", None))
        if status == "SCHEDULED":
            if scheduled_at is None:
                raise serializers.ValidationError({"scheduled_at": "Scheduled notifications require a scheduled time."})
            if scheduled_at <= timezone.now():
                raise serializers.ValidationError({"scheduled_at": "Scheduled time must be in the future."})
        return attrs

    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "body",
            "notification_type",
            "target_role",
            "status",
            "delivery_channels",
            "scheduled_at",
            "created_at",
            "sent_at",
        ]
        read_only_fields = ["id", "created_at"]


class UserNotificationReceiptSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="notification.id", read_only=True)
    title = serializers.CharField(source="notification.title", read_only=True)
    body = serializers.CharField(source="notification.body", read_only=True)
    notification_type = serializers.CharField(source="notification.notification_type", read_only=True)
    delivery_channels = serializers.JSONField(source="notification.delivery_channels", read_only=True)
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
            "delivery_channels",
            "is_read",
            "read_at",
            "created_at",
        ]
        read_only_fields = ["receipt_id", "id", "title", "body", "notification_type", "delivery_channels", "read_at", "created_at"]
