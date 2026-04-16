from django.db import models
from accounts.models import User

# Create your models here.
class Consultant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="consultant")

    years_of_experience = models.PositiveIntegerField()
    qualification = models.CharField(max_length=255)
    certifications = models.TextField(blank=True, null=True)

    short_bio = models.TextField(blank=True, null=True)

    languages_spoken = models.CharField(max_length=255)

    # 🔥 Many-to-Many
    experience_areas = models.CharField(max_length=255)
    session_type=models.CharField(max_length=225)
    consiltation_fee=models.PositiveIntegerField()
    session_duration = models.PositiveIntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)