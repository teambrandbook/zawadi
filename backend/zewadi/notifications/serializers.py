from rest_framework import serializers
from .models import Notification


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
