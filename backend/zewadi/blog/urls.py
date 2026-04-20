from django.urls import path
from .views import (
    BlogListView,
    BlogDetailView,
    BlogCreateView,
    AdminBlogListView,
    AdminBlogStatusUpdateView,
)

urlpatterns = [
    path("", BlogListView.as_view()),
    path("<int:pk>/", BlogDetailView.as_view()),
    path("create/", BlogCreateView.as_view()),
    path("admin/", AdminBlogListView.as_view()),
    path("admin/<int:pk>/status/", AdminBlogStatusUpdateView.as_view()),
]
