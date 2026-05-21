from django.urls import path

from . import views

urlpatterns = [
    path("currencies/", views.currency_list, name="currency-list"),
    path("currencies/all/", views.currency_list_all, name="currency-list-all"),
    path("categories/", views.tax_category_list, name="tax-category-list"),
    path("rates/", views.tax_rate_list, name="tax-rate-list"),
    path("rates/<int:pk>/", views.tax_rate_detail, name="tax-rate-detail"),
    path("countries/", views.tax_countries, name="tax-countries"),
]
