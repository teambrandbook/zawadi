from django.db import migrations


class Migration(migrations.Migration):
    """
    Rename three typo'd column names that exist in the database
    (created by earlier migrations 0001–0006):

      - Consultant.consiltation_fee          → consultation_fee
      - ConsultationBooking.lifestyle_activity_leavel → lifestyle_activity_level
      - ConsultationBooking.buckweath_journy_goal     → buckwheat_journey_goal

    NOTE: The Client model fields (lifestyle_activity_leavel, buckweath_journy_goal)
    were added in models.py but have no prior migration, so they will be picked up
    as new correctly-named fields when `makemigrations` is next run.
    """

    dependencies = [
        ("consultant", "0006_rename_conditions_consultationbooking_buckweath_journy_goal_and_more"),
    ]

    operations = [
        # Consultant model
        migrations.RenameField(
            model_name="consultant",
            old_name="consiltation_fee",
            new_name="consultation_fee",
        ),
        # ConsultationBooking model
        migrations.RenameField(
            model_name="consultationbooking",
            old_name="lifestyle_activity_leavel",
            new_name="lifestyle_activity_level",
        ),
        migrations.RenameField(
            model_name="consultationbooking",
            old_name="buckweath_journy_goal",
            new_name="buckwheat_journey_goal",
        ),
    ]
