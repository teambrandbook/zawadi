from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import User
from .serializer import UserSerializer
from .utils.permissions import has_permission


class UserListAPIView(APIView):

    def get(self, request):
        user = request.user

        if not has_permission(user, "users", "view"):
            return Response(
                {"error": "You do not have permission to view users"},
                status=status.HTTP_403_FORBIDDEN,
            )

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RoleCreationAPIView():
    def post(self, request):
        user=request.user
        if user.role!="ADMIN":
            return Response(
                {"error": "You do not have permission to view users"},
                status=status.HTTP_403_FORBIDDEN,
            )
        