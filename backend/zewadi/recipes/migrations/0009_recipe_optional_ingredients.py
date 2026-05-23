from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0008_merge_20260518_1530"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="optional_ingredients",
            field=models.TextField(blank=True, null=True),
        ),
    ]
