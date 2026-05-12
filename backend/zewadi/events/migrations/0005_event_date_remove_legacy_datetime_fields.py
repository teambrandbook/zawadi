from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0004_event_end_date_event_end_time_event_start_date_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="event",
            old_name="start_date",
            new_name="event_date",
        ),
        migrations.RemoveField(
            model_name="event",
            name="end_date",
        ),
        migrations.RemoveField(
            model_name="event",
            name="start_datetime",
        ),
        migrations.RemoveField(
            model_name="event",
            name="end_datetime",
        ),
    ]
