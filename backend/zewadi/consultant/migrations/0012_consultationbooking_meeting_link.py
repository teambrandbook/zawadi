from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("consultant", "0011_consultantnote"),
    ]

    operations = [
        migrations.AddField(
            model_name="consultationbooking",
            name="meeting_link",
            field=models.URLField(blank=True),
        ),
    ]
