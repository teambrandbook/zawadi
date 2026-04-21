from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Recipe, RecipeStatus
from .serializers import (
    RecipeListSerializer,
    RecipeDetailSerializer,
    RecipeCreateSerializer,
)


class IsAdminUser(BasePermission):
    """Allow access only to users whose role is ADMIN."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


# ---------------------------------------------------------------------------
# Public / authenticated endpoints
# ---------------------------------------------------------------------------

class RecipeListView(generics.ListAPIView):
    """
    GET /api/recipes/
    Returns published recipes by default.
    Query params:
      ?category=<value>   — filter by category
      ?featured=true      — only featured recipes
      ?mine=true          — recipes authored by the authenticated user (auth required)
    """
    serializer_class = RecipeListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        request = self.request
        params = request.query_params

        mine = params.get("mine", "").lower() == "true"
        if mine:
            if not request.user.is_authenticated:
                return Recipe.objects.none()
            qs = Recipe.objects.filter(author=request.user)
        else:
            qs = Recipe.objects.filter(status=RecipeStatus.PUBLISHED)

        category = params.get("category")
        if category:
            qs = qs.filter(category=category)

        featured = params.get("featured", "").lower()
        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class RecipeDetailView(generics.RetrieveAPIView):
    """
    GET /api/recipes/<pk>/
    Returns a single recipe. Non-admin users can only see published recipes.
    """
    serializer_class = RecipeDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) == "ADMIN":
            return Recipe.objects.all()
        return Recipe.objects.filter(status=RecipeStatus.PUBLISHED)


class RecipeCreateView(generics.CreateAPIView):
    """
    POST /api/recipes/create/
    Creates a new recipe owned by the authenticated user with status=DRAFT.
    """
    serializer_class = RecipeCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status=RecipeStatus.DRAFT)


# ---------------------------------------------------------------------------
# Admin endpoints
# ---------------------------------------------------------------------------

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
