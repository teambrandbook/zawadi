from django.contrib import admin
from .models import Blog, BlogTag


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "created_at"]
    search_fields = ["name"]
    ordering = ["name"]


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "author",
        "category",
        "status",
        "mark_as_featured",
        "created_at",
        "published_at",
    ]
    list_filter = ["status", "category", "mark_as_featured", "show_in_community_blog"]
    search_fields = ["title", "short_excerpt", "content", "author__email"]
    filter_horizontal = ["tags"]
    readonly_fields = ["created_at", "updated_at", "published_at"]
    ordering = ["-created_at"]


# admin.site.register(Blog)