from django.utils import timezone
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from .models import Blog, BlogStatus
from .serializers import (
    BlogListSerializer,
    BlogDetailSerializer,
    BlogCreateSerializer,
)


class IsAdminUser(BasePermission):
    """Allow access only to users whose role is ADMIN."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


# ---------------------------------------------------------------------------
# Public views
# ---------------------------------------------------------------------------

class BlogListView(ListAPIView):
    """Return all published blogs. Supports ?category= and ?featured=true."""

    serializer_class = BlogListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Blog.objects.filter(
            status=BlogStatus.PUBLISHED,
            show_in_community_blog=True,
        ).order_by("-published_at")

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)

        featured = self.request.query_params.get("featured")
        if featured and featured.lower() == "true":
            qs = qs.filter(mark_as_featured=True)

        return qs


class BlogDetailView(RetrieveAPIView):
    """Return a single published blog by slug."""

    serializer_class = BlogDetailSerializer
    permission_classes = [AllowAny]
    queryset = Blog.objects.filter(status=BlogStatus.PUBLISHED, show_in_community_blog=True)
    lookup_field = "slug"
    lookup_url_kwarg = "slug"


# ---------------------------------------------------------------------------
# Authenticated views
# ---------------------------------------------------------------------------

class BlogCreateView(CreateAPIView):
    """Create a new blog post. Author is set to the requesting user; status is forced to DRAFT."""

    serializer_class = BlogCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ---------------------------------------------------------------------------
# Admin views
# ---------------------------------------------------------------------------

class AdminBlogListView(ListAPIView):
    """Return all blogs (any status) to admins. Supports ?status= filter."""

    serializer_class = BlogListSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Blog.objects.all().order_by("-created_at")

        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        return qs


class AdminBlogStatusUpdateView(APIView):
    """PATCH a blog's status. Auto-sets published_at when moving to PUBLISHED."""

    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            blog = Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if not new_status:
            return Response(
                {"detail": "status field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_statuses = [choice[0] for choice in BlogStatus.choices]
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Choose from: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        blog.status = new_status
        if new_status == BlogStatus.PUBLISHED and blog.published_at is None:
            blog.published_at = timezone.now()

        blog.save(update_fields=["status", "published_at", "updated_at"])

        return Response(
            {
                "id": blog.pk,
                "status": blog.status,
                "published_at": blog.published_at,
            },
            status=status.HTTP_200_OK,
        )
