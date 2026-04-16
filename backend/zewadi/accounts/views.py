from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User


class RegisterAPIView(APIView):
    """Public endpoint — anyone can register as a community user."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user_id": user.user_id,
                "email": user.email,
                "role": user.role
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data

            # Prepare response
            response = Response({
                "message": "Login successful",
                "data": {
                    "user_id": data["user_id"],
                    "email": data["email"],
                    "role": data["role"],
                },
                "access": data["access"]
            }, status=status.HTTP_200_OK)

            # 🔐 Store the refresh token in the backend as an HttpOnly cookie
            response.set_cookie(
                key="refresh_token",
                value=data["refresh"],
                httponly=True,  # Ensures that the cookie is not accessible by JavaScript
                secure=False,   # Change to True in production to use over HTTPS
                samesite="Lax", # Helps with CSRF protection
                max_age=7 * 24 * 60 * 60, # Refresh token will expire after 7 days
            )

            # Store the access token in the frontend cookie
            response.set_cookie(
                key="access_token",  # Cookie name
                value=data["access"],  # Access token value
                httponly=False,   # This allows JavaScript to access the cookie
                secure=False,     # Change to True in production to use over HTTPS
                samesite="Lax",   # Helps with CSRF protection
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
class RefreshAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise AuthenticationFailed("No refresh token")

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({
                "message": "Token refreshed"
            })

            # 🔐 Update access token cookie
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,        # ⭐ change this
                samesite="Lax", 
            )

            return response

        except Exception:
            raise AuthenticationFailed("Invalid refresh token")


class LogoutAPIView(APIView):
    """Blacklist the refresh token and clear both auth cookies."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass  # Already blacklisted or invalid — still clear cookies

        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response