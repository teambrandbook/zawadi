from django.db import transaction
from rest_framework import serializers

from .models import *
from accounts.models import GENDER_CHOICES, User


class ConsultantUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "user_id",
            "user_name",
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "location",
            "photo",
            "role",
            "is_active",
            "date_joined",
        ]

    def get_full_name(self, obj):
        return obj.full_name or obj.get_full_name() or obj.user_name or obj.email


# ----------------------------------------------------

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"



class ConsultantListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Consultant
        fields = "__all__"

# -----------------------------------        


class ConsultantDetailSerializer(serializers.ModelSerializer):
    user = ConsultantUserSerializer(read_only=True)
    consultation_fee = serializers.IntegerField()
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


class ConsultantClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "user_id",
            "email",
            "full_name",
            "phone",
            "date_of_birth",
            "gender",
            "location",
        ]


class ConsultantProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source="user.user_id", read_only=True)
    user_name = serializers.CharField(source="user.user_name", required=False)
    full_name = serializers.CharField(source="user.full_name", required=False)
    email = serializers.EmailField(source="user.email", read_only=True)
    phone = serializers.CharField(source="user.phone", required=False)
    date_of_birth = serializers.DateField(source="user.date_of_birth", required=False, allow_null=True)
    gender = serializers.ChoiceField(source="user.gender", choices=GENDER_CHOICES, required=False, allow_null=True)
    location = serializers.CharField(source="user.location", required=False, allow_blank=True, allow_null=True)
    photo = serializers.ImageField(source="user.photo", required=False, allow_null=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = Consultant
        fields = [
            "id",
            "user_id",
            "user_name",
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "location",
            "photo",
            "role",
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
        ]
        read_only_fields = ["id", "user_id", "email", "role", "created_at"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        if user_data:
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class ConsultationBookingListSerializer(serializers.ModelSerializer):

    # consultant details
    consultant_name = serializers.SerializerMethodField()
    consultant_role = serializers.SerializerMethodField()
    consultant_image = serializers.SerializerMethodField()

    # user details
    user_name = serializers.SerializerMethodField()
    user_image = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = ConsultationBooking

        fields = [
            "id",

            # consultant details
            "consultant",
            "consultant_name",
            "consultant_role",
            "consultant_image",

            # user details
            "user",
            "user_name",
            "user_image",
            "user_email",

            # booking details
            "primary_goal",
            "primary_wellness_goal",
            "focuses_area",
            "diet_preferences",
            "lifestyle_activity_level",
            "buckwheat_journey_goal",
            "message",
            "language",
            "booked_date",
            "booked_slot",
            "status",

            # timestamps
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",

            # consultant readonly
            "consultant",
            "consultant_name",
            "consultant_role",
            "consultant_image",

            # user readonly
            "user",
            "user_name",
            "user_image",
            "user_email",

            # timestamps readonly
            "created_at",
            "updated_at",
        ]

    # -----------------------------------
    # CONSULTANT DETAILS
    # -----------------------------------

    def get_consultant_name(self, obj):

        if obj.consultant and obj.consultant.user:

            return (
                obj.consultant.user.get_full_name()
                or obj.consultant.user.user_name
            )

        return None

    def get_consultant_role(self, obj):

        if obj.consultant:
            return obj.consultant.qualification

        return None

    def get_consultant_image(self, obj):

        if (
            obj.consultant and
            obj.consultant.user and
            hasattr(obj.consultant.user, "photo") and
            obj.consultant.user.photo
        ):

            return obj.consultant.user.photo.url

        return None

    # -----------------------------------
    # USER DETAILS
    # -----------------------------------

    def get_user_name(self, obj):

        if obj.user:

            return (
                obj.user.get_full_name()
                or obj.user.user_name
            )

        return None

    def get_user_image(self, obj):

        if (
            obj.user and
            hasattr(obj.user, "photo") and
            obj.user.photo
        ):

            return obj.user.photo.url

        return None

    def get_user_email(self, obj):

        if obj.user:

            return obj.user.email

        return None    



class ConsultantBookingConformSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    is_accept = serializers.BooleanField()

    def validate(self, data):
        request = self.context["request"]
        consultant = request.user.consultant

        try:
            booking = ConsultationBooking.objects.get(
                id=data["booking_id"],
                consultant=consultant
            )
        except ConsultationBooking.DoesNotExist:
            raise serializers.ValidationError("Booking not found")

        if booking.status != ConsultationBooking.BookingStatus.PENDING:
            raise serializers.ValidationError("Booking already processed")

        # attach booking for later use
        data["booking"] = booking
        return data


class DietPlanMealItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlanMealItem
        fields = [
            "food_name",
            "quantity",
            "calories",
            "protein_grams",
            "carbs_grams",
            "fats_grams",
            "notes",
            "sort_order",
        ]


class DietPlanMealSerializer(serializers.ModelSerializer):
    items = DietPlanMealItemSerializer(many=True, required=False)

    class Meta:
        model = DietPlanMeal
        fields = [
            "meal_type",
            "title",
            "time",
            "calories",
            "notes",
            "sort_order",
            "items",
        ]


class DietPlanCreateSerializer(serializers.ModelSerializer):
    meals = DietPlanMealSerializer(many=True, required=False)

    class Meta:
        model = DietPlan
        fields = [
            "client",
            "title",
            "goal",
            "status",
            "description",
            "instructions",
            "foods_to_avoid",
            "recommended_foods",
            "daily_calories",
            "protein_grams",
            "carbs_grams",
            "fats_grams",
            "water_intake_liters",
            "start_date",
            "end_date",
            "duration_days",
            "is_template",
            "meals",
        ]

    def validate_client(self, value):
        if value.role != "COMMUNITY_USER":
            raise serializers.ValidationError("Diet plans can only be created for community users.")
        return value

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be greater than or equal to start date."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        meals_data = validated_data.pop("meals", [])
        consultant = self.context["request"].user.consultant
        diet_plan = DietPlan.objects.create(consultant=consultant, **validated_data)

        for meal_data in meals_data:
            items_data = meal_data.pop("items", [])
            meal = DietPlanMeal.objects.create(diet_plan=diet_plan, **meal_data)
            for item_data in items_data:
                DietPlanMealItem.objects.create(meal=meal, **item_data)

        return diet_plan


class DietPlanDetailSerializer(serializers.ModelSerializer):
    meals = DietPlanMealSerializer(many=True, read_only=True)
    client_name = serializers.SerializerMethodField()
    consultant_name = serializers.SerializerMethodField()

    class Meta:
        model = DietPlan
        fields = [
            "id",
            "consultant",
            "consultant_name",
            "client",
            "client_name",
            "title",
            "goal",
            "status",
            "description",
            "instructions",
            "foods_to_avoid",
            "recommended_foods",
            "daily_calories",
            "protein_grams",
            "carbs_grams",
            "fats_grams",
            "water_intake_liters",
            "start_date",
            "end_date",
            "duration_days",
            "is_template",
            "meals",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["consultant", "created_at", "updated_at"]

    def get_client_name(self, obj):
        return obj.client.get_full_name() or obj.client.email

    def get_consultant_name(self, obj):
        return obj.consultant.user.get_full_name() or obj.consultant.user.email



# -------------------------------------------------------------------




class AvailabilitySerializer(serializers.Serializer):
    day = serializers.ChoiceField(choices=WeekDay.choices)
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    def validate_day(self, value):
        return value

    def validate(self, data):
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError("Start time must be before end time")
        return data


# -----------------------------
# BLOCKED DATE SERIALIZER
# -----------------------------
class BlockedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedDate
        fields = ['id', 'from_date', 'to_date', 'reason']

    def validate(self, data):
        if data["from_date"] > data["to_date"]:
            raise serializers.ValidationError("From date must be before To date")
        return data


# -----------------------------
# CONSULTANT SETTINGS SERIALIZER
# -----------------------------
class ConsultantSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultantSettings
        fields = [
            "accept_new",
            "allow_same_day",
            "show_profile",
            "auto_close_full_day",
            "followup_priority"
        ]




# -------------------------------------------------------

# Consultetn Booking serializer


class ConsultationBookingCreateSerializer(serializers.ModelSerializer):
    consultant_id = serializers.IntegerField(write_only=True)
    time = serializers.CharField(write_only=True)

    class Meta:
        model = ConsultationBooking
        fields = [
            "consultant_id",
            "time",
            "session_type",
            "booked_date",
            "primary_goal",
            "primary_wellness_goal",
            "focuses_area",
            "diet_preferences",
            "lifestyle_activity_level",
            "buckwheat_journey_goal",
            "message",
            "language",
            "is_agreed",
        ]

    def validate(self, attrs):
        from .util import is_slot_available

        consultant_id = attrs.get("consultant_id")
        date = attrs.get("booked_date")
        time_str = attrs.get("time")

        try:
            consultant = Consultant.objects.get(id=consultant_id)
        except Consultant.DoesNotExist:
            raise serializers.ValidationError({"consultant_id": "Consultant not found."})

        available, error = is_slot_available(consultant, date, time_str)
        if not available:
            raise serializers.ValidationError({"time": error})

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        consultant_id = validated_data.pop("consultant_id")
        time = validated_data.pop("time")
        consultant = Consultant.objects.get(id=consultant_id)
        return ConsultationBooking.objects.create(
            user=user,
            consultant=consultant,
            booked_slot=time,
            **validated_data
        )
