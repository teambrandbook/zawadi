from rest_framework import serializers

from zewadi.validators import validate_image_upload
from .models import CommunityUser, CommunityUserAddress, UserType


class CommunityUserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityUserAddress
        fields = ["address_line", "city", "state", "country", "postal_code"]


class CommunityProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source="user.user_id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    user_name = serializers.CharField(source="user.user_name", read_only=True)

    full_name = serializers.CharField(source="user.full_name", required=False)
    phone = serializers.CharField(source="user.phone", required=False)
    date_of_birth = serializers.DateField(source="user.date_of_birth", required=False, allow_null=True)
    gender = serializers.CharField(source="user.gender", required=False, allow_blank=True, allow_null=True)
    location = serializers.CharField(source="user.location", required=False, allow_blank=True, allow_null=True)
    photo = serializers.ImageField(
        source="user.photo",
        required=False,
        allow_null=True,
        validators=[validate_image_upload],
    )

    address = CommunityUserAddressSerializer(required=False)
    user_type = serializers.CharField(required=False)

    class Meta:
        model = CommunityUser
        fields = [
            "user_id",
            "email",
            "role",
            "user_name",
            "full_name",
            "phone",
            "date_of_birth",
            "gender",
            "location",
            "photo",
            "user_type",
            "wellness_interests",
            "diet_preference",
            "preferred_communication",
            "notification_preferences",
            "activate_immediately",
            "send_welcome_email",
            "send_password_setup",
            "allow_notifications",
            "is_verified_member",
            "address",
        ]
        read_only_fields = ["is_verified_member"]

    def validate_user_type(self, value):
        normalized = str(value).strip().lower()
        valid_values = {choice[0] for choice in UserType.choices}
        if normalized not in valid_values:
            raise serializers.ValidationError(
                f"Invalid user_type. Choose from: {sorted(valid_values)}."
            )
        return normalized

    def validate(self, attrs):
        address_data = attrs.get("address")
        if address_data is not None and self.instance is not None:
            has_existing_address = getattr(self.instance, "address", None) is not None
            if not has_existing_address:
                required_fields = ["address_line", "city", "state", "country", "postal_code"]
                missing = [field for field in required_fields if not address_data.get(field)]
                if missing:
                    raise serializers.ValidationError(
                        {"address": f"Missing required fields for new address: {', '.join(missing)}"}
                    )
        return attrs

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        address_data = validated_data.pop("address", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        if address_data is not None:
            address = getattr(instance, "address", None)

            if address is None:
                CommunityUserAddress.objects.create(user=instance, **address_data)
            else:
                for attr, value in address_data.items():
                    setattr(address, attr, value)
                address.save()

        return instance
