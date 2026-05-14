from django.urls import path

from .views import (
    CreateNutritionistAPIView,
    GoogleCallbackAPIView,
    GoogleLoginAPIView,
    LoginAPIView,
    LogoutAPIView,
    LogoutAllAPIView,
    MeAPIView,
    OTPResendAPIView,
    OTPVerifyAPIView,
    PasswordResetConfirmAPIView,
    PasswordResetRequestAPIView,
    PasswordResetVerifyAPIView,
    ChangePasswordAPIView,
    RefreshAPIView,
    RegisterAPIView,
    UpgradeAPIView,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("nutritionists/create/", CreateNutritionistAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("refresh/", RefreshAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("logout-all/", LogoutAllAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
    path("upgrade/", UpgradeAPIView.as_view()),
    path("otp/verify/", OTPVerifyAPIView.as_view()),
    path("otp/resend/", OTPResendAPIView.as_view()),
    path("password-reset/request/", PasswordResetRequestAPIView.as_view()),
    path("password-reset/verify/", PasswordResetVerifyAPIView.as_view()),
    path("password-reset/confirm/", PasswordResetConfirmAPIView.as_view()),
    path("change-password/", ChangePasswordAPIView.as_view()),
    path("google/login/", GoogleLoginAPIView.as_view()),
    path("google/callback/", GoogleCallbackAPIView.as_view()),
]
