from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("consultant", "0008_alter_consultationbooking_session_type"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Client",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("primary_goal", models.CharField(blank=True, max_length=255)),
                ("primary_wellness_goal", models.CharField(blank=True, max_length=255)),
                ("focuses_area", models.CharField(blank=True, max_length=255)),
                ("diet_preferences", models.CharField(blank=True, max_length=255)),
                ("lifestyle_activity_level", models.CharField(blank=True, max_length=255)),
                ("buckwheat_journey_goal", models.CharField(blank=True, max_length=255)),
                ("language", models.CharField(default="English", max_length=50)),
                ("message", models.TextField(blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "booking",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="client_profile",
                        to="consultant.consultationbooking",
                    ),
                ),
                (
                    "consultant",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="clients",
                        to="consultant.consultant",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="client_profiles",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("consultant", "user")},
            },
        ),
    ]
