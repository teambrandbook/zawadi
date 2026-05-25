from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0006_alter_blog_short_excerpt"),
    ]

    operations = [
        migrations.AlterField(
            model_name="blog",
            name="short_excerpt",
            field=models.CharField(max_length=300),
        ),
    ]
