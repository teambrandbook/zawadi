from django.contrib import admin
from .models import Event, EventRegistration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "event_type",
        "status",
        "start_datetime",
        "end_datetime",
        "is_online",
        "is_free",
        "is_featured",
        "show_in_community",
        "created_by",
        "created_at",
    ]
    list_filter = [
        "status",
        "event_type",
        "is_online",
        "is_free",
        "is_featured",
        "show_in_community",
    ]
    search_fields = ["title", "short_description", "location"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "start_datetime"
    ordering = ["-start_datetime"]


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ["event", "user", "status", "registered_at"]
    list_filter = ["status"]
    search_fields = ["event__title", "user__email"]
    readonly_fields = ["registered_at"]
    ordering = ["-registered_at"]
