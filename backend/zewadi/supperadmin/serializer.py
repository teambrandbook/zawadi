from rest_framework import serializers

from accounts.models import User
from .models import AccessLevel, PermissionModule, Role, RolePermission


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


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
        return obj.members.count()

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
                RolePermission.objects.create(role=role, **perm)

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
                RolePermission.objects.create(role=instance, **perm)

        return instance
