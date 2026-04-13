from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from communityuser.models import CommunityUser,CommunityUserAddress
from consultant.models import Consultant



class RegisterSerializer(serializers.Serializer):

    # 🔹 User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(max_length=100)
    user_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=15)
    date_of_birth = serializers.DateField()
    gender = serializers.CharField(max_length=10)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    role = serializers.ChoiceField(choices=["COMMUNITY_USER", "CONSULTANT"])

    # 🔹 Community fields
    user_type = serializers.ChoiceField(choices=["GUEST", "MEMBER"], required=False)
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

    def create(self, validated_data):

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
        )

        # 🔹 COMMUNITY USER
        if user.role == "COMMUNITY_USER":
            c_user = CommunityUser.objects.create(
                user=user,
                user_type=validated_data.get("user_type"),
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
        user = authenticate(email=data["email"], password=data["password"])

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh), 
        }
        
        
