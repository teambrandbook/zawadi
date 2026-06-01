from rest_framework import serializers

from accounts.models import User
from .models import AccessLevel, PermissionModule, Role, RolePermission
from communityuser.models import CommunityUser
from consultant.models import Consultant


PERMISSION_ACTION_FIELDS = (
    "can_view",
    "can_create",
    "can_edit",
    "can_delete",
    "can_approve",
    "can_export",
)


def normalize_permission_data(permission):
    normalized = dict(permission)

    if normalized.get("full_access"):
        for field in PERMISSION_ACTION_FIELDS:
            normalized[field] = True
        normalized["full_access"] = True
        return normalized

    normalized["full_access"] = all(
        normalized.get(field, False) for field in PERMISSION_ACTION_FIELDS
    )
    return normalized




class CommunityUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityUser
        fields = [
            "id", "user_type", "wellness_interests", "diet_preference",
            "preferred_communication", "notification_preferences",
        ]


class UserSerializer(serializers.ModelSerializer):
    communityuser = CommunityUserSerializer(read_only=True)
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "user_id", "email", "full_name", "user_name", "phone",
            "role", "role_obj", "is_active", "date_of_birth", "gender",
            "location", "photo", "date_joined", "last_login",
            "user_type", "communityuser",
        ]

    def get_user_type(self, obj):
        cu = getattr(obj, "communityuser", None)
        return cu.user_type if cu is not None else None

class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin partial user updates — only safe editable fields."""
    class Meta:
        model = User
        fields = ["full_name", "phone", "role", "location", "date_of_birth", "gender", "is_active", "photo"]
        extra_kwargs = {field: {"required": False} for field in ["full_name", "phone", "role", "location", "date_of_birth", "gender", "is_active", "photo"]}


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = [
            "module",
            "can_view",
            "can_create",
            "can_edit",
            "can_delete",
            "can_approve",
            "can_export",
            "full_access",
        ]


class RoleSerializer(serializers.ModelSerializer):
    permissions = RolePermissionSerializer(many=True, required=False)
    access_level = serializers.ChoiceField(choices=AccessLevel.choices, required=False)
    member_count = serializers.SerializerMethodField()
    
    def get_member_count(self, obj):
        members = getattr(obj, "members", None)
        if members is not None:
            return members.count()

        return obj.user_set.count()

    class Meta:
        model = Role
        fields = ["id", "role_name", "role_status", "access_level", "permissions","member_count"]

    def create(self, validated_data):
        permissions_data = validated_data.pop("permissions", [])
        access_level = validated_data.get("access_level", AccessLevel.LOW)
        role = Role.objects.create(**validated_data)

        if access_level == AccessLevel.FULL:
            all_modules = [choice[0] for choice in PermissionModule.choices]
            for module in all_modules:
                RolePermission.objects.create(
                    role=role,
                    module=module,
                    can_view=True,
                    can_create=True,
                    can_edit=True,
                    can_delete=True,
                    can_approve=True,
                    can_export=True,
                    full_access=True,
                )
        else:
            for perm in permissions_data:
                RolePermission.objects.create(
                    role=role,
                    **normalize_permission_data(perm),
                )

        return role
    
    def update(self, instance, validated_data):
        permissions_data = validated_data.pop("permissions", None)
        access_level = validated_data.get("access_level", instance.access_level)

        # 🔹 Update Role fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 🔥 CASE 1: FULL ACCESS
        if access_level == AccessLevel.FULL:
            # delete old permissions
            instance.permissions.all().delete()

            all_modules = [choice[0] for choice in PermissionModule.choices]

            for module in all_modules:
                RolePermission.objects.create(
                    role=instance,
                    module=module,
                    can_view=True,
                    can_create=True,
                    can_edit=True,
                    can_delete=True,
                    can_approve=True,
                    can_export=True,
                    full_access=True
                )

        # 🔹 CASE 2: CUSTOM UPDATE
        elif permissions_data is not None:
            # delete old permissions
            instance.permissions.all().delete()

            for perm in permissions_data:
                RolePermission.objects.create(
                    role=instance,
                    **normalize_permission_data(perm),
                )

        return instance
