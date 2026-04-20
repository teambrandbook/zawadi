from rest_framework import serializers
from .models import Consultant, ConsultationBooking
from accounts.models import User


class ConsultantUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["full_name", "email", "photo"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.email


class ConsultantListSerializer(serializers.ModelSerializer):
    user = ConsultantUserSerializer(read_only=True)
    consultation_fee = serializers.IntegerField(source="consiltation_fee")

    class Meta:
        model = Consultant
        fields = [
            "id",
            "user",
            "years_of_experience",
            "qualification",
            "short_bio",
            "languages_spoken",
            "session_type",
            "consultation_fee",
            "session_duration",
            "experience_areas",
        ]


class ConsultantDetailSerializer(serializers.ModelSerializer):
    user = ConsultantUserSerializer(read_only=True)
    consultation_fee = serializers.IntegerField(source="consiltation_fee")
    bookings_count = serializers.SerializerMethodField()

    class Meta:
        model = Consultant
        fields = [
            "id",
            "user",
            "years_of_experience",
            "qualification",
            "certifications",
            "short_bio",
            "languages_spoken",
            "session_type",
            "consultation_fee",
            "session_duration",
            "experience_areas",
            "created_at",
            "bookings_count",
        ]

    def get_bookings_count(self, obj):
        return obj.bookings.count()


class ConsultationBookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationBooking
        fields = [
            "consultant",
            "session_type",
            "booked_date",
            "booked_slot",
            "health_goal",
            "conditions",
            "notes",
            "language",
            "is_agreed",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user
        return super().create(validated_data)


class ConsultationBookingListSerializer(serializers.ModelSerializer):
    consultant_name = serializers.SerializerMethodField()

    class Meta:
        model = ConsultationBooking
        fields = [
            "id",
            "consultant_name",
            "session_type",
            "booked_date",
            "booked_slot",
            "status",
            "created_at",
        ]

    def get_consultant_name(self, obj):
        return str(obj.consultant.user.get_full_name() or obj.consultant.user.email)
