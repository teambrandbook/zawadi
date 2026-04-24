from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("consultant", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ConsultationBooking",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("session_type", models.CharField(
                    choices=[
                        ("diet_plan", "Diet Plan"),
                        ("weight_management", "Weight Management"),
                        ("health_coaching", "Health Coaching"),
                        ("general", "General Consultation"),
                    ],
                    default="general",
                    max_length=30,
                )),
                ("booked_date", models.DateField()),
                ("booked_slot", models.CharField(max_length=20)),
                ("health_goal", models.CharField(blank=True, max_length=255)),
                ("conditions", models.CharField(blank=True, max_length=255)),
                ("notes", models.TextField(blank=True)),
                ("language", models.CharField(default="English", max_length=50)),
                ("is_agreed", models.BooleanField(default=False)),
                ("status", models.CharField(
                    choices=[
                        ("pending", "Pending"),
                        ("confirmed", "Confirmed"),
                        ("completed", "Completed"),
                        ("cancelled", "Cancelled"),
                    ],
                    default="pending",
                    max_length=20,
                )),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("consultant", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="bookings",
                    to="consultant.consultant",
                )),
                ("user", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="consultation_bookings",
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
        ),
    ]
