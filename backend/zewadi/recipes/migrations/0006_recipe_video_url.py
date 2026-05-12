# Generated manually on 2026-05-11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0005_remove_recipe_dietary_flags"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="video_url",
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
