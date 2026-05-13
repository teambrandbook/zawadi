import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.filters import OrderingFilter, SearchFilter
from django.core.cache import cache
from django.db import connection
from django.db.models import Q

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


def _variants_subquery_sql():
    """
    Returns a correlated subquery expression (as a string) that fetches all variants
    for a product row and aggregates them as a JSON array in a single SQL query.
    Works with both SQLite and PostgreSQL.
    """
    vendor = connection.vendor
    if vendor == "postgresql":
        return """
            (SELECT COALESCE(
                json_agg(json_build_object(
                    'id', v.id,
                    'variant_name', v.variant_name,
                    'sku', v.sku,
                    'price', v.price::text,
                    'stock', v.stock
                ) ORDER BY v.id),
                '[]'::json
            )
            FROM product_productvariant v WHERE v.product_id = "product_product".id)
        """
    else:
        # SQLite
        return """
            (SELECT COALESCE(
                json_group_array(json_object(
                    'id', v.id,
                    'variant_name', v.variant_name,
                    'sku', v.sku,
                    'price', CAST(v.price AS TEXT),
                    'stock', v.stock
                )),
                '[]'
            )
            FROM product_productvariant v WHERE v.product_id = "product_product"."id")
        """


def _fetch_products_single_query(qs, request):
    """
    Fetch products with their variants in a single SQL query using a correlated
    JSON subquery. Returns a list of serialized product dicts ready for caching.
    """
    from django.db.models.expressions import RawSQL
    from django.db.models import CharField

    qs = qs.annotate(
        variants_json=RawSQL(_variants_subquery_sql(), [], output_field=CharField())
    )

    result = []
    for product in qs:
        # Parse the JSON variants string
        try:
            variants_data = json.loads(product.variants_json or "[]")
            # SQLite json_group_array returns [null] for no rows in some versions
            if variants_data and variants_data[0] is None:
                variants_data = []
        except (json.JSONDecodeError, TypeError):
            variants_data = []

        image_url = None
        if product.image:
            try:
                image_url = request.build_absolute_uri(product.image.url)
            except Exception:
                image_url = product.image.url if product.image else None

        result.append({
            "id": product.id,
            "product_name": product.product_name,
            "product_subtitle": product.product_subtitle,
            "product_code": product.product_code,
            "category": product.category,
            "product_status": product.product_status,
            "image": image_url,
            "short_description": product.short_description,
            "full_description": product.full_description,
            "key_ingredients": product.key_ingredients,
            "health_benefits": product.health_benefits,
            "base_price": str(product.base_price),
            "sale_price": str(product.sale_price) if product.sale_price else None,
            "currency": product.currency,
            "stock_quantity": product.stock_quantity,
            "low_stock_alert": product.low_stock_alert,
            "stock_status": product.stock_status,
            "allow_orders_when_out_of_stock": product.allow_orders_when_out_of_stock,
            "enable_low_stock_alerts": product.enable_low_stock_alerts,
            "variants": variants_data,
            "created_at": product.created_at.isoformat() if product.created_at else None,
            "updated_at": product.updated_at.isoformat() if product.updated_at else None,
        })
    return result


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

        # Only cache unauthenticated / community-user (public) requests.
        # Admin requests always hit Postgres so they see unpublished products.
        category = request.query_params.get("category", "")
        search = request.query_params.get("search", "")
        ordering = request.query_params.get("ordering", "-created_at")

        if not can_manage:
            cache_key = f"product_list:{category}:{search}:{ordering}"
            try:
                cached = cache.get(cache_key)
                if cached is not None:
                    return Response(cached)
            except Exception:
                cached = None

            # Build public queryset
            products = Product.objects.filter(product_status=ProductStatus.ACTIVE)

            if category:
                products = products.filter(category__iexact=category)

            if search:
                products = products.filter(
                    Q(product_name__icontains=search)
                    | Q(short_description__icontains=search)
                    | Q(full_description__icontains=search)
                )

            allowed_orderings = {
                "base_price", "-base_price",
                "product_name", "-product_name",
                "created_at", "-created_at",
            }
            if ordering in allowed_orderings:
                products = products.order_by(ordering)
            else:
                products = products.order_by("-created_at")

            # Single query: fetch products + variants via JSON annotation
            items = _fetch_products_single_query(products, request)
            response_data = {
                "count": len(items),
                "next": None,
                "previous": None,
                "results": items,
            }
            try:
                cache.set(cache_key, response_data, timeout=180)
            except Exception:
                pass
            return Response(response_data)

        # Admin path — bypass cache, use ORM with prefetch
        products = Product.objects.prefetch_related("variants")

        if category:
            products = products.filter(category__iexact=category)

        if search:
            products = products.filter(
                Q(product_name__icontains=search)
                | Q(short_description__icontains=search)
                | Q(full_description__icontains=search)
            )

        allowed_orderings = {
            "base_price", "-base_price",
            "product_name", "-product_name",
            "created_at", "-created_at",
        }
        if ordering in allowed_orderings:
            products = products.order_by(ordering)
        else:
            products = products.order_by("-created_at")

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

        payload = request.data.copy()
        if "image" not in payload and request.FILES.get("image"):
            payload["image"] = request.FILES["image"]

        serializer = ProductCreateSerializer(data=payload, context={"request": request})
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

        if not can_manage:
            cache_key = f"product_detail:{pk}"
            try:
                cached = cache.get(cache_key)
                if cached is not None:
                    return Response(cached)
            except Exception:
                cached = None

            # Single query: fetch product + variants via JSON annotation
            qs = Product.objects.filter(pk=pk, product_status=ProductStatus.ACTIVE)
            items = _fetch_products_single_query(qs, request)
            if not items:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

            response_data = items[0]
            try:
                cache.set(cache_key, response_data, timeout=600)
            except Exception:
                pass
            return Response(response_data)

        # Admin path — bypass cache
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

        payload = request.data.copy()
        if "image" not in payload and request.FILES.get("image"):
            payload["image"] = request.FILES["image"]

        serializer = ProductCreateSerializer(
            product, data=payload, partial=True, context={"request": request}
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
