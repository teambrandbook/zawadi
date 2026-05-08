from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission

from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction

from .models import CartItem, Order, OrderReview
from .serializers import (
    CartItemSerializer,
    OrderCreateSerializer,
    OrderListSerializer,
    OrderDetailSerializer,
    OrderStatusUpdateSerializer,
    OrderReviewSerializer,
)
from product.models import Product, ProductStatus, ProductVariant, StockStatus
from zewadi.pagination import StandardPagination


FREE_SHIPPING_THRESHOLD = Decimal("50.00")
STANDARD_SHIPPING_CHARGE = Decimal("5.00")
TAX_RATE = Decimal("0.08")


def _money(value):
    return Decimal(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _cart_queryset(user):
    return (
        CartItem.objects.filter(user=user)
        .select_related("product", "variant")
        .order_by("-updated_at")
    )


def _max_available_quantity(product, variant=None):
    if variant:
        return variant.stock
    return product.stock_quantity


def _update_product_stock_status(product):
    if product.stock_quantity <= 0:
        product.stock_status = StockStatus.OUT_OF_STOCK
    elif product.enable_low_stock_alerts and product.stock_quantity <= product.low_stock_alert:
        product.stock_status = StockStatus.LOW_STOCK
    else:
        product.stock_status = StockStatus.IN_STOCK
    product.save(update_fields=["stock_quantity", "stock_status", "updated_at"])


def _lock_product_for_order(product_id, variant_id=None):
    product = Product.objects.select_for_update().get(
        pk=product_id,
        product_status=ProductStatus.ACTIVE,
    )
    variant = None
    if variant_id:
        variant = ProductVariant.objects.select_for_update().get(
            pk=variant_id,
            product=product,
        )
    return product, variant


def _validate_and_decrement_stock(product, variant, quantity):
    if product.allow_orders_when_out_of_stock:
        return

    available_quantity = _max_available_quantity(product, variant)
    if product.stock_status == StockStatus.OUT_OF_STOCK or available_quantity <= 0:
        raise ValueError(f"{product.product_name} is out of stock.")
    if quantity > available_quantity:
        raise ValueError(
            f"Only {available_quantity} units of {product.product_name} are available."
        )

    if variant:
        variant.stock -= quantity
        variant.save(update_fields=["stock"])
        return

    product.stock_quantity -= quantity
    _update_product_stock_status(product)


def _cart_summary(items):
    subtotal = _money(sum((item.line_total for item in items), Decimal("0.00")))
    shipping = Decimal("0.00") if subtotal == 0 or subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING_CHARGE
    tax = _money(subtotal * TAX_RATE)
    total = _money(subtotal + shipping + tax)
    item_count = sum(item.quantity for item in items)
    return {
        "item_count": item_count,
        "subtotal": f"{subtotal:.2f}",
        "shipping": f"{shipping:.2f}",
        "tax": f"{tax:.2f}",
        "total": f"{total:.2f}",
        "free_shipping_unlocked": subtotal >= FREE_SHIPPING_THRESHOLD,
    }


def _cart_response(request):
    items = list(_cart_queryset(request.user))
    return {
        "items": CartItemSerializer(items, many=True, context={"request": request}).data,
        "summary": _cart_summary(items),
    }


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
        if request.data.get("payment_method") != "cod":
            return Response(
                {"detail": "Only cash on delivery is available for this checkout."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data.get("product_id")
            variant_id = serializer.validated_data.get("variant_id")
            quantity = serializer.validated_data.get("quantity") or 1
            try:
                with transaction.atomic():
                    if product_id:
                        product, variant = _lock_product_for_order(product_id, variant_id)
                        _validate_and_decrement_stock(product, variant, quantity)
                    serializer.save(user=request.user)
            except (Product.DoesNotExist, ProductVariant.DoesNotExist):
                return Response(
                    {"detail": "Product not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
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


class CartView(APIView):
    """GET /api/orders/cart/ — retrieve the authenticated user's cart."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(_cart_response(request), status=status.HTTP_200_OK)

    def delete(self, request):
        _cart_queryset(request.user).delete()
        return Response(_cart_response(request), status=status.HTTP_200_OK)


class CartItemCreateView(APIView):
    """POST /api/orders/cart/items/ — add a product or variant to cart."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        variant_id = request.data.get("variant_id")
        try:
            quantity = int(request.data.get("quantity") or 1)
        except (TypeError, ValueError):
            return Response({"detail": "Quantity must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=product_id, product_status=ProductStatus.ACTIVE)
        except (Product.DoesNotExist, TypeError, ValueError):
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        if product.stock_status == StockStatus.OUT_OF_STOCK and not product.allow_orders_when_out_of_stock:
            return Response({"detail": "Product is out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        variant = None
        if variant_id:
            try:
                variant = ProductVariant.objects.get(pk=variant_id, product=product)
            except (ProductVariant.DoesNotExist, TypeError, ValueError):
                return Response({"detail": "Product variant not found."}, status=status.HTTP_404_NOT_FOUND)

        max_quantity = _max_available_quantity(product, variant)
        if not product.allow_orders_when_out_of_stock and max_quantity <= 0:
            return Response({"detail": "Product is out of stock."}, status=status.HTTP_400_BAD_REQUEST)
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            variant=variant,
            defaults={"quantity": 0},
        )
        next_quantity = cart_item.quantity + quantity
        if not product.allow_orders_when_out_of_stock and max_quantity > 0:
            next_quantity = min(next_quantity, max_quantity)
        cart_item.quantity = max(1, next_quantity)
        cart_item.save()

        response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(_cart_response(request), status=response_status)


class CartItemDetailView(APIView):
    """PATCH/DELETE /api/orders/cart/items/<id>/ — update or remove a cart item."""

    permission_classes = [IsAuthenticated]

    def _get_item(self, request, pk):
        try:
            return _cart_queryset(request.user).get(pk=pk)
        except CartItem.DoesNotExist:
            return None

    def patch(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            quantity = int(request.data.get("quantity") or item.quantity)
        except (TypeError, ValueError):
            return Response({"detail": "Quantity must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)

        max_quantity = _max_available_quantity(item.product, item.variant)
        if not item.product.allow_orders_when_out_of_stock and max_quantity <= 0:
            return Response({"detail": "Product is out of stock."}, status=status.HTTP_400_BAD_REQUEST)
        if not item.product.allow_orders_when_out_of_stock and max_quantity > 0:
            quantity = min(quantity, max_quantity)
        item.quantity = quantity
        item.save()
        return Response(_cart_response(request), status=status.HTTP_200_OK)

    def delete(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(_cart_response(request), status=status.HTTP_200_OK)


class CartCheckoutView(APIView):
    """POST /api/orders/cart/checkout/ — create orders for all cart items."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        required_fields = [
            "full_name",
            "phone",
            "email",
            "city",
            "postal_code",
            "address",
            "payment_method",
        ]
        missing = [field for field in required_fields if not str(request.data.get(field, "")).strip()]
        if missing:
            return Response(
                {"detail": "Please complete all required delivery fields.", "missing": missing},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.data.get("payment_method") != "cod":
            return Response(
                {"detail": "Only cash on delivery is available for this checkout."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                cart_items = list(_cart_queryset(request.user).select_for_update(of=("self",)))
                if not cart_items:
                    return Response({"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

                summary = _cart_summary(cart_items)
                subtotal = Decimal(summary["subtotal"])
                shipping = Decimal(summary["shipping"])
                tax = Decimal(summary["tax"])
                created_orders = []

                for index, item in enumerate(cart_items):
                    product, variant = _lock_product_for_order(item.product_id, item.variant_id)
                    if product.product_status != ProductStatus.ACTIVE:
                        return Response(
                            {"detail": f"{product.product_name} is no longer available."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    _validate_and_decrement_stock(product, variant, item.quantity)

                    line_subtotal = _money(item.line_total)
                    if subtotal > 0:
                        ratio = line_subtotal / subtotal
                        allocated_shipping = _money(shipping * ratio)
                        allocated_tax = _money(tax * ratio)
                    else:
                        allocated_shipping = Decimal("0.00")
                        allocated_tax = Decimal("0.00")

                    if index == len(cart_items) - 1:
                        used_shipping = sum((Decimal(order.delivery_charge) for order in created_orders), Decimal("0.00"))
                        used_tax = sum(
                            (
                                Decimal(order.total_amount) - Decimal(order.subtotal) - Decimal(order.delivery_charge)
                                for order in created_orders
                            ),
                            Decimal("0.00"),
                        )
                        allocated_shipping = _money(shipping - used_shipping)
                        allocated_tax = _money(tax - used_tax)

                    pack_name = variant.variant_name if variant else "Standard Pack"
                    serializer = OrderCreateSerializer(
                        data={
                            "product_name": product.product_name,
                            "pack_name": pack_name,
                            "pack_price": f"{Decimal(item.unit_price):.2f}",
                            "quantity": item.quantity,
                            "subtotal": f"{line_subtotal:.2f}",
                            "delivery_charge": f"{allocated_shipping:.2f}",
                            "total_amount": f"{_money(line_subtotal + allocated_shipping + allocated_tax):.2f}",
                            "full_name": request.data["full_name"],
                            "phone": request.data["phone"],
                            "email": request.data["email"],
                            "city": request.data["city"],
                            "postal_code": request.data["postal_code"],
                            "address": request.data["address"],
                            "instructions": request.data.get("instructions", ""),
                            "payment_method": request.data["payment_method"],
                        }
                    )
                    serializer.is_valid(raise_exception=True)
                    created_orders.append(serializer.save(user=request.user))

                _cart_queryset(request.user).delete()
        except (Product.DoesNotExist, ProductVariant.DoesNotExist):
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {
                "order_ids": [order.order_id for order in created_orders],
                "primary_order_id": created_orders[0].order_id,
            },
            status=status.HTTP_201_CREATED,
        )


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
