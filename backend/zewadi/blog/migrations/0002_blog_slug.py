from django.db import migrations, models
from django.utils.text import slugify
import uuid


def populate_blog_slugs(apps, schema_editor):
    Blog = apps.get_model("blog", "Blog")
    for blog in Blog.objects.all():
        if blog.slug:
            continue
        base = slugify(blog.title)[:200] or "blog"
        slug = f"{base}-{str(uuid.uuid4())[:8]}"
        while Blog.objects.filter(slug=slug).exclude(pk=blog.pk).exists():
            slug = f"{base}-{str(uuid.uuid4())[:8]}"
        blog.slug = slug
        blog.save(update_fields=["slug"])


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="blog",
            name="slug",
            field=models.SlugField(blank=True, max_length=240, null=True, unique=True),
        ),
        migrations.RunPython(populate_blog_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="blog",
            name="slug",
            field=models.SlugField(blank=True, max_length=240, unique=True),
        ),
    ]
