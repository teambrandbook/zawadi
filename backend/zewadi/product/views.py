from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Product, ProductStatus, ProductVariant
from .serializers import ProductSerializer, ProductCreateSerializer, ProductVariantSerializer
from supperadmin.utils.permissions import has_permission
from zewadi.pagination import StandardPagination


def _is_community_user(user):
    return bool(
        user
        and getattr(user, "is_authenticated", False)
        and str(getattr(user, "role", "")).upper() == "COMMUNITY_USER"
    )


def _can_manage_products(user):
    return has_permission(user, "products", "view")


def _can_view_public_products(user):
    # Public/catalog browsing is allowed for guests and community users.
    return not getattr(user, "is_authenticated", False) or _is_community_user(user)


class ProductListCreateView(APIView):
    """
    GET  /api/products/          — list all products (requires products.view permission)
    POST /api/products/          — create a product  (requires products.create permission)
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [AllowAny]

    def get(self, request):
        can_manage = _can_manage_products(request.user)
        if not can_manage and not _can_view_public_products(request.user):
            return Response(
                {"error": "You do not have permission to view products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        products = Product.objects.prefetch_related("variants").order_by("id")
        if not can_manage:
            products = products.filter(product_status=ProductStatus.ACTIVE)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(products, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True, context={"request": request})
            return paginator.get_paginated_response(serializer.data)
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not has_permission(request.user, "products", "create"):
            return Response(
                {"error": "You do not have permission to create products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProductCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            product = serializer.save()
            out = ProductSerializer(product, context={"request": request})
            return Response(
                {"message": "Product created successfully", "data": out.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    """
    GET    /api/products/<id>/   — retrieve a single product
    PATCH  /api/products/<id>/   — partial update
    DELETE /api/products/<id>/   — delete
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [AllowAny]

    def _get_object(self, pk):
        try:
            return Product.objects.prefetch_related("variants").get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        can_manage = _can_manage_products(request.user)
        if not can_manage and not _can_view_public_products(request.user):
            return Response(
                {"error": "You do not have permission to view products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        product = self._get_object(pk)
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        if not can_manage and product.product_status != ProductStatus.ACTIVE:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        if not has_permission(request.user, "products", "edit"):
            return Response(
                {"error": "You do not have permission to edit products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        product = self._get_object(pk)
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductCreateSerializer(
            product, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            product = serializer.save()
            out = ProductSerializer(product, context={"request": request})
            return Response(
                {"message": "Product updated successfully", "data": out.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not has_permission(request.user, "products", "delete"):
            return Response(
                {"error": "You do not have permission to delete products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        product = self._get_object(pk)
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)


class ProductVariantListCreateView(APIView):
    """
    GET  /api/products/<product_id>/variants/   — list variants for a product
    POST /api/products/<product_id>/variants/   — add a variant
    """
    permission_classes = [AllowAny]

    def _get_product(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, product_id):
        can_manage = _can_manage_products(request.user)
        if not can_manage and not _can_view_public_products(request.user):
            return Response(
                {"error": "You do not have permission to view products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        product = self._get_product(product_id)
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        if not can_manage and product.product_status != ProductStatus.ACTIVE:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariantSerializer(product.variants.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        if not has_permission(request.user, "products", "create"):
            return Response(
                {"error": "You do not have permission to create product variants"},
                status=status.HTTP_403_FORBIDDEN,
            )

        product = self._get_product(product_id)
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(
                {"message": "Variant added successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductVariantDetailView(APIView):
    """
    PATCH  /api/products/<product_id>/variants/<variant_id>/
    DELETE /api/products/<product_id>/variants/<variant_id>/
    """

    def _get_variant(self, product_id, variant_id):
        try:
            return ProductVariant.objects.get(pk=variant_id, product_id=product_id)
        except ProductVariant.DoesNotExist:
            return None

    def patch(self, request, product_id, variant_id):
        if not has_permission(request.user, "products", "edit"):
            return Response(
                {"error": "You do not have permission to edit product variants"},
                status=status.HTTP_403_FORBIDDEN,
            )

        variant = self._get_variant(product_id, variant_id)
        if not variant:
            return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariantSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Variant updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, product_id, variant_id):
        if not has_permission(request.user, "products", "delete"):
            return Response(
                {"error": "You do not have permission to delete product variants"},
                status=status.HTTP_403_FORBIDDEN,
            )

        variant = self._get_variant(product_id, variant_id)
        if not variant:
            return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        variant.delete()
        return Response({"message": "Variant deleted successfully"}, status=status.HTTP_200_OK)
