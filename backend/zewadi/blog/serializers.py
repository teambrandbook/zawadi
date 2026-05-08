from rest_framework import serializers
from .models import Blog, BlogTag
from zewadi.validators import validate_image_upload


class TagsListField(serializers.ListField):
    def get_value(self, dictionary):
        if hasattr(dictionary, "getlist"):
            values = dictionary.getlist(self.field_name)
            if values:
                return values
        return super().get_value(dictionary)


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ["id", "name"]





class BlogListSerializer(serializers.ModelSerializer):

    author_name = serializers.SerializerMethodField()
    author_image = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()

    class Meta:
        model = Blog

        fields = [
            "id",
            "title",
            "slug",
            "short_excerpt",
            "category",
            "author",
            "author_name",
            "author_image",
            "reading_time_minutes",
            "status",
            "cover_image",
            "content",
            "mark_as_featured",
            "publish_schedule",
            "scheduled_publish_at",
            "show_in_community_blog",
            "allow_comments",
            "likes",
            "views",
            "total_likes",
            "internal_notes",
            "created_at",
            "updated_at",
            "published_at",
        ]

        read_only_fields = [
            "slug",
            "author",
            "likes",
            "views",
            "created_at",
            "updated_at",
            "published_at",
        ]

    def get_total_likes(self, obj):

        return obj.likes.count()

    def _absolute_url(self, value):
        if not value:
            return None

        request = self.context.get("request")
        url = value.url if hasattr(value, "url") else str(value)
        return request.build_absolute_uri(url) if request else url

    def get_author_name(self, obj):

        if obj.author:
            return getattr(obj.author, "full_name", None) or obj.author.get_full_name() or obj.author.email

        return None

    def get_author_image(self, obj):
        photo = getattr(getattr(obj, "author", None), "photo", None)
        return self._absolute_url(photo) if photo else None

    def get_cover_image(self, obj):
        image = getattr(obj, "cover_image", None)
        return self._absolute_url(image) if image else None

# class BlogDetailSerializer(serializers.ModelSerializer):
#     tags = BlogTagSerializer(many=True, read_only=True)
#     author_name = serializers.SerializerMethodField()

#     class Meta:
#         model = Blog
#         fields = [
#             "id",
#             "slug",
#             "title",
#             "short_excerpt",
#             "category",
#             "author",
#             "author_name",
#             "reading_time_minutes",
#             "status",
#             "cover_image",
#             "content",
#             "tags",
#             "mark_as_featured",
#             "publish_schedule",
#             "scheduled_publish_at",
#             "show_in_community_blog",
#             "allow_comments",
#             "internal_notes",
#             "created_at",
#             "updated_at",
#             "published_at",
#         ]
#         read_only_fields = ["id", "slug", "author", "status", "created_at", "updated_at", "published_at"]

#     def get_author_name(self, obj):
#         return obj.author.get_full_name() if obj.author else None



# this for create blog 


class BlogSerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(required=False, allow_null=True, validators=[validate_image_upload])
    tags = TagsListField(
        child=serializers.CharField(max_length=60),
        write_only=True,
        required=False,
    )

    total_likes = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_image = serializers.SerializerMethodField()

    class Meta:
        model = Blog

        fields = [
            "id",
            "title",
            "slug",
            "short_excerpt",
            "category",
            "author",
            "author_name",
            "author_image",
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
            "likes",
            "views",
            "total_likes",
            "internal_notes",
            "created_at",
            "updated_at",
            "published_at",
        ]

        read_only_fields = [
            "slug",
            "author",
            "likes",
            "views",
            "created_at",
            "updated_at",
            "published_at",
        ]

    def get_total_likes(self, obj):
        return obj.likes.count()

    def _absolute_url(self, value):
        if not value:
            return None

        request = self.context.get("request")
        url = value.url if hasattr(value, "url") else str(value)
        return request.build_absolute_uri(url) if request else url

    def get_author_name(self, obj):
        if obj.author:
            return getattr(obj.author, "full_name", None) or obj.author.get_full_name() or obj.author.email
        return None

    def get_author_image(self, obj):
        photo = getattr(getattr(obj, "author", None), "photo", None)
        return self._absolute_url(photo) if photo else None

    def create(self, validated_data):
        tag_names = validated_data.pop("tags", [])
        blog = Blog.objects.create(**validated_data)

        if tag_names:
            tags = []
            for name in tag_names:
                cleaned_name = name.strip()
                if not cleaned_name:
                    continue
                tag, _ = BlogTag.objects.get_or_create(name=cleaned_name)
                tags.append(tag)
            if tags:
                blog.tags.set(tags)

        return blog

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tags", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if tag_names is not None:
            tags = []
            for name in tag_names:
                cleaned_name = name.strip()
                if not cleaned_name:
                    continue
                tag, _ = BlogTag.objects.get_or_create(name=cleaned_name)
                tags.append(tag)
            instance.tags.set(tags)

        return instance
