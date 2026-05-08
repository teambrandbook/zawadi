from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.OrderCreateView.as_view()),
    path("cart/", views.CartView.as_view()),
    path("cart/items/", views.CartItemCreateView.as_view()),
    path("cart/items/<int:pk>/", views.CartItemDetailView.as_view()),
    path("cart/checkout/", views.CartCheckoutView.as_view()),
    path("", views.OrderListView.as_view()),
    path("admin/", views.AdminOrderListView.as_view()),
    path("admin/<str:order_id>/status/", views.AdminOrderStatusUpdateView.as_view()),
    path("<str:order_id>/", views.OrderDetailView.as_view()),
    path("<str:order_id>/review/", views.OrderReviewCreateView.as_view()),
]
