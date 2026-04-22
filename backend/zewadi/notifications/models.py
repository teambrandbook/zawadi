from django.db import models


class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ("SYSTEM", "System"),
        ("ALERT", "Alert"),
        ("REMINDER", "Reminder"),
        ("PROMOTIONAL", "Promotional"),
    ]

    TARGET_ROLE_CHOICES = [
        ("ALL", "All Users"),
        ("admin", "Admin"),
        ("internal_staff", "Internal Staff"),
        ("consultant", "Consultant"),
        ("community_user", "Community User"),
    ]

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("SENT", "Sent"),
    ]

    title = models.CharField(max_length=255)
    body = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES,
        default="SYSTEM",
    )
    target_role = models.CharField(
        max_length=20,
        choices=TARGET_ROLE_CHOICES,
        default="ALL",
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="DRAFT",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} [{self.status}]"
