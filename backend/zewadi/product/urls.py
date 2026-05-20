from django.urls import path
from .views import (
    ProductCategoryDetailView,
    ProductCategoryListCreateView,
    ProductListCreateView,
    ProductDetailView,
    ProductVariantListCreateView,
    ProductVariantDetailView,
)

urlpatterns = [
    # Products
    path("categories/", ProductCategoryListCreateView.as_view(), name="product-category-list-create"),
    path("categories/<int:pk>/", ProductCategoryDetailView.as_view(), name="product-category-detail"),
    path("", ProductListCreateView.as_view(), name="product-list-create"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product-detail"),

    # Variants nested under a product
    path("<int:product_id>/variants/", ProductVariantListCreateView.as_view(), name="product-variant-list-create"),
    path("<int:product_id>/variants/<int:variant_id>/", ProductVariantDetailView.as_view(), name="product-variant-detail"),
]
