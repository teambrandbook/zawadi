from django.urls import path

from .views import UserListAPIView,RoleAPIView

urlpatterns = [
    path("users/", UserListAPIView.as_view(), name="supperadmin-users-list"),
    path("roles/", RoleAPIView.as_view(), name="create-role"),
    path('roles/<int:id>/', RoleAPIView.as_view()),
]
