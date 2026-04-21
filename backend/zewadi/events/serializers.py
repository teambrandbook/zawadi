from rest_framework import serializers
from .models import Event, EventRegistration


class EventListSerializer(serializers.ModelSerializer):
    """Compact read-only serializer for list views."""

    registration_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "event_type",
            "status",
            "cover_image",
            "start_datetime",
            "end_datetime",
            "is_online",
            "location",
            "is_free",
            "ticket_price",
            "is_featured",
            "show_in_community",
            "registration_count",
        ]
        read_only_fields = fields

    def get_registration_count(self, obj):
        return obj.registrations.count()


class EventDetailSerializer(serializers.ModelSerializer):
    """Full read-only serializer for detail views."""

    registration_count = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "full_description",
            "event_type",
            "status",
            "cover_image",
            "start_datetime",
            "end_datetime",
            "is_online",
            "location",
            "meeting_link",
            "max_attendees",
            "is_free",
            "ticket_price",
            "is_featured",
            "show_in_community",
            "created_by",
            "created_at",
            "updated_at",
            "registration_count",
        ]
        read_only_fields = fields

    def get_registration_count(self, obj):
        return obj.registrations.count()


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    """Writable serializer for create/update; created_by is set by the view."""

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "full_description",
            "event_type",
            "status",
            "cover_image",
            "start_datetime",
            "end_datetime",
            "is_online",
            "location",
            "meeting_link",
            "max_attendees",
            "is_free",
            "ticket_price",
            "is_featured",
            "show_in_community",
        ]
        read_only_fields = ["id", "slug"]

    def validate(self, attrs):
        start = attrs.get("start_datetime")
        end = attrs.get("end_datetime")
        if start and end and end <= start:
            raise serializers.ValidationError("end_datetime must be after start_datetime.")
        return attrs


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for EventRegistration; event and user are read-only."""

    event = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = EventRegistration
        fields = [
            "id",
            "event",
            "user",
            "status",
            "registered_at",
            "notes",
        ]
        read_only_fields = ["id", "event", "user", "registered_at"]
