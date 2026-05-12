from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("consultant", "0010_consultant_available_consultant_rating"),
    ]

    operations = [
        migrations.CreateModel(
            name="ConsultantNote",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("note_type", models.CharField(blank=True, max_length=100)),
                ("priority_level", models.CharField(blank=True, max_length=50)),
                ("summary", models.TextField(blank=True)),
                ("observations", models.TextField(blank=True)),
                ("recommendations", models.TextField(blank=True)),
                ("food_restrictions", models.TextField(blank=True)),
                ("follow_up_instructions", models.TextField(blank=True)),
                ("follow_up_date", models.DateField(blank=True, null=True)),
                ("tags", models.TextField(blank=True)),
                ("internal_notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("booking", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="notes", to="consultant.consultationbooking")),
                ("client", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="consultant_notes", to=settings.AUTH_USER_MODEL)),
                ("consultant", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notes", to="consultant.consultant")),
            ],
            options={
                "ordering": ["-updated_at"],
            },
        ),
    ]
