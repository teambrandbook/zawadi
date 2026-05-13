from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from supperadmin.utils.permissions import has_permission
from .models import Recipe, RecipeStatus
from .serializers import (
    RecipeListSerializer,
    RecipeDetailSerializer,
    RecipeCreateSerializer,
)
from django.utils import timezone
from django.db.models import Q
from django.core.cache import cache


def request_bool(value):
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"true", "1", "yes", "on"}


def requested_recipe_status(value):
    cleaned = str(value or "").strip().lower()
    if cleaned in {RecipeStatus.PENDING, RecipeStatus.DRAFT}:
        return cleaned
    return None


class IsAdminUser(BasePermission):
    """Allow users who can manage recipes in the admin dashboard."""

    def has_permission(self, request, view):
        return has_permission(request.user, "recipes", "create")


# ---------------------------------------------------------------------------
# Public / authenticated endpoints
# ---------------------------------------------------------------------------

class RecipeListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):


        if has_permission(request.user, "recipes", "create"):

            recipes = Recipe.objects.select_related(
                "author"
            ).all()

        elif request.user.role == "COMMUNITY_USER":

            recipes = Recipe.objects.select_related(
                "author"
            ).filter(author=request.user)


        else:

            return Response(
                {
                    "error": "Permission denied."
                },

                status=status.HTTP_403_FORBIDDEN
            )

        # --- Search ---
        search = request.query_params.get("search")
        if search:
            recipes = recipes.filter(
                Q(title__icontains=search) | Q(short_description__icontains=search)
            )

        # --- Category filter ---
        category = request.query_params.get("category")
        if category:
            recipes = recipes.filter(category__iexact=category)

        # --- Ordering ---
        _SAFE_ORDER_FIELDS = {
            "title", "-title",
            "created_at", "-created_at",
        }
        ordering = request.query_params.get("ordering", "-created_at")
        if ordering not in _SAFE_ORDER_FIELDS:
            ordering = "-created_at"
        recipes = recipes.order_by(ordering)

        serializer = RecipeListSerializer(
            recipes,
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "success": True,
                "count": recipes.count(),
                "data": serializer.data,
            },

            status=status.HTTP_200_OK
        )

class RecipeDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    # --------------------------------
    # GET RECIPE
    # --------------------------------
    def get_recipe(self, request, recipe_id):

        # admin
        if has_permission(request.user, "recipes", "create"):

            return Recipe.objects.filter(
                id=recipe_id
            ).first()

        # community user
        elif request.user.role == "COMMUNITY_USER":

            return Recipe.objects.filter(
                id=recipe_id,
                author=request.user
            ).first()

        return None

    # --------------------------------
    # GET
    # --------------------------------
    def get(self, request, recipe_id):

        recipe = self.get_recipe(request, recipe_id)

        if not recipe:

            return Response(
                {
                    "error": "Recipe not found."
                },

                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RecipeDetailSerializer(
            recipe,
            context={"request": request},
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            },

            status=status.HTTP_200_OK
        )

    # --------------------------------
    # PATCH (EDIT)
    # --------------------------------
    def patch(self, request, recipe_id):

        recipe = self.get_recipe(request, recipe_id)

        if not recipe:

            return Response(
                {
                    "error": "Recipe not found."
                },

                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RecipeCreateSerializer(
            recipe,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():

            updated_recipe = serializer.save()

            if has_permission(request.user, "recipes", "create") and updated_recipe.is_featured:
                updated_recipe.status = RecipeStatus.DRAFT
                updated_recipe.published_at = None
                updated_recipe.approved_by = None
                updated_recipe.approved_at = None
                updated_recipe.save(
                    update_fields=[
                        "status",
                        "published_at",
                        "approved_by",
                        "approved_at",
                        "updated_at",
                    ]
                )
            elif request.user.role == "COMMUNITY_USER":
                new_status = requested_recipe_status(request.data.get("status"))
                if new_status:
                    updated_recipe.status = new_status
                    updated_recipe.published_at = None
                    updated_recipe.approved_by = None
                    updated_recipe.approved_at = None
                    updated_recipe.rejected_at = None
                    updated_recipe.rejection_reason = None
                    updated_recipe.save(
                        update_fields=[
                            "status",
                            "published_at",
                            "approved_by",
                            "approved_at",
                            "rejected_at",
                            "rejection_reason",
                            "updated_at",
                        ]
                    )

            return Response(
                {
                    "success": True,
                    "message": "Recipe updated successfully.",
                    "data": RecipeDetailSerializer(
                        updated_recipe,
                        context={"request": request},
                    ).data,
                },

                status=status.HTTP_200_OK
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    # --------------------------------
    # DELETE
    # --------------------------------
    def delete(self, request, recipe_id):

        recipe = self.get_recipe(request, recipe_id)

        if not recipe:

            return Response(
                {
                    "error": "Recipe not found."
                },

                status=status.HTTP_404_NOT_FOUND
            )

        recipe.delete()

        return Response(
            {
                "success": True,
                "message": "Recipe deleted successfully.",
            },

            status=status.HTTP_200_OK
        )




class RecipeCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = RecipeCreateSerializer(data=request.data)

        if serializer.is_valid():

            
            if has_permission(request.user, "recipes", "create"):
                is_featured = request_bool(request.data.get("is_featured"))

                if is_featured:
                    recipe = serializer.save(
                        author=request.user,
                        status=RecipeStatus.DRAFT,
                        published_at=None,
                        approved_by=None,
                        approved_at=None,
                    )
                else:
                    recipe = serializer.save(
                        author=request.user,
                        status=RecipeStatus.PUBLISHED,
                        published_at=timezone.now(),
                        approved_by=request.user,
                        approved_at=timezone.now(),
                    )

     
            elif request.user.role == "COMMUNITY_USER":

                recipe = serializer.save(
                    author=request.user,
                    status=RecipeStatus.PENDING,
                )

            else:

                return Response(
                    {
                        "error": "Permission denied."
                    },

                    status=status.HTTP_403_FORBIDDEN
                )

            return Response(
                {
                    "success": True,
                    "message": "Recipe created successfully",
                    "recipe_status": recipe.status,
                    "data": RecipeDetailSerializer(
                        recipe,
                        context={"request": request},
                    ).data,
                },

                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },

            status=status.HTTP_400_BAD_REQUEST
        )



class AdminRecipeListView(generics.ListAPIView):
    """
    GET /api/recipes/admin/
    Returns all recipes. Optional ?status=<value> filter.
    """
    serializer_class = RecipeListSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Recipe.objects.all()
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs


class AdminRecipeStatusUpdateView(APIView):
    """
    PATCH /api/recipes/admin/<pk>/status/
    Updates the status field of a recipe.
    Expected body: { "status": "published" | "draft" }
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response(
                {"detail": "Recipe not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get("status")
        valid_statuses = [choice[0] for choice in RecipeStatus.choices]
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Choose from: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recipe.status = new_status
        recipe.save(update_fields=["status", "updated_at"])
        return Response(
            {"id": recipe.id, "status": recipe.status},
            status=status.HTTP_200_OK,
        )


# in website

class PublishedRecipeListAPIView(APIView):
    """
    GET /api/recipes/published/

    Public API:
    Returns all published recipes.
    Authentication is not required.
    """

    permission_classes = [AllowAny]  # No authentication required

    def get(self, request):
        try:
            cached = cache.get("published_recipes")
            if cached is not None:
                return Response(cached, status=status.HTTP_200_OK)
        except Exception:
            pass

        recipes = Recipe.objects.select_related("author").filter(
            status=RecipeStatus.PUBLISHED
        )
        serializer = RecipeDetailSerializer(recipes, many=True, context={"request": request})
        data = {
            "success": True,
            "count": recipes.count(),
            "data": serializer.data,
        }

        try:
            cache.set("published_recipes", data, timeout=300)
        except Exception:
            pass

        return Response(data, status=status.HTTP_200_OK)
