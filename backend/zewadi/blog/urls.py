from django.urls import path
from .views import (
    BlogListAPIView,
    BlogCreateAPIView,
    BlogDetailAPIView,
    AdminBlogStatusUpdateAPIView
    
)

urlpatterns = [
    path("", BlogListAPIView.as_view()),
    path("create/", BlogCreateAPIView.as_view()),
    path("admin/<str:blog_id>/status/", AdminBlogStatusUpdateAPIView.as_view()),
    path("<str:blog_id>/", BlogDetailAPIView.as_view()),
]
