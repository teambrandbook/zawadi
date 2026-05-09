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



class IsAdminUser(BasePermission):
    """Allow access only to users whose role is ADMIN."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


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

            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Recipe updated successfully.",
                    "data": serializer.data,
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
                    "data": serializer.data,
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
