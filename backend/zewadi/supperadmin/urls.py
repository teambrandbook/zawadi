from django.urls import path
from .views import UserListAPIView, UserDetailAPIView, RoleAPIView, AdminStatsAPIView

urlpatterns = [
    path("users/", UserListAPIView.as_view(), name="supperadmin-users-list"),
    path("users/<int:user_id>/", UserDetailAPIView.as_view(), name="supperadmin-user-detail"),
    path("roles/", RoleAPIView.as_view(), name="create-role"),
    path("roles/<int:id>/", RoleAPIView.as_view()),
    path("stats/", AdminStatsAPIView.as_view(), name="admin-stats"),
]
