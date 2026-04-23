from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import OperationalError, ProgrammingError
from accounts.models import User
from .serializer import UserSerializer, UserUpdateSerializer, RoleSerializer
from .utils.permissions import has_permission, IsAdminRole
from .models import Role


class AdminStatsAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        from orders.models import Order
        from product.models import Product
        from events.models import Event
        from consultant.models import ConsultationBooking

        def safe_query(query_fn, default=0):
            try:
                return query_fn()
            except (ProgrammingError, OperationalError):
                # Some apps in this project currently have no DB migrations.
                # Return zero stats instead of failing the entire dashboard API.
                return default

        total_users = safe_query(lambda: User.objects.count())
        total_orders = safe_query(lambda: Order.objects.count())
        total_products = safe_query(lambda: Product.objects.count())
        total_events = safe_query(lambda: Event.objects.count())
        total_consultations = safe_query(lambda: ConsultationBooking.objects.count())
        total_revenue = safe_query(
            lambda: sum(o.total_amount for o in Order.objects.filter(payment_status="paid")) or 0
        )

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_events": total_events,
            "total_consultations": total_consultations,
            "total_revenue": float(total_revenue),
        }, status=status.HTTP_200_OK)


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


class UserDetailAPIView(APIView):
    """GET /supperadmin/users/{id}/ — single user detail
    PATCH /supperadmin/users/{id}/ — partial update (admin only)
    """

    def get_object(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def get(self, request, user_id):
        if not has_permission(request.user, "users", "view"):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        obj = self.get_object(user_id)
        if obj is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(obj).data)

    def patch(self, request, user_id):
        if not has_permission(request.user, "users", "edit"):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        obj = self.get_object(user_id)
        if obj is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserUpdateSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(obj).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
