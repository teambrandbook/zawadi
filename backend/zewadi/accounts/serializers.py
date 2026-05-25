import random
from rest_framework import serializers
from .models import User, ROLE_CHOICES
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from communityuser.models import CommunityUser, CommunityUserAddress, UserType
from consultant.models import Consultant
from supperadmin.models import Role
from django.db import transaction
from axes.handlers.proxy import AxesProxyHandler


class MeSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "user_id",
            "email",
            "role",
            "full_name",
            "user_name",
            "phone",
            "date_of_birth",
            "gender",
            "location",
            "photo",
            "user_type",
        ]

    def get_role(self, obj):
        return str(obj.role).lower()

    def get_user_type(self, obj):
        cu = getattr(obj, "communityuser", None)
        return cu.user_type if cu is not None else None


class RegisterSerializer(serializers.Serializer):

    # 🔹 User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default="")
    user_name = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True, default="")
    date_of_birth = serializers.DateField(required=False, allow_null=True, default=None)
    gender = serializers.CharField(max_length=10, required=False, allow_blank=True, default="")
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    photo = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    # Keep serializer role options in sync with the User model choices.
    role = serializers.ChoiceField(
        choices=[choice[0] for choice in ROLE_CHOICES],
        required=False,
        default="COMMUNITY_USER",
    )
    role_obj = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        required=False,
        allow_null=True,
    )

    # 🔹 Community fields
    user_type = serializers.CharField(required=False, allow_blank=True)
    wellness_interests = serializers.CharField(required=False, allow_blank=True)
    diet_preference = serializers.CharField(required=False, allow_blank=True)
    preferred_communication = serializers.CharField(default="email", required=False)
    notification_preferences = serializers.CharField(default="all", required=False)

    activate_immediately = serializers.BooleanField(default=False, required=False)
    send_welcome_email = serializers.BooleanField(default=True, required=False)
    send_password_setup = serializers.BooleanField(default=False, required=False)
    allow_notifications = serializers.BooleanField(default=True, required=False)

    # 🔹 Address
    address_line = serializers.CharField(required=False)
    city = serializers.CharField(required=False)
    state = serializers.CharField(required=False)
    country = serializers.CharField(required=False)
    postal_code = serializers.CharField(required=False)

    # 🔹 Consultant fields
    years_of_experience = serializers.IntegerField(required=False)
    qualification = serializers.CharField(required=False)
    certifications = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    short_bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    languages_spoken = serializers.CharField(required=False)
    experience_areas = serializers.CharField(required=False)
    session_type = serializers.CharField(required=False)
    consultation_fee = serializers.IntegerField(required=False)
    session_duration = serializers.IntegerField(required=False)

    def validate_email(self, value):
        email = User.objects.normalize_email(value.strip()).lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def validate_user_type(self, value):
        normalized = str(value).strip().lower()
        valid_values = {choice[0] for choice in UserType.choices}
        if normalized not in valid_values:
            raise serializers.ValidationError(
                f"Invalid user_type. Choose from: {sorted(valid_values)}."
            )
        return normalized

    def create(self, validated_data):
        with transaction.atomic():
            # Auto-generate missing full_name and user_name from email prefix
            email = validated_data.get("email", "")
            email_prefix = email.split("@")[0]

            if not validated_data.get("full_name", "").strip():
                validated_data["full_name"] = email_prefix

            if not validated_data.get("user_name", "").strip():
                suffix = random.randint(1000, 9999)
                validated_data["user_name"] = f"{email_prefix[:15]}_{suffix}"

            # 🔹 Extract password
            password = validated_data.get("password")

            # 🔹 Create User (ONLY pass required fields)
            user = User.objects.create_user(
                email=validated_data.get("email"),
                password=password,
                full_name=validated_data.get("full_name"),
                user_name=validated_data.get("user_name"),
                phone=validated_data.get("phone"),
                date_of_birth=validated_data.get("date_of_birth"),
                gender=validated_data.get("gender"),
                location=validated_data.get("location"),
                photo=validated_data.get("photo"),
                role=validated_data.get("role"),
                role_obj=validated_data.get("role_obj"),
                is_active=False,
            )

            # 🔹 COMMUNITY USER
            if user.role == "COMMUNITY_USER":
                c_user = CommunityUser.objects.create(
                    user=user,
                    user_type=validated_data.get("user_type", UserType.GUEST),
                    wellness_interests=validated_data.get("wellness_interests", ""),
                    diet_preference=validated_data.get("diet_preference", ""),
                    preferred_communication=validated_data.get("preferred_communication", "email"),
                    notification_preferences=validated_data.get("notification_preferences", "all"),
                    activate_immediately=validated_data.get("activate_immediately", False),
                    send_welcome_email=validated_data.get("send_welcome_email", True),
                    send_password_setup=validated_data.get("send_password_setup", False),
                    allow_notifications=validated_data.get("allow_notifications", True),
                )

                # Address
                if validated_data.get("address_line"):
                    CommunityUserAddress.objects.create(
                        user=c_user,
                        address_line=validated_data.get("address_line"),
                        city=validated_data.get("city"),
                        state=validated_data.get("state"),
                        country=validated_data.get("country"),
                        postal_code=validated_data.get("postal_code"),
                    )

            # 🔹 CONSULTANT
            elif user.role == "CONSULTANT":
                Consultant.objects.create(
                    user=user,
                    years_of_experience=validated_data.get("years_of_experience"),
                    qualification=validated_data.get("qualification"),
                    certifications=validated_data.get("certifications"),
                    short_bio=validated_data.get("short_bio"),
                    languages_spoken=validated_data.get("languages_spoken"),
                    experience_areas=validated_data.get("experience_areas"),
                    session_type=validated_data.get("session_type"),
                    consultation_fee=validated_data.get("consultation_fee"),
                    session_duration=validated_data.get("session_duration"),
                )

            return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = User.objects.normalize_email(data["email"].strip()).lower()
        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Note: axes does not record this failure — no authenticate() call is made.
            # Attackers enumerating non-existent emails bypass lockout here.
            # IP-level rate limiting at the proxy layer mitigates this.
            raise serializers.ValidationError("Invalid credentials")

        if not user_obj.is_active:
            raise serializers.ValidationError(
                "Please verify your email before logging in. Check your inbox for a verification code."
            )

        request = self.context.get("request")
        if AxesProxyHandler.is_locked(request, credentials={"username": user_obj.email}):
            raise serializers.ValidationError(
                "Account temporarily locked due to too many failed login attempts. "
                "Please try again in 1 hour or contact support."
            )

        user = authenticate(
            request=request,
            username=user_obj.email,
            password=data["password"],
        )
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        # Signal successful login so axes resets the failure counter (AXES_RESET_ON_SUCCESS)
        AxesProxyHandler.user_logged_in(sender=user.__class__, request=request, user=user)

        refresh = RefreshToken.for_user(user)
        return {
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role.lower(),
            "user_type": getattr(getattr(user, "communityuser", None), "user_type", None),
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
