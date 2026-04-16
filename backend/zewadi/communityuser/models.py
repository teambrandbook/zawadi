from django.db import models
from accounts.models import User

class UserType(models.TextChoices):
    GUEST = "guest", "Guest"
    MEMBER = "member", "Member"
    


# Comunity and Member also in this
class CommunityUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="communityuser")

    user_type = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.GUEST
    )

    # preferences
    wellness_interests = models.CharField(max_length=255, blank=True, null=True)
    diet_preference = models.CharField(max_length=100, blank=True, null=True)
    preferred_communication = models.CharField(max_length=50, default="email")
    notification_preferences = models.CharField(max_length=50, default="all")
    
    activate_immediately = models.BooleanField(default=False)
    send_welcome_email = models.BooleanField(default=True)
    send_password_setup = models.BooleanField(default=False)
    allow_notifications = models.BooleanField(default=True)
    is_verified_member = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} ({self.user_type})"
    
    




class CommunityUserAddress(models.Model):
    user = models.OneToOneField(CommunityUser, on_delete=models.CASCADE, related_name="address")

    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.user.email} - Address"

