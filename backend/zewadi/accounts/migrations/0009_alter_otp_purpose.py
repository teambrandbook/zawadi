from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0008_alter_user_photo_length"),
    ]

    operations = [
        migrations.AlterField(
            model_name="otp",
            name="purpose",
            field=models.CharField(
                choices=[
                    ("EMAIL_VERIFICATION", "Email Verification"),
                    ("PASSWORD_RESET", "Password Reset"),
                    ("CONSULTATION_BOOKING", "Consultation Booking"),
                ],
                max_length=20,
            ),
        ),
    ]
