from django.test import TestCase, override_settings
from django.core.cache import cache
from rest_framework.test import APIClient
from .models import Blog, BlogStatus
from accounts.models import User

CACHE_SETTINGS = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "zawadi",
    }
}


def make_user(email="author@test.com", role="COMMUNITY_USER"):
    return User.objects.create_user(email=email, password="testpass123", role=role)


def make_blog(author, title="Test Blog", status=BlogStatus.PUBLISHED, public=True):
    return Blog.objects.create(
        title=title,
        content="Content here.",
        author=author,
        status=status,
        show_in_community_blog=public,
    )


@override_settings(CACHES=CACHE_SETTINGS)
class BlogPublicListCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.author = make_user()

    def test_second_public_get_served_from_cache(self):
        make_blog(self.author, title="Cache Blog")
        r1 = self.client.get("/api/blog/?public=1")
        with self.assertNumQueries(0):
            r2 = self.client.get("/api/blog/?public=1")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_blog_save(self):
        b = make_blog(self.author, title="Save Blog")
        self.client.get("/api/blog/?public=1")   # prime cache
        b.title = "Save Blog Updated"
        b.save()
        r = self.client.get("/api/blog/?public=1")
        titles = [item["title"] for item in r.data]
        self.assertIn("Save Blog Updated", titles)

    def test_cache_invalidated_on_blog_delete(self):
        b = make_blog(self.author, title="Delete Blog")
        self.client.get("/api/blog/?public=1")   # prime cache
        b.delete()
        r = self.client.get("/api/blog/?public=1")
        titles = [item["title"] for item in r.data]
        self.assertNotIn("Delete Blog", titles)

    def test_cache_invalidated_when_blog_made_private(self):
        b = make_blog(self.author, title="Goes Private")
        self.client.get("/api/blog/?public=1")   # prime cache
        b.show_in_community_blog = False
        b.save()
        r = self.client.get("/api/blog/?public=1")
        titles = [item["title"] for item in r.data]
        self.assertNotIn("Goes Private", titles)


@override_settings(CACHES=CACHE_SETTINGS)
class BlogDetailCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.author = make_user(email="detail_author@test.com")

    def test_second_public_detail_served_from_cache(self):
        b = make_blog(self.author, title="Detail Blog")
        r1 = self.client.get(f"/api/blog/{b.pk}/")
        with self.assertNumQueries(0):
            r2 = self.client.get(f"/api/blog/{b.pk}/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_blog_save(self):
        b = make_blog(self.author, title="Detail Save")
        self.client.get(f"/api/blog/{b.pk}/")     # prime cache
        b.title = "Detail Save Updated"
        b.save()
        r = self.client.get(f"/api/blog/{b.pk}/")
        self.assertEqual(r.data["title"], "Detail Save Updated")

    def test_cache_invalidated_on_blog_delete(self):
        b = make_blog(self.author, title="Detail Delete")
        pk = b.pk
        self.client.get(f"/api/blog/{pk}/")       # prime cache
        b.delete()
        r = self.client.get(f"/api/blog/{pk}/")
        self.assertEqual(r.status_code, 404)
