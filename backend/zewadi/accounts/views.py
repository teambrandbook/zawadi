import logging
import os
import uuid as _uuid
import requests

logger = logging.getLogger(__name__)
from datetime import timedelta
from urllib.parse import urlencode

from django.conf import settings
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from communityuser.models import CommunityUser, UserType
from supperadmin.utils.permissions import has_permission
from django.utils import timezone
from .models import OTP, User
from .email import send_otp_email
from .serializers import LoginSerializer, MeSerializer, RegisterSerializer
from .throttles import LoginRateThrottle, RegisterRateThrottle


def get_google_config_error():
    if not settings.GOOGLE_CLIENT_ID:
        return "GOOGLE_CLIENT_ID is missing in .env"
    if not settings.GOOGLE_CLIENT_SECRET:
        return "GOOGLE_CLIENT_SECRET is missing in .env"
    if settings.GOOGLE_CLIENT_ID.startswith("your_real_client_id"):
        return "GOOGLE_CLIENT_ID still has the placeholder value"
    if settings.GOOGLE_CLIENT_SECRET.startswith("your_real_client_secret"):
        return "GOOGLE_CLIENT_SECRET still has the placeholder value"
    return None


def google_credentials_configured():
    return get_google_config_error() is None


def google_config_response():
    return Response(
        {
            "error": "Google credentials are not configured",
            "detail": get_google_config_error(),
            "required_env": ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
            "redirect_uri": "http://localhost:8000/api/account/google/callback/",
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


def get_frontend_url():
    frontend_url = getattr(settings, "FRONTEND_URL", None)
    if frontend_url:
        return frontend_url.rstrip("/")

    origins = getattr(settings, "CORS_ALLOWED_ORIGINS", [])
    return origins[0].rstrip("/") if origins else "http://localhost:3000"


def get_or_create_google_user(email, name):
    user = User.objects.filter(email=email).first()
    if user:
        return user

    user = User(
        email=email,
        full_name=name or email.split("@")[0],
        user_name=email.split("@")[0][:20],
        phone="",
        role="COMMUNITY_USER",
    )
    user.set_unusable_password()
    user.save()
    return user


def set_auth_cookies(response, refresh, access):
    from django.conf import settings
    secure = not settings.DEBUG
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=secure,
        samesite="Lax",
        max_age=7 * 24 * 60 * 60,
    )
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=False,
        secure=secure,
        samesite="Lax",
        max_age=30 * 60,
    )


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]

    def post(self, request):
        payload = request.data.copy()
        if not request.user.is_authenticated or request.user.role != "ADMIN":
            payload["role"] = "COMMUNITY_USER"
            payload.pop("role_obj", None)

        serializer = RegisterSerializer(data=payload)
        if serializer.is_valid():
            user = serializer.save()
            otp = OTP.generate(user, OTP.PURPOSE_EMAIL_VERIFICATION)
            send_otp_email(user.email, otp.code, OTP.PURPOSE_EMAIL_VERIFICATION)
            return Response(
                {
                    "message": "Registration successful. Check your email for a verification code.",
                    "user_id": user.user_id,
                    "email": user.email,
                    "requires_otp": True,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateNutritionistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        can_create_nutritionist = (
            has_permission(request.user, "nutritionists", "create")
            or has_permission(request.user, "users", "create")
        )
        if not can_create_nutritionist:
            return Response(
                {"message": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN,
            )

        payload = request.data.copy()
        payload["role"] = "CONSULTANT"

        serializer = RegisterSerializer(data=payload)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response(
                {
                    "message": "Nutritionist created successfully",
                    "user_id": user.user_id,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()
        purpose = request.data.get("purpose", "")

        if not email or not code or not purpose:
            return Response(
                {"error": "email, code, and purpose are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)

        otp = OTP.verify(user, code, purpose)
        if otp is None:
            return Response(
                {"error": "Invalid or expired code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if purpose == OTP.PURPOSE_EMAIL_VERIFICATION:
            user.is_active = True
            user.save(update_fields=["is_active"])
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            response = Response(
                {
                    "message": "Email verified. You are now logged in.",
                    "data": {
                        "user_id": user.user_id,
                        "email": user.email,
                        "role": user.role.lower(),
                    },
                    "access": access,
                },
                status=status.HTTP_200_OK,
            )
            set_auth_cookies(response, refresh, access)
            return response

        return Response(
            {
                "message": "Code verified.",
                "reset_token": str(otp.reset_token),
            },
            status=status.HTTP_200_OK,
        )


class OTPResendAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        purpose = request.data.get("purpose", "")

        if not email or not purpose:
            return Response(
                {"error": "email and purpose are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"message": "If that email is registered, a new code has been sent."}, status=status.HTTP_200_OK)

        otp = OTP.generate(user, purpose)
        send_otp_email(user.email, otp.code, purpose)
        return Response({"message": "A new code has been sent to your email."}, status=status.HTTP_200_OK)


class PasswordResetRequestAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"error": "email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If that email is registered, a reset code has been sent."},
                status=status.HTTP_200_OK,
            )

        otp = OTP.generate(user, OTP.PURPOSE_PASSWORD_RESET)
        send_otp_email(user.email, otp.code, OTP.PURPOSE_PASSWORD_RESET)
        return Response(
            {"message": "A reset code has been sent to your email."},
            status=status.HTTP_200_OK,
        )


class PasswordResetVerifyAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()

        if not email or not code:
            return Response({"error": "email and code are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)

        otp = OTP.verify(user, code, OTP.PURPOSE_PASSWORD_RESET)
        if otp is None:
            return Response({"error": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "Code verified.", "reset_token": str(otp.reset_token)},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        reset_token = request.data.get("reset_token", "").strip()
        new_password = request.data.get("new_password", "")

        if not reset_token or not new_password:
            return Response(
                {"error": "reset_token and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token_uuid = _uuid.UUID(reset_token)
        except ValueError:
            return Response({"error": "Invalid reset token."}, status=status.HTTP_400_BAD_REQUEST)

        cutoff = timezone.now() - timedelta(minutes=15)
        try:
            otp = OTP.objects.get(
                reset_token=token_uuid,
                purpose=OTP.PURPOSE_PASSWORD_RESET,
                is_used=True,
                created_at__gte=cutoff,
            )
        except OTP.DoesNotExist:
            return Response({"error": "Reset token is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

        user = otp.user
        user.set_password(new_password)
        user.save(update_fields=["password"])
        otp.reset_token = None
        otp.save(update_fields=["reset_token"])

        return Response({"message": "Password reset successful. You can now log in."}, status=status.HTTP_200_OK)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            response = Response(
                {
                    "message": "Login successful",
                    "data": {
                        "user_id": data["user_id"],
                        "email": data["email"],
                        "role": data["role"],
                    },
                    "access": data["access"],
                },
                status=status.HTTP_200_OK,
            )
            set_auth_cookies(response, data["refresh"], data["access"])
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get("token")
        if not credential:
            return Response({"error": "Google token is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not google_credentials_configured():
            return google_config_response()

        token_response = requests.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": credential},
            timeout=10,
        )
        if token_response.status_code != 200:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

        token_info = token_response.json()
        if token_info.get("aud") != settings.GOOGLE_CLIENT_ID:
            return Response({"error": "Google token audience mismatch"}, status=status.HTTP_400_BAD_REQUEST)
        if token_info.get("email_verified") not in (True, "true", "True"):
            return Response({"error": "Google email is not verified"}, status=status.HTTP_400_BAD_REQUEST)

        email = token_info.get("email")
        if not email:
            return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_or_create_google_user(email, token_info.get("name"))
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response(
            {
                "message": "Google login successful",
                "data": {
                    "user_id": user.user_id,
                    "email": user.email,
                    "role": user.role.lower(),
                },
                "access": access,
            },
            status=status.HTTP_200_OK,
        )
        set_auth_cookies(response, refresh, access)
        return response

    def get(self, request):
        if not google_credentials_configured():
            return google_config_response()

        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": request.build_absolute_uri("/api/account/google/callback/"),
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent",
        }
        return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}")


class GoogleCallbackAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not google_credentials_configured():
            return google_config_response()

        code = request.GET.get("code")
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

        redirect_uri = request.build_absolute_uri("/api/account/google/callback/")
        token_response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
            timeout=10,
        )
        token_json = token_response.json()
        google_access_token = token_json.get("access_token")
        if not google_access_token:
            return Response({"error": "Token not received"}, status=status.HTTP_400_BAD_REQUEST)

        user_info = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {google_access_token}"},
            timeout=10,
        ).json()

        email = user_info.get("email")
        if not email:
            return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_or_create_google_user(email, user_info.get("name"))
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = redirect(f"{get_frontend_url()}/communityDashBoard")
        set_auth_cookies(response, refresh, access)
        return response


class RefreshAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            raise AuthenticationFailed("No refresh token")

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            new_refresh = str(refresh)
            response = Response({"message": "Token refreshed"})
            set_auth_cookies(response, new_refresh, new_access)
            return response
        except Exception:
            raise AuthenticationFailed("Invalid or expired refresh token")


class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception:
                logger.warning("Logout: failed to blacklist token", exc_info=True)

        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class LogoutAllAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
        tokens = OutstandingToken.objects.filter(user=request.user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        response = Response({"message": "All sessions logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = MeSerializer(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        errors = {}

        full_name = request.data.get("full_name")
        if full_name is not None:
            full_name = str(full_name).strip()
            if len(full_name) == 0:
                errors["full_name"] = "Full name cannot be blank."
            elif len(full_name) > 120:
                errors["full_name"] = "Full name must be 120 characters or fewer."
            else:
                user.full_name = full_name

        phone = request.data.get("phone")
        if phone is not None:
            phone = str(phone).strip()
            if len(phone) > 20:
                errors["phone"] = "Phone must be 20 characters or fewer."
            else:
                user.phone = phone

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        changed = [f for f in ("full_name", "phone") if f in request.data]
        if "photo" in request.FILES:
            user.photo = request.FILES["photo"]
            changed.append("photo")
        if changed:
            changed.append("updated_at")
            user.save(update_fields=changed)

        serializer = MeSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpgradeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            community_user = request.user.communityuser
        except CommunityUser.DoesNotExist:
            return Response(
                {"error": "No community profile found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if community_user.user_type == UserType.MEMBER:
            return Response(
                {"error": "Already a community member."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        community_user.user_type = UserType.MEMBER
        community_user.save(update_fields=["user_type"])
        return Response({"user_type": community_user.user_type}, status=status.HTTP_200_OK)
