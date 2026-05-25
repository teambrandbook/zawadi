from django.db import migrations, models


def set_default_channels(apps, schema_editor):
    Notification = apps.get_model("notifications", "Notification")
    Notification.objects.filter(delivery_channels=[]).update(delivery_channels=["in_app"])


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0002_add_user_notification_receipt"),
    ]

    operations = [
        migrations.AlterField(
            model_name="notification",
            name="status",
            field=models.CharField(
                choices=[
                    ("DRAFT", "Draft"),
                    ("SCHEDULED", "Scheduled"),
                    ("SENT", "Sent"),
                ],
                default="DRAFT",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="notification",
            name="delivery_channels",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="notification",
            name="scheduled_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(set_default_channels, migrations.RunPython.noop),
    ]
