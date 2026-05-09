from rest_framework.permissions import BasePermission
from communityuser.models import UserType


class IsMemberUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "communityuser")
            and request.user.communityuser.user_type == UserType.MEMBER
        )


class IsGuestUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "communityuser")
            and request.user.communityuser.user_type == UserType.GUEST
        )
