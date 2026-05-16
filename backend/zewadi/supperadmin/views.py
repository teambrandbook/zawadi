from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import OperationalError, ProgrammingError
from django.db.models import Sum, Count, F, DecimalField, ExpressionWrapper
from django.db.models.functions import TruncMonth, TruncWeek
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from .serializer import UserSerializer, UserUpdateSerializer, RoleSerializer
from .utils.permissions import has_permission, IsAdminRole
from .models import Role
from zewadi.pagination import StandardPagination


def format_serializer_errors(errors):
    messages = []

    for field, detail in errors.items():
        if isinstance(detail, (list, tuple)):
            messages.append(f"{field}: {', '.join(str(item) for item in detail)}")
        elif isinstance(detail, dict):
            messages.append(f"{field}: {format_serializer_errors(detail)}")
        else:
            messages.append(f"{field}: {detail}")

    return " ".join(messages) or "Invalid request data."


class AdminReportsAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        from orders.models import Order
        from consultant.models import ConsultationBooking
        from events.models import Event, EventRegistration
        from recipes.models import Recipe
        from blog.models import Blog

        def safe(fn, default):
            try:
                return fn()
            except (ProgrammingError, OperationalError):
                return default

        now = timezone.now()
        six_months_ago = now - timedelta(days=180)
        four_weeks_ago = now - timedelta(days=28)

        def revenue_trend():
            qs = (
                Order.objects.filter(status__in=["confirmed", "processing", "shipped", "delivered"], created_at__gte=six_months_ago)
                .annotate(month=TruncMonth("created_at"))
                .values("month")
                .annotate(value=Sum("subtotal"))
                .order_by("month")
            )
            return [{"label": row["month"].strftime("%b"), "value": float(row["value"] or 0)} for row in qs]

        def user_growth():
            qs = (
                User.objects.filter(date_joined__gte=four_weeks_ago)
                .annotate(week=TruncWeek("date_joined"))
                .values("week")
                .annotate(value=Count("id"))
                .order_by("week")
            )
            result = [{"label": f"Week {i + 1}", "value": row["value"]} for i, row in enumerate(qs)]
            while len(result) < 4:
                result.append({"label": f"Week {len(result) + 1}", "value": 0})
            return result[:4]

        def consultation_analytics():
            total = ConsultationBooking.objects.count()
            completed = ConsultationBooking.objects.filter(status="completed").count()
            cancelled = ConsultationBooking.objects.filter(status="cancelled").count()
            rate = round((completed / total * 100), 1) if total else 0
            return {"total": total, "completed": completed, "cancelled": cancelled, "completion_rate": rate}

        def events_analytics():
            total = Event.objects.count()
            registrations = EventRegistration.objects.count()
            avg = round(registrations / total, 1) if total else 0
            return {"total": total, "registrations": registrations, "avg_per_event": avg}

        def content_analytics():
            recipes = Recipe.objects.count()
            published_recipes = Recipe.objects.filter(status="PUBLISHED").count()
            blogs = Blog.objects.count()
            published_blogs = Blog.objects.filter(status="PUBLISHED").count()
            total = recipes + blogs
            published = published_recipes + published_blogs
            approval_rate = round((published / total * 100), 1) if total else 0
            return {
                "recipes": recipes,
                "blogs": blogs,
                "approval_rate": approval_rate,
                "recipes_published_pct": round((published_recipes / recipes * 100), 0) if recipes else 0,
            }

        def report_rows():
            orders_count = Order.objects.count()
            confirmed_orders = Order.objects.filter(
                status__in=["confirmed", "processing", "shipped", "delivered"]
            )
            profit_expr = ExpressionWrapper(
                (F("selling_price") - F("cost_price")) * F("quantity"),
                output_field=DecimalField(max_digits=12, decimal_places=2),
            )
            discount_expr = ExpressionWrapper(
                F("discount_amount") * F("quantity"),
                output_field=DecimalField(max_digits=12, decimal_places=2),
            )
            total_rev = float(
                confirmed_orders.aggregate(t=Sum("subtotal"))["t"] or 0
            )
            total_profit = float(
                confirmed_orders.aggregate(t=Sum(profit_expr))["t"] or 0
            )
            total_discount = float(
                confirmed_orders.aggregate(t=Sum(discount_expr))["t"] or 0
            )
            total_shipping = float(
                confirmed_orders.aggregate(t=Sum("delivery_charge"))["t"] or 0
            )
            total_tax = float(
                confirmed_orders.aggregate(t=Sum("tax_amount"))["t"] or 0
            )
            date_str = now.strftime("%b %d, %Y")
            return [
                {"id": "revenue", "report_type": "Revenue Report", "date_range": "All Time",
                 "records": str(orders_count), "total": total_rev, "status": "Ready", "updated_at": date_str},
                {"id": "profit", "report_type": "Gross Profit Report", "date_range": "All Time",
                 "records": str(orders_count), "total": total_profit, "status": "Ready", "updated_at": date_str},
                {"id": "discounts", "report_type": "Discounts Given", "date_range": "All Time",
                 "records": str(orders_count), "total": total_discount, "status": "Ready", "updated_at": date_str},
                {"id": "charges", "report_type": "Tax & Shipping", "date_range": "All Time",
                 "records": str(orders_count), "total": total_tax + total_shipping, "status": "Ready", "updated_at": date_str},
                {"id": "users", "report_type": "User Analytics", "date_range": "All Time",
                 "records": str(User.objects.count()), "status": "Ready", "updated_at": date_str},
                {"id": "content", "report_type": "Content Performance", "date_range": "All Time",
                 "records": str(Recipe.objects.count() + Blog.objects.count()),
                 "status": "Ready", "updated_at": date_str},
            ]

        return Response({
            "revenue_trend": safe(revenue_trend, []),
            "user_growth": safe(user_growth, [{"label": f"Week {i+1}", "value": 0} for i in range(4)]),
            "analytics": {
                "consultations": safe(consultation_analytics, {"total": 0, "completed": 0, "cancelled": 0, "completion_rate": 0}),
                "events": safe(events_analytics, {"total": 0, "registrations": 0, "avg_per_event": 0}),
                "content": safe(content_analytics, {"recipes": 0, "blogs": 0, "approval_rate": 0, "recipes_published_pct": 0}),
            },
            "report_rows": safe(report_rows, []),
        }, status=status.HTTP_200_OK)


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
            lambda: float(
                Order.objects.filter(
                    status__in=["confirmed", "processing", "shipped", "delivered"]
                ).aggregate(t=Sum("subtotal"))["t"] or 0
            )
        )
        total_shipping = safe_query(
            lambda: float(
                Order.objects.filter(
                    status__in=["confirmed", "processing", "shipped", "delivered"]
                ).aggregate(t=Sum("delivery_charge"))["t"] or 0
            )
        )
        total_tax = safe_query(
            lambda: float(
                Order.objects.filter(
                    status__in=["confirmed", "processing", "shipped", "delivered"]
                ).aggregate(t=Sum("tax_amount"))["t"] or 0
            )
        )

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_events": total_events,
            "total_consultations": total_consultations,
            "total_revenue": float(total_revenue),
            "total_shipping": float(total_shipping),
            "total_tax": float(total_tax),
        }, status=status.HTTP_200_OK)


class UserListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not has_permission(user, "users", "view"):
            return Response(
                {"error": "You do not have permission to view users"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # exclude consultants; select_related to avoid N+1 on communityuser
        users = User.objects.exclude(role="CONSULTANT").select_related("communityuser")

        paginator = StandardPagination()
        page = paginator.paginate_queryset(users, request)

        if page is not None:
            return paginator.get_paginated_response(
                UserSerializer(page, many=True).data
            )

        return Response(
            UserSerializer(users, many=True).data,
            status=status.HTTP_200_OK
        )


class UserDetailAPIView(APIView):
    """GET /supperadmin/users/{id}/ — single user detail
    PATCH /supperadmin/users/{id}/ — partial update (admin only)
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, user_id):
        try:
            return User.objects.select_related("communityuser").get(pk=user_id)
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

    def delete(self, request, user_id):
        if not has_permission(request.user, "users", "delete"):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(user_id)

        if obj is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()

        return Response(
            {"message": "User deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )
    
class RoleAPIView(APIView):
    permission_classes = [IsAdminRole]
    
    def get_user(self, id):
        try:
            return Role.objects.get(id=id)
        except Role.DoesNotExist:
            return None

    def post(self, request):

        user = request.user

        if not user.role == "ADMIN":
            return Response(
                {"detail": "You do not have permission to create roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = RoleSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Role created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "message": format_serializer_errors(serializer.errors),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    def get(self, request, id=None):

        user = request.user

        if not user.role == "ADMIN":
            return Response(
                {"detail": "You do not have permission to view roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if id:
            role = self.get_user(id)

            if not role:
                return Response(
                    {"error": "Role not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = RoleSerializer(role)

            return Response(serializer.data)

        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)

        return Response(serializer.data)
    
    def patch(self, request, id):

        user = request.user

        if not user.role == "ADMIN":
            return Response(
                {"detail": "You do not have permission to update roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        role = self.get_user(id)

        if not role:
            return Response(
                {"error": "Role not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RoleSerializer(
            role,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Role updated successfully",
                    "data": serializer.data
                }
            )

        return Response(
            {
                "message": format_serializer_errors(serializer.errors),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
