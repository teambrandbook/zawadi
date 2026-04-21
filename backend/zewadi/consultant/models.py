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


class ConsultationBooking(models.Model):
    class BookingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    class SessionType(models.TextChoices):
        DIET_PLAN = "diet_plan", "Diet Plan"
        WEIGHT_MANAGEMENT = "weight_management", "Weight Management"
        HEALTH_COACHING = "health_coaching", "Health Coaching"
        GENERAL = "general", "General Consultation"

    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="consultation_bookings")
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE, related_name="bookings")
    session_type = models.CharField(max_length=30, choices=SessionType.choices, default=SessionType.GENERAL)
    booked_date = models.DateField()
    booked_slot = models.CharField(max_length=20)
    health_goal = models.CharField(max_length=255, blank=True)
    conditions = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    language = models.CharField(max_length=50, default="English")
    is_agreed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} → {self.consultant} on {self.booked_date}"