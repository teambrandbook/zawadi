from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("consultant", "0002_consultationbooking"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="DietPlan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                (
                    "goal",
                    models.CharField(
                        choices=[
                            ("weight_loss", "Weight Loss"),
                            ("weight_gain", "Weight Gain"),
                            ("maintenance", "Maintenance"),
                            ("muscle_gain", "Muscle Gain"),
                            ("diabetes_control", "Diabetes Control"),
                            ("general_wellness", "General Wellness"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("draft", "Draft"),
                            ("active", "Active"),
                            ("completed", "Completed"),
                            ("paused", "Paused"),
                            ("cancelled", "Cancelled"),
                        ],
                        default="draft",
                        max_length=20,
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("instructions", models.TextField(blank=True, null=True)),
                ("foods_to_avoid", models.TextField(blank=True, null=True)),
                ("recommended_foods", models.TextField(blank=True, null=True)),
                ("daily_calories", models.PositiveIntegerField(default=0)),
                ("protein_grams", models.PositiveIntegerField(default=0)),
                ("carbs_grams", models.PositiveIntegerField(default=0)),
                ("fats_grams", models.PositiveIntegerField(default=0)),
                ("water_intake_liters", models.DecimalField(decimal_places=1, default=0, max_digits=4)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField(blank=True, null=True)),
                ("duration_days", models.PositiveIntegerField(default=7)),
                ("is_template", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "client",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="diet_plans",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "consultant",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="diet_plans",
                        to="consultant.consultant",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DietPlanMeal",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "meal_type",
                    models.CharField(
                        choices=[
                            ("breakfast", "Breakfast"),
                            ("mid_morning", "Mid Morning"),
                            ("lunch", "Lunch"),
                            ("evening_snack", "Evening Snack"),
                            ("dinner", "Dinner"),
                            ("bedtime", "Bedtime"),
                        ],
                        max_length=30,
                    ),
                ),
                ("title", models.CharField(blank=True, max_length=255, null=True)),
                ("time", models.TimeField(blank=True, null=True)),
                ("calories", models.PositiveIntegerField(default=0)),
                ("notes", models.TextField(blank=True, null=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                (
                    "diet_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="meals",
                        to="consultant.dietplan",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.CreateModel(
            name="DietPlanMealItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("food_name", models.CharField(max_length=255)),
                ("quantity", models.CharField(blank=True, max_length=100, null=True)),
                ("calories", models.PositiveIntegerField(default=0)),
                ("protein_grams", models.PositiveIntegerField(default=0)),
                ("carbs_grams", models.PositiveIntegerField(default=0)),
                ("fats_grams", models.PositiveIntegerField(default=0)),
                ("notes", models.TextField(blank=True, null=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                (
                    "meal",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="consultant.dietplanmeal",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
    ]
