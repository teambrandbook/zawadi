from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import User
from .serializer import UserSerializer,RoleSerializer
from .utils.permissions import has_permission,IsAdminRole
from .models import Role


class AdminStatsAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        from orders.models import Order
        from product.models import Product
        from events.models import Event
        from consultant.models import ConsultationBooking

        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_events = Event.objects.count()
        total_consultations = ConsultationBooking.objects.count()
        total_revenue = sum(
            o.total_amount for o in Order.objects.filter(payment_status="paid")
        ) or 0

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