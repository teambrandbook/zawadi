from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission

from .models import Order, OrderReview
from .serializers import (
    OrderCreateSerializer,
    OrderListSerializer,
    OrderDetailSerializer,
    OrderStatusUpdateSerializer,
    OrderReviewSerializer,
)
from zewadi.pagination import StandardPagination


class IsAdminUser(BasePermission):
    """Allows access only to users whose role is ADMIN."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


# ---------------------------------------------------------------------------
# Customer-facing views
# ---------------------------------------------------------------------------

class OrderCreateView(APIView):
    """POST /api/orders/create/ — place a new order."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderListView(APIView):
    """GET /api/orders/ — list the authenticated user's own orders."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(orders, request)
        if page is not None:
            return paginator.get_paginated_response(OrderListSerializer(page, many=True).data)
        return Response(OrderListSerializer(orders, many=True).data)


class OrderDetailView(APIView):
    """GET /api/orders/<order_id>/ — retrieve a single order.
    Accessible by the order owner or an admin."""

    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if order.user != request.user and request.user.role != "ADMIN":
            return Response(
                {"detail": "You do not have permission to view this order."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)


class OrderReviewCreateView(APIView):
    """POST /api/orders/<order_id>/review/ — submit a review for a delivered order."""

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if order.user != request.user:
            return Response(
                {"detail": "You can only review your own orders."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if order.status != "delivered":
            return Response(
                {"detail": "You can only review a delivered order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hasattr(order, "review"):
            return Response(
                {"detail": "A review already exists for this order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["order"] = order.pk

        serializer = OrderReviewSerializer(
            data=data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Admin views
# ---------------------------------------------------------------------------

class AdminOrderListView(APIView):
    """GET /api/orders/admin/ — list all orders; supports ?status= filter."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = Order.objects.all()
        status_filter = request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            return paginator.get_paginated_response(OrderListSerializer(page, many=True).data)
        return Response(OrderListSerializer(queryset, many=True).data)


class AdminOrderStatusUpdateView(APIView):
    """PATCH /api/orders/admin/<order_id>/status/ — update an order's status."""

    permission_classes = [IsAdminUser]

    def patch(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderStatusUpdateSerializer(
            order, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
