from rest_framework import serializers
from .models import Blog, BlogTag
from zewadi.validators import validate_image_upload


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ["id", "name"]


class BlogListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "slug",
            "title",
            "short_excerpt",
            "category",
            "status",
            "cover_image",
            "reading_time_minutes",
            "mark_as_featured",
            "created_at",
            "author_name",
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else None


class BlogDetailSerializer(serializers.ModelSerializer):
    tags = BlogTagSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "slug",
            "title",
            "short_excerpt",
            "category",
            "author",
            "author_name",
            "reading_time_minutes",
            "status",
            "cover_image",
            "content",
            "tags",
            "mark_as_featured",
            "publish_schedule",
            "scheduled_publish_at",
            "show_in_community_blog",
            "allow_comments",
            "internal_notes",
            "created_at",
            "updated_at",
            "published_at",
        ]
        read_only_fields = ["id", "slug", "author", "status", "created_at", "updated_at", "published_at"]

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else None


class BlogCreateSerializer(serializers.ModelSerializer):
    tag_ids = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=BlogTag.objects.all()),
        required=False,
        write_only=True,
    )
    cover_image = serializers.ImageField(required=False, allow_null=True, validators=[validate_image_upload])

    class Meta:
        model = Blog
        fields = [
            "title",
            "short_excerpt",
            "category",
            "reading_time_minutes",
            "cover_image",
            "content",
            "tag_ids",
            "mark_as_featured",
            "publish_schedule",
            "scheduled_publish_at",
            "show_in_community_blog",
            "allow_comments",
            "internal_notes",
        ]

    def create(self, validated_data):
        tag_ids = validated_data.pop("tag_ids", [])
        # author is injected by the view; status is always DRAFT
        validated_data["status"] = "draft"
        blog = Blog.objects.create(**validated_data)
        if tag_ids:
            blog.tags.set(tag_ids)
        return blog
