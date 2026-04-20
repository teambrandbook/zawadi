from django.urls import path

from .views import UserListAPIView, RoleAPIView, AdminStatsAPIView

urlpatterns = [
    path("users/", UserListAPIView.as_view(), name="supperadmin-users-list"),
    path("roles/", RoleAPIView.as_view(), name="create-role"),
    path("roles/<int:id>/", RoleAPIView.as_view()),
    path("stats/", AdminStatsAPIView.as_view(), name="admin-stats"),
]
