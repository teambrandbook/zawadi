from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Blog, BlogStatus


class BlogSlugAPITests(APITestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            email="author@example.com",
            password="Pass@1234",
            full_name="Blog Author",
            user_name="blogauthor",
            phone="+10000000001",
            role="COMMUNITY_USER",
        )

    def test_published_blog_detail_uses_slug(self):
        blog = Blog.objects.create(
            author=self.author,
            title="Buckwheat Wellness Story",
            short_excerpt="A short story",
            content="Full content",
            status=BlogStatus.PUBLISHED,
            show_in_community_blog=True,
        )

        response = self.client.get(f"/api/blog/{blog.slug}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], blog.slug)
        self.assertEqual(response.data["title"], blog.title)

    def test_hidden_blog_not_available_publicly(self):
        blog = Blog.objects.create(
            author=self.author,
            title="Hidden Story",
            short_excerpt="Hidden",
            content="Full content",
            status=BlogStatus.PUBLISHED,
            show_in_community_blog=False,
        )

        response = self.client.get(f"/api/blog/{blog.slug}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
