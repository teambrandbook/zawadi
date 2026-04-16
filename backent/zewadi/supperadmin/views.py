from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import User
from .serializer import UserSerializer,RoleSerializer
from .utils.permissions import has_permission,IsAdminRole
from .models import Role


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


class RoleAPIView(APIView):
    permission_classes = [IsAdminRole]
    
    def get_user(self,id):
        try:
            return Role.objects.get(id=id)
        except Role.DoesNotExist:
            return None

    def post(self, request):
        serializer = RoleSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Role created successfully",
                "data": serializer.data
            }, status=201)

        return Response(serializer.errors, status=400)
    
    def get(self, request, id=None):
        if id:
            role = self.get_user(id)

            if not role:
                return Response({"error": "Role not found"}, status=404)

            serializer = RoleSerializer(role)
            return Response(serializer.data)

        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)
    
    def patch(self, request, id):
        role = self.get_user(id)

        if not role:
            return Response({"error": "Role not found"}, status=404)

        serializer = RoleSerializer(role, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)