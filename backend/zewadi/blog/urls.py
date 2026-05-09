from django.urls import path
from .views import (
    BlogListAPIView,
    BlogCreateAPIView,
    BlogDetailAPIView
    
)

urlpatterns = [
    path("", BlogListAPIView.as_view()),
    path("create/", BlogCreateAPIView.as_view()),
    path("<int:blog_id>/", BlogDetailAPIView.as_view()),
]
