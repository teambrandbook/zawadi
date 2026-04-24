from django.urls import path
from .views import RegisterAPIView, LoginAPIView, RefreshAPIView, LogoutAPIView, MeAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("refresh/", RefreshAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
]
