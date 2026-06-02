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
        ("SCHEDULED", "Scheduled"),
        ("SENT", "Sent"),
    ]

    CHANNEL_IN_APP = "in_app"
    CHANNEL_EMAIL = "email"
    CHANNEL_PUSH = "push"
    DEFAULT_CHANNELS = [CHANNEL_IN_APP]

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
    target_user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='direct_notifications',
        null=True,
        blank=True,
    )
    action_url = models.CharField(max_length=500, blank=True, default="")
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="DRAFT",
    )
    delivery_channels = models.JSONField(default=list, blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} [{self.status}]"

    def save(self, *args, **kwargs):
        if not self.delivery_channels:
            self.delivery_channels = self.DEFAULT_CHANNELS.copy()
        super().save(*args, **kwargs)

    def has_channel(self, channel: str) -> bool:
        return channel in (self.delivery_channels or [])


class UserNotificationReceipt(models.Model):
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='notification_receipts',
    )
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='receipts',
    )
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'notification')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.notification.title} [read={self.is_read}]"


class PushDevice(models.Model):
    PLATFORM_WEB = "web"
    PLATFORM_CHOICES = [
        (PLATFORM_WEB, "Web"),
    ]

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='push_devices',
    )
    token = models.TextField(unique=True)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default=PLATFORM_WEB)
    user_agent = models.CharField(max_length=500, blank=True, default="")
    is_active = models.BooleanField(default=True)
    last_seen_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-last_seen_at"]

    def __str__(self):
        return f"{self.user.email} [{self.platform}] active={self.is_active}"
