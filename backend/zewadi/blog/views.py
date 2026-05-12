from django.utils import timezone
from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from .models import Blog, BlogStatus
from .serializers import (
    BlogListSerializer,
    BlogSerializer
    
)

from supperadmin.utils.permissions import has_permission

class IsAdminUser(BasePermission):
    """Allow access only to users whose role is ADMIN."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


# ---------------------------------------------------------------------------
# Public views
# ---------------------------------------------------------------------------

class BlogListAPIView(APIView):

    permission_classes = [AllowAny]

    # Safe fields that can be used for ordering
    ORDERING_WHITELIST = {"title", "created_at", "-title", "-created_at"}

    def get(self, request):

        user = request.user
        public_list = request.query_params.get("public") == "1" or not user.is_authenticated

        if public_list:
            blogs = Blog.objects.filter(
                show_in_community_blog=True,
                status__in=[BlogStatus.PUBLISHED, BlogStatus.PENDING],
            ).order_by("-created_at")

            serializer = BlogListSerializer(
                blogs,
                many=True,
                context={"request": request}
            )

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        has_blog_permission = has_permission(
            user,
            "blog",
            "view"
        )

        # permission user -> view all blogs
        if has_blog_permission:

            qs = Blog.objects.all()

        # community user -> only own blogs
        elif user.role == "COMMUNITY_USER":

            qs = Blog.objects.filter(author=user)

        else:

            return Response(
                {
                    "message": "Permission denied"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # --- search filter (?search=) ---
        search = request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search) |
                Q(author__first_name__icontains=search) |
                Q(author__last_name__icontains=search)
            )

        # --- tag filter (?tag=) ---
        tag = request.query_params.get("tag", "").strip()
        if tag:
            qs = qs.filter(tags__name__icontains=tag).distinct()

        # --- ordering (?ordering=) ---
        ordering = request.query_params.get("ordering", "-created_at").strip()
        if ordering not in self.ORDERING_WHITELIST:
            ordering = "-created_at"
        qs = qs.order_by(ordering)

        serializer = BlogListSerializer(
            qs,
            many=True,
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )




class BlogCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        # check community user
        is_community_user = (
            user.role == "COMMUNITY_USER"
        )

        # check permission
        has_blog_permission = has_permission(
            user,
            "blog",
            "create"
        )

        # deny access
        if not (
            is_community_user or
            has_blog_permission
        ):
            return Response(
                {
                    "message": "You don't have permission to create blogs"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = BlogSerializer(
            data=request.data
        )

        if serializer.is_valid():

            # community user -> pending
            if is_community_user:

                serializer.save(
                    author=user,
                    status=BlogStatus.PENDING
                )

            # permission user -> can publish/draft
            else:
                requested_status = str(request.data.get("status", BlogStatus.DRAFT)).strip().lower()
                final_status = requested_status if requested_status in {BlogStatus.DRAFT, BlogStatus.PUBLISHED} else BlogStatus.DRAFT

                serializer.save(
                    author=user,
                    status=final_status
                )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )



# Blog edit and delete




class BlogDetailAPIView(APIView):

    permission_classes = [AllowAny]

    def get_object(self, blog_id):
        lookup = {"id": blog_id} if str(blog_id).isdigit() else {"slug": blog_id}

        return Blog.objects.filter(
            **lookup
        ).first()

    # -----------------------------
    # GET BLOG DETAILS
    # -----------------------------
    def get(self, request, blog_id):

        blog = self.get_object(blog_id)

        if not blog:

            return Response(
                {
                    "message": "Blog not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        public_allowed = (
            blog.show_in_community_blog
            and blog.status in [BlogStatus.PUBLISHED, BlogStatus.PENDING]
        )

        if not user.is_authenticated:
            if not public_allowed:
                return Response(
                    {
                        "message": "Blog not found"
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            has_blog_permission = has_permission(
                user,
                "blog",
                "view"
            )
            if not (
                public_allowed
                or has_blog_permission
                or blog.author == user
            ):
                return Response(
                    {
                        "message": "Permission denied"
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = BlogSerializer(blog, context={"request": request})

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # -----------------------------
    # EDIT BLOG
    # -----------------------------
    def patch(self, request, blog_id):
        if not request.user.is_authenticated:
            return Response(
                {
                    "message": "Authentication required"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


        blog = self.get_object(blog_id)

        if not blog:

            return Response(
                {
                    "message": "Blog not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        has_blog_permission = has_permission(
            user,
            "blog",
            "edit"
        )

        # community user -> only own blog
        if (
            user.role == "COMMUNITY_USER" and
            blog.author != user
        ):

            return Response(
                {
                    "message": "Permission denied"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # admin/permission user
        elif not (
            user.role == "COMMUNITY_USER" or
            has_blog_permission
        ):

            return Response(
                {
                    "message": "Permission denied"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = BlogSerializer(
            blog,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------
    # DELETE BLOG
    # -----------------------------
    def delete(self, request, blog_id):
        if not request.user.is_authenticated:
            return Response(
                {
                    "message": "Authentication required"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


        blog = self.get_object(blog_id)

        if not blog:

            return Response(
                {
                    "message": "Blog not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        has_blog_permission = has_permission(
            user,
            "blog",
            "delete"
        )

        # community user -> only own blog
        if (
            user.role == "COMMUNITY_USER" and
            blog.author != user
        ):

            return Response(
                {
                    "message": "Permission denied"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # admin/permission user
        elif not (
            user.role == "COMMUNITY_USER" or
            has_blog_permission
        ):

            return Response(
                {
                    "message": "Permission denied"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        blog.delete()

        return Response(
            {
                "message": "Blog deleted successfully"
            },
            status=status.HTTP_200_OK
        )
