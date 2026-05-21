from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify
import uuid

from accounts.models import User

# Create your models here.


class BlogCategory(models.TextChoices):
    NUTRITION = "nutrition", "Nutrition"
    WELLNESS = "wellness", "Wellness"
    HEALTHY_LIVING = "healthy_living", "Healthy Living"
    DIET_TIPS = "diet_tips", "Diet Tips"
    COMMUNITY = "community", "Community"
    OTHER = "other", "Other"


class BlogStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class PublishSchedule(models.TextChoices):
    IMMEDIATE = "immediate", "Publish Immediately"
    SCHEDULED = "scheduled", "Scheduled"


class BlogTag(models.Model):
    name = models.CharField(max_length=60, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Blog(models.Model):
    # Basic information
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=240, unique=True, blank=True)
    short_excerpt = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=BlogCategory.choices, default=BlogCategory.OTHER)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blogs")
    reading_time_minutes = models.PositiveIntegerField(default=5)
    status = models.CharField(max_length=20, choices=BlogStatus.choices, default=BlogStatus.DRAFT)

    # Media and content
    cover_image = models.URLField(blank=True, null=True)
    content = models.TextField()
    tags = models.ManyToManyField(BlogTag, blank=True, related_name="blogs")

    # Publishing options
    mark_as_featured = models.BooleanField(default=False)
    publish_schedule = models.CharField(
        max_length=20,
        choices=PublishSchedule.choices,
        default=PublishSchedule.IMMEDIATE,
    )
    scheduled_publish_at = models.DateTimeField(null=True, blank=True)
    show_in_community_blog = models.BooleanField(default=True)
    allow_comments = models.BooleanField(default=True)

    likes = models.ManyToManyField(
        User,
        blank=True,
        related_name="liked_blogs"
    )

    views = models.PositiveIntegerField(default=0)

    # Internal-only note
    internal_notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "blog"
            candidate = base_slug

            while Blog.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{uuid.uuid4().hex[:8]}"

            self.slug = candidate

        super().save(*args, **kwargs)

    
