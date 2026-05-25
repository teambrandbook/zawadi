"""
URL configuration for zewadi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.views.static import serve


def health_check(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/health/", health_check, name="health_check"),
    path("api/account/", include("accounts.urls")),
    path("api/superadmin/", include("supperadmin.urls")),
    path("api/products/", include("product.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/recipes/", include("recipes.urls")),
    path("api/consultant/", include("consultant.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/events/", include("events.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/community/", include("communityuser.urls")),
    path("api/tax/", include("tax.urls")),
]

if settings.MEDIA_URL and settings.MEDIA_ROOT:
    media_prefix = settings.MEDIA_URL.lstrip("/").rstrip("/")
    urlpatterns += [
        re_path(
            rf"^{media_prefix}/(?P<path>.*)$",
            serve,
            {"document_root": settings.MEDIA_ROOT},
        )
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
