from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("supperadmin", "0003_alter_rolepermission_module"),
    ]

    operations = [
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("platform_name", models.CharField(default="ZEWADI Health Community", max_length=100)),
                ("support_email", models.EmailField(default="support@zewadi.com")),
                ("support_phone", models.CharField(blank=True, default="", max_length=30)),
                ("maintenance_mode", models.BooleanField(default=False)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Site Settings",
                "verbose_name_plural": "Site Settings",
            },
        ),
    ]
