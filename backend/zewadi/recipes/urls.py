from django.urls import path
from .views import *

urlpatterns = [
    path("", RecipeListAPIView.as_view()),
    path("create/", RecipeCreateAPIView.as_view()),
    path("admin/", AdminRecipeListView.as_view()),
    path("admin/<int:pk>/status/", AdminRecipeStatusUpdateView.as_view()),
    path("<int:recipe_id>/", RecipeDetailAPIView.as_view()),
    path("published/",PublishedRecipeListAPIView.as_view())
]
