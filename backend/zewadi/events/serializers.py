from rest_framework import serializers
from .models import Event, EventRegistration
from zewadi.validators import validate_image_upload


class EventListSerializer(serializers.ModelSerializer):
    """Compact read-only serializer for list views."""

    registration_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_subtitle",
            "short_description",
            "event_type",
            "status",
            "cover_image",
            "host_speaker_name",
            "timezone",
            "agenda_highlights",
            "event_date",
            "start_time",
            "end_time",
            "registration_deadline",
            "repeat_event",
            "is_online",
            "location",
            "enable_registration",
            "waitlist_enabled",
            "approval_required",
            "event_tags",
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
            "short_subtitle",
            "short_description",
            "full_description",
            "event_type",
            "status",
            "cover_image",
            "host_speaker_name",
            "timezone",
            "agenda_highlights",
            "event_date",
            "start_time",
            "end_time",
            "registration_deadline",
            "repeat_event",
            "is_online",
            "location",
            "meeting_link",
            "max_attendees",
            "enable_registration",
            "waitlist_enabled",
            "approval_required",
            "event_tags",
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

    cover_image = serializers.ImageField(required=False, allow_null=True, validators=[validate_image_upload])
    institutional_name = serializers.CharField(
        source="host_speaker_name",
        required=False,
        allow_blank=True,
        write_only=True,
    )

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_subtitle",
            "short_description",
            "full_description",
            "event_type",
            "status",
            "cover_image",
            "host_speaker_name",
            "institutional_name",
            "timezone",
            "agenda_highlights",
            "event_date",
            "start_time",
            "end_time",
            "registration_deadline",
            "repeat_event",
            "is_online",
            "location",
            "meeting_link",
            "max_attendees",
            "enable_registration",
            "waitlist_enabled",
            "approval_required",
            "event_tags",
            "is_free",
            "ticket_price",
            "is_featured",
            "show_in_community",
        ]
        read_only_fields = ["id", "slug"]

    def validate(self, attrs):
        start = attrs.get("start_time")
        end = attrs.get("end_time")
        if start and end and end <= start:
            raise serializers.ValidationError("end_time must be after start_time.")
        return attrs


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for EventRegistration; event and user are read-only."""

    event = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    event_detail = serializers.SerializerMethodField()

    class Meta:
        model = EventRegistration
        fields = [
            "id",
            "event",
            "event_detail",
            "user",
            "status",
            "registered_at",
            "notes",
        ]
        read_only_fields = ["id", "event", "user", "registered_at"]

    def get_event_detail(self, obj):
        event = obj.event
        if not event:
            return None
        return {
            "id": event.id,
            "title": event.title,
            "slug": event.slug,
            "short_subtitle": event.short_subtitle,
            "event_type": event.event_type,
            "cover_image": event.cover_image.url if event.cover_image else None,
            "event_date": event.event_date,
            "start_time": event.start_time,
            "end_time": event.end_time,
            "is_online": event.is_online,
            "location": event.location,
            "host_speaker_name": event.host_speaker_name,
            "timezone": event.timezone,
            "event_tags": event.event_tags,
            "status": event.status,
        }
