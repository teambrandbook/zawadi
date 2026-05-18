import uuid
from django.db import models
from django.utils.text import slugify


class Event(models.Model):
    class EventType(models.TextChoices):
        WEBINAR = "webinar", "Webinar"
        WORKSHOP = "workshop", "Workshop"
        SEMINAR = "seminar", "Seminar"
        COMMUNITY = "community", "Community Meetup"
        OTHER = "other", "Other"

    class EventStatus(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    short_subtitle = models.CharField(max_length=255, blank=True)
    short_description = models.CharField(max_length=300)
    full_description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.OTHER)
    status = models.CharField(max_length=20, choices=EventStatus.choices, default=EventStatus.DRAFT)
    cover_image = models.URLField(blank=True, null=True)
    host_speaker_name = models.CharField(max_length=255, blank=True)
    timezone = models.CharField(max_length=50, default="UTC")
    agenda_highlights = models.TextField(blank=True)
    event_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    repeat_event = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    location = models.CharField(max_length=500, blank=True)
    meeting_link = models.URLField(blank=True)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    enable_registration = models.BooleanField(default=True)
    waitlist_enabled = models.BooleanField(default=False)
    approval_required = models.BooleanField(default=False)
    event_tags = models.JSONField(default=list, blank=True)
    is_free = models.BooleanField(default=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    show_in_community = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="organized_events",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-event_date", "-start_time"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{slugify(self.title)}-{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class EventRegistration(models.Model):
    class RegistrationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        ATTENDED = "attended", "Attended"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="event_registrations",
    )
    status = models.CharField(
        max_length=20,
        choices=RegistrationStatus.choices,
        default=RegistrationStatus.CONFIRMED,
    )
    registered_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("event", "user")
        ordering = ["-registered_at"]

    def __str__(self):
        return f"{self.user} \u2192 {self.event.title}"
