from django.urls import path
from .views import (
    RecipeListView,
    RecipeDetailView,
    RecipeCreateView,
    AdminRecipeListView,
    AdminRecipeStatusUpdateView,
)

urlpatterns = [
    path("", RecipeListView.as_view()),
    path("<int:pk>/", RecipeDetailView.as_view()),
    path("create/", RecipeCreateView.as_view()),
    path("admin/", AdminRecipeListView.as_view()),
    path("admin/<int:pk>/status/", AdminRecipeStatusUpdateView.as_view()),
]
