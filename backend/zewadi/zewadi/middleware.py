from django.http import JsonResponse
from django.core.cache import cache

MAINTENANCE_CACHE_KEY = "zawadi:maintenance_mode"
MAINTENANCE_CACHE_TTL = 30  # seconds

# These paths must always work regardless of maintenance state
_EXEMPT_PREFIXES = (
    "/admin/",
    "/api/health/",
    "/api/account/login/",
    "/api/account/refresh/",
    "/api/superadmin/config/",
)


class MaintenanceModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if any(request.path.startswith(p) for p in _EXEMPT_PREFIXES):
            return self.get_response(request)

        user = getattr(request, "user", None)
        if user and user.is_authenticated and (
            getattr(user, "is_superuser", False)
            or getattr(user, "role", "") == "ADMIN"
        ):
            return self.get_response(request)

        maintenance = cache.get(MAINTENANCE_CACHE_KEY)
        if maintenance is None:
            try:
                from supperadmin.models import SiteSettings
                maintenance = SiteSettings.get().maintenance_mode
                cache.set(MAINTENANCE_CACHE_KEY, maintenance, MAINTENANCE_CACHE_TTL)
            except Exception:
                maintenance = False

        if maintenance:
            return JsonResponse(
                {"detail": "Platform is under maintenance. Please try again later."},
                status=503,
            )

        return self.get_response(request)
