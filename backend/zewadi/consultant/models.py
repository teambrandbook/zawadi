from django.db import models

from accounts.models import User


class Consultant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="consultant")
    years_of_experience = models.PositiveIntegerField()
    qualification = models.CharField(max_length=255)
    certifications = models.TextField(blank=True, null=True)
    short_bio = models.TextField(blank=True, null=True)
    languages_spoken = models.CharField(max_length=255)
    experience_areas = models.CharField(max_length=255)
    session_type = models.CharField(max_length=225)
    consiltation_fee = models.PositiveIntegerField()
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

    class CommunicationType(models.TextChoices):
        VIDEO = "video", "Video Call"
        AUDIO = "audio", "Audio Call"
        CHAT = "chat", "Chat"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultation_bookings")
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE, related_name="bookings")
    session_type = models.CharField(max_length=30, choices=CommunicationType.choices, default=CommunicationType.VIDEO)
    booked_date = models.DateField()
    booked_slot = models.CharField(max_length=20)
    primary_goal = models.CharField(max_length=255, blank=True)
    primary_wellness_goal= models.CharField(max_length=255, blank=True)
    focuses_area = models.CharField(max_length=255, blank=True)
    diet_preferences = models.CharField(max_length=255, blank=True)
    lifestyle_activity_leavel = models.CharField(max_length=255, blank=True)
    buckweath_journy_goal = models.CharField(max_length=255, blank=True)
    message = models.TextField(blank=True)
    language = models.CharField(max_length=50, default="English")
    is_agreed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} -> {self.consultant} on {self.booked_date}"


class DietPlan(models.Model):
    class PlanStatus(models.TextChoices):
        DRAFT = "draft", "Draft"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        PAUSED = "paused", "Paused"
        CANCELLED = "cancelled", "Cancelled"

    class GoalType(models.TextChoices):
        WEIGHT_LOSS = "weight_loss", "Weight Loss"
        WEIGHT_GAIN = "weight_gain", "Weight Gain"
        MAINTENANCE = "maintenance", "Maintenance"
        MUSCLE_GAIN = "muscle_gain", "Muscle Gain"
        DIABETES_CONTROL = "diabetes_control", "Diabetes Control"
        GENERAL_WELLNESS = "general_wellness", "General Wellness"

    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE, related_name="diet_plans")
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="diet_plans")
    title = models.CharField(max_length=255)
    goal = models.CharField(max_length=50, choices=GoalType.choices)
    status = models.CharField(max_length=20, choices=PlanStatus.choices, default=PlanStatus.DRAFT)
    description = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    foods_to_avoid = models.TextField(blank=True, null=True)
    recommended_foods = models.TextField(blank=True, null=True)
    daily_calories = models.PositiveIntegerField(default=0)
    protein_grams = models.PositiveIntegerField(default=0)
    carbs_grams = models.PositiveIntegerField(default=0)
    fats_grams = models.PositiveIntegerField(default=0)
    water_intake_liters = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    duration_days = models.PositiveIntegerField(default=7)
    is_template = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        client_name = self.client.full_name or self.client.email
        return f"{self.title} - {client_name}"


class DietPlanMeal(models.Model):
    class MealType(models.TextChoices):
        BREAKFAST = "breakfast", "Breakfast"
        MID_MORNING = "mid_morning", "Mid Morning"
        LUNCH = "lunch", "Lunch"
        EVENING_SNACK = "evening_snack", "Evening Snack"
        DINNER = "dinner", "Dinner"
        BEDTIME = "bedtime", "Bedtime"

    diet_plan = models.ForeignKey(DietPlan, on_delete=models.CASCADE, related_name="meals")
    meal_type = models.CharField(max_length=30, choices=MealType.choices)
    title = models.CharField(max_length=255, blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    calories = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.diet_plan.title} - {self.get_meal_type_display()}"


class DietPlanMealItem(models.Model):
    meal = models.ForeignKey(DietPlanMeal, on_delete=models.CASCADE, related_name="items")
    food_name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100, blank=True, null=True)
    calories = models.PositiveIntegerField(default=0)
    protein_grams = models.PositiveIntegerField(default=0)
    carbs_grams = models.PositiveIntegerField(default=0)
    fats_grams = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.food_name} ({self.meal.get_meal_type_display()})"
    

# consultent time setting section


class WeekDay(models.TextChoices):
    MONDAY = "monday", "Monday"
    TUESDAY = "tuesday", "Tuesday"
    WEDNESDAY = "wednesday", "Wednesday"
    THURSDAY = "thursday", "Thursday"
    FRIDAY = "friday", "Friday"
    SATURDAY = "saturday", "Saturday"
    SUNDAY = "sunday", "Sunday"


class WeeklySlot(models.Model):
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE)

    day = models.CharField(max_length=10, choices=WeekDay.choices)

    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ('consultant', 'day', 'start_time')



class Availability(models.Model):
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE)
    day = models.CharField(max_length=10, choices=WeekDay.choices)

    start_time = models.TimeField()
    end_time = models.TimeField()


class BreakTime(models.Model):
    availability = models.ForeignKey(Availability, on_delete=models.CASCADE, related_name="breaks")
    start_time = models.TimeField()
    end_time = models.TimeField()


class BlockedDate(models.Model):
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE)

    from_date = models.DateField()
    to_date = models.DateField()

    reason = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)


class ConsultantSettings(models.Model):
    consultant = models.OneToOneField(Consultant, on_delete=models.CASCADE)

    accept_new = models.BooleanField(default=True)
    allow_same_day = models.BooleanField(default=True)
    show_profile = models.BooleanField(default=True)
    auto_close_full_day = models.BooleanField(default=True)
    followup_priority = models.BooleanField(default=False)


# cline model booking to client

class Client(models.Model):
    consultant = models.ForeignKey(
        'Consultant',
        on_delete=models.CASCADE,
        related_name="clients"
    )

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name="consultant_clients"
    )

    session_type = models.CharField(max_length=30)
    primary_goal = models.CharField(max_length=255, blank=True)
    primary_wellness_goal = models.CharField(max_length=255, blank=True)

    focuses_area = models.CharField(max_length=255, blank=True)
    diet_preferences = models.CharField(max_length=255, blank=True)
    lifestyle_activity_leavel = models.CharField(max_length=255, blank=True)
    buckweath_journy_goal = models.CharField(max_length=255, blank=True)

    message = models.TextField(blank=True)
    language = models.CharField(max_length=50, default="English")

    # 🔗 link to booking
    booking = models.OneToOneField(
        'ConsultationBooking',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="client_profile"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('consultant', 'user')

    def __str__(self):
        return f"{self.user} → {self.consultant}"




        

# class Booking(models.Model):
#     STATUS = (
#         ('pending', 'Pending'),
#         ('accepted', 'Accepted'),
#         ('rejected', 'Rejected'),
#     )

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     consultant = models.ForeignKey(Consultant, on_delete=models.SET_NULL, null=True)

#     date = models.DateField()
#     start_time = models.TimeField()
#     end_time = models.TimeField()

#     status = models.CharField(max_length=20, choices=STATUS, default='pending')

# -----------------------------------------------------------------

# from django.db import models
# from accounts.models import User

# # Create your models here.
# class Consultant(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="consultant")

#     years_of_experience = models.PositiveIntegerField()
#     qualification = models.CharField(max_length=255)
#     certifications = models.TextField(blank=True, null=True)

#     short_bio = models.TextField(blank=True, null=True)

#     languages_spoken = models.CharField(max_length=255)

#     # 🔥 Many-to-Many
#     experience_areas = models.CharField(max_length=255)
#     session_type=models.CharField(max_length=225)
#     consiltation_fee=models.PositiveIntegerField()
#     session_duration = models.PositiveIntegerField()
    
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return str(self.user)


# class ConsultationBooking(models.Model):
#     class BookingStatus(models.TextChoices):
#         PENDING = "pending", "Pending"
#         CONFIRMED = "confirmed", "Confirmed"
#         COMPLETED = "completed", "Completed"
#         CANCELLED = "cancelled", "Cancelled"

#     class SessionType(models.TextChoices):
#         DIET_PLAN = "diet_plan", "Diet Plan"
#         WEIGHT_MANAGEMENT = "weight_management", "Weight Management"
#         HEALTH_COACHING = "health_coaching", "Health Coaching"
#         GENERAL = "general", "General Consultation"

#     user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="consultation_bookings")
#     consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE, related_name="bookings")
#     session_type = models.CharField(max_length=30, choices=SessionType.choices, default=SessionType.GENERAL)
#     booked_date = models.DateField()
#     booked_slot = models.CharField(max_length=20)
#     health_goal = models.CharField(max_length=255, blank=True)
#     conditions = models.CharField(max_length=255, blank=True)
#     notes = models.TextField(blank=True)
#     language = models.CharField(max_length=50, default="English")
#     is_agreed = models.BooleanField(default=False)
#     status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user} → {self.consultant} on {self.booked_date}"
