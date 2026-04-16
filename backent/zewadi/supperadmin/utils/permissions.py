from rest_framework.permissions import BasePermission


def has_permission(user, module, action):
    if user.is_superuser or user.role == "admin":
        return True

    if user.role != "internal_staff":
        return False

    if not user.role_obj:
        return False

    perm = user.role_obj.permissions.filter(module=module).first()

    if not perm:
        return False

    if perm.full_access:
        return True

    permission_field = f"can_{action}"
    if not hasattr(perm, permission_field):
        return False
    return getattr(perm, permission_field, False)


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == "admin"