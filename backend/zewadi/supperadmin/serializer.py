from rest_framework import serializers
from accounts.models import User
from .models import Role, RolePermission



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        
        

# class RolePermissionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RolePermission
#         fields = [
#             "module",
#             "can_view",
#             "can_create",
#             "can_edit",
#             "can_delete",
#             "can_approve",
#             "can_export",
#             "full_access"
#         ]