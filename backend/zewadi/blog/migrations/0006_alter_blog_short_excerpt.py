from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0005_alter_blog_cover_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="blog",
            name="short_excerpt",
            field=models.CharField(max_length=200),
        ),
    ]
