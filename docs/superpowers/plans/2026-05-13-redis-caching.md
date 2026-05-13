# Redis Caching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Redis as a shared cache and rate-limit backend so high-traffic public read endpoints (products, blogs, published recipes) skip Postgres on cache hits, and DRF throttles survive Gunicorn worker restarts.

**Architecture:** Cache-aside pattern in views — check Redis first, fall back to Postgres on miss, store result. Signal-based invalidation on `post_save`/`post_delete` wipes relevant keys automatically. Throttles inherit Redis automatically once `CACHES` points at it — no throttle code changes needed.

**Tech Stack:** `django-redis>=5.4`, Redis 7 Alpine (Docker), Django cache framework, Django signals

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `docker-compose.yml` | Modify | Add redis service; add REDIS_URL to backend env |
| `backend/zewadi/requirements.txt` | Modify | Add `django-redis>=5.4` |
| `backend/zewadi/zewadi/settings.py` | Modify | Add `CACHES` config block |
| `.env.example` | Modify | Add `REDIS_URL` |
| `backend/zewadi/product/signals.py` | Create | Invalidate product caches on save/delete |
| `backend/zewadi/product/apps.py` | Modify | Register product signals in `ready()` |
| `backend/zewadi/product/views.py` | Modify | Cache-aside in `ProductListCreateView.get` and `ProductDetailView.get` |
| `backend/zewadi/product/tests.py` | Modify | Cache hit/miss + invalidation tests |
| `backend/zewadi/blog/signals.py` | Create | Invalidate blog caches on save/delete |
| `backend/zewadi/blog/apps.py` | Modify | Register blog signals in `ready()` |
| `backend/zewadi/blog/views.py` | Modify | Cache-aside in `BlogListAPIView.get` (public path) and `BlogDetailAPIView.get` (public blogs) |
| `backend/zewadi/blog/tests.py` | Modify | Cache hit/miss + invalidation tests |
| `backend/zewadi/recipes/signals.py` | Create | Invalidate published_recipes cache on save/delete |
| `backend/zewadi/recipes/apps.py` | Modify | Register recipe signals in `ready()` |
| `backend/zewadi/recipes/views.py` | Modify | Cache-aside in `PublishedRecipeListAPIView.get` |
| `backend/zewadi/recipes/tests.py` | Modify | Cache hit/miss + invalidation tests |

---

## Task 1: Infrastructure — Redis service, package, settings

**Files:**
- Modify: `docker-compose.yml`
- Modify: `backend/zewadi/requirements.txt`
- Modify: `backend/zewadi/zewadi/settings.py`
- Modify: `.env.example`

- [ ] **Step 1: Add redis service to docker-compose.yml**

Open `docker-compose.yml`. Add the redis service block after the `db` service and before `backend`. Also add `REDIS_URL` to the backend environment and `redis` to backend's `depends_on`. Also add `redis` to the `volumes` section at the bottom.

Replace the `backend` → `depends_on` block and add the redis service so the file looks like this (show only changed sections):

```yaml
  # ── Redis ───────────────────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

In the `backend` service, add `REDIS_URL` to `environment`:
```yaml
      REDIS_URL: ${REDIS_URL:-redis://redis:6379/0}
```

In the `backend` service, add redis to `depends_on`:
```yaml
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
```

No new named volume needed — Redis data is ephemeral by design (cache).

- [ ] **Step 2: Add django-redis to requirements.txt**

In `backend/zewadi/requirements.txt`, add one line after the existing packages:
```
django-redis>=5.4
```

- [ ] **Step 3: Add CACHES to settings.py**

Open `backend/zewadi/zewadi/settings.py`. At the end of the file, after the Production Safety Guard block, add:

```python
# ─── Cache (Redis) ────────────────────────────────────────────────────────────

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
        "KEY_PREFIX": "zawadi",
    }
}
```

- [ ] **Step 4: Add REDIS_URL to .env.example**

Open `.env.example`. Add after the `FRONTEND_URL` line:
```
REDIS_URL=redis://redis:6379/0
```

- [ ] **Step 5: Verify django-redis installs cleanly**

```bash
cd backend/zewadi
pip install django-redis
python -c "import django_redis; print('django-redis OK')"
```

Expected output: `django-redis OK`

- [ ] **Step 6: Commit**

```bash
git add docker-compose.yml backend/zewadi/requirements.txt backend/zewadi/zewadi/settings.py .env.example
git commit -m "feat: add Redis service and django-redis cache backend"
```

---

## Task 2: Product caching

**Files:**
- Create: `backend/zewadi/product/signals.py`
- Modify: `backend/zewadi/product/apps.py`
- Modify: `backend/zewadi/product/views.py`
- Modify: `backend/zewadi/product/tests.py`

- [ ] **Step 1: Write failing tests for product cache**

Open `backend/zewadi/product/tests.py`. Replace its contents with:

```python
from django.test import TestCase, override_settings
from django.core.cache import cache
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Product, ProductStatus

CACHE_SETTINGS = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "zawadi",
    }
}


def make_product(name="Test Product", status=ProductStatus.ACTIVE):
    return Product.objects.create(
        product_name=name,
        product_code=f"P-{name[:4].upper()}-001",
        category="food",
        product_status=status,
        base_price="10.00",
    )


@override_settings(CACHES=CACHE_SETTINGS)
class ProductListCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def test_second_get_is_served_from_cache(self):
        make_product("Alpha")
        with self.assertNumQueries(1):
            r1 = self.client.get("/api/products/")
        with self.assertNumQueries(0):
            r2 = self.client.get("/api/products/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_product_save(self):
        p = make_product("Beta")
        self.client.get("/api/products/")          # prime cache
        p.product_name = "Beta Updated"
        p.save()
        r = self.client.get("/api/products/")
        names = [item["product_name"] for item in r.data["results"]]
        self.assertIn("Beta Updated", names)

    def test_cache_invalidated_on_product_delete(self):
        p = make_product("Gamma")
        self.client.get("/api/products/")          # prime cache
        p.delete()
        r = self.client.get("/api/products/")
        names = [item["product_name"] for item in r.data["results"]]
        self.assertNotIn("Gamma", names)


@override_settings(CACHES=CACHE_SETTINGS)
class ProductDetailCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def test_second_get_is_served_from_cache(self):
        p = make_product("Delta")
        with self.assertNumQueries(1):
            r1 = self.client.get(f"/api/products/{p.pk}/")
        with self.assertNumQueries(0):
            r2 = self.client.get(f"/api/products/{p.pk}/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_product_save(self):
        p = make_product("Epsilon")
        self.client.get(f"/api/products/{p.pk}/")  # prime cache
        p.product_name = "Epsilon Updated"
        p.save()
        r = self.client.get(f"/api/products/{p.pk}/")
        self.assertEqual(r.data["product_name"], "Epsilon Updated")
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test product.tests -v 2
```

Expected: Tests fail because cache is not implemented yet — second GETs still hit DB.

- [ ] **Step 3: Create product/signals.py**

Create `backend/zewadi/product/signals.py`:

```python
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Product

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, instance, **kwargs):
    try:
        cache.delete(f"product_detail:{instance.pk}")
        cache.delete_pattern("*:product_list:*")
    except Exception:
        logger.warning("Failed to invalidate product cache", exc_info=True)
```

- [ ] **Step 4: Register signals in product/apps.py**

Replace the contents of `backend/zewadi/product/apps.py`:

```python
from django.apps import AppConfig


class ProductConfig(AppConfig):
    name = "product"

    def ready(self):
        import product.signals  # noqa: F401
```

- [ ] **Step 5: Add cache-aside to product/views.py**

Open `backend/zewadi/product/views.py`. Add the cache import at the top alongside existing imports:

```python
from django.core.cache import cache
```

Replace the `get` method of `ProductListCreateView` (lines 39–82) with:

```python
    def get(self, request):
        can_manage = _can_manage_products(request.user)
        if not can_manage and not _can_view_public_products(request.user):
            return Response(
                {"error": "You do not have permission to view products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Only cache unauthenticated / community-user (public) requests.
        # Admin requests always hit Postgres so they see unpublished products.
        category = request.query_params.get("category", "")
        search = request.query_params.get("search", "")
        ordering = request.query_params.get("ordering", "-created_at")

        if not can_manage:
            cache_key = f"product_list:{category}:{search}:{ordering}"
            try:
                cached = cache.get(cache_key)
                if cached is not None:
                    return Response(cached)
            except Exception:
                cached = None

        products = Product.objects.prefetch_related("variants")
        if not can_manage:
            products = products.filter(product_status=ProductStatus.ACTIVE)

        if category:
            products = products.filter(category__iexact=category)

        if search:
            from django.db.models import Q
            products = products.filter(
                Q(product_name__icontains=search)
                | Q(short_description__icontains=search)
                | Q(full_description__icontains=search)
            )

        allowed_orderings = {
            "base_price", "-base_price",
            "product_name", "-product_name",
            "created_at", "-created_at",
        }
        if ordering in allowed_orderings:
            products = products.order_by(ordering)
        else:
            products = products.order_by("-created_at")

        paginator = StandardPagination()
        page = paginator.paginate_queryset(products, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True, context={"request": request})
            response = paginator.get_paginated_response(serializer.data)
            if not can_manage:
                try:
                    cache.set(cache_key, response.data, timeout=180)
                except Exception:
                    pass
            return response

        serializer = ProductSerializer(products, many=True, context={"request": request})
        if not can_manage:
            try:
                cache.set(cache_key, serializer.data, timeout=180)
            except Exception:
                pass
        return Response(serializer.data, status=status.HTTP_200_OK)
```

Replace the `get` method of `ProductDetailView` (lines 121–136) with:

```python
    def get(self, request, pk):
        can_manage = _can_manage_products(request.user)
        if not can_manage and not _can_view_public_products(request.user):
            return Response(
                {"error": "You do not have permission to view products"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not can_manage:
            cache_key = f"product_detail:{pk}"
            try:
                cached = cache.get(cache_key)
                if cached is not None:
                    return Response(cached)
            except Exception:
                cached = None

        product = self._get_object(pk)
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        if not can_manage and product.product_status != ProductStatus.ACTIVE:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, context={"request": request})
        if not can_manage:
            try:
                cache.set(f"product_detail:{pk}", serializer.data, timeout=600)
            except Exception:
                pass
        return Response(serializer.data, status=status.HTTP_200_OK)
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test product.tests -v 2
```

Expected: All 5 tests pass.

- [ ] **Step 7: Commit**

```bash
git add product/signals.py product/apps.py product/views.py product/tests.py
git commit -m "feat: add Redis cache-aside and signal invalidation for products"
```

---

## Task 3: Blog caching

**Files:**
- Create: `backend/zewadi/blog/signals.py`
- Modify: `backend/zewadi/blog/apps.py`
- Modify: `backend/zewadi/blog/views.py`
- Modify: `backend/zewadi/blog/tests.py`

- [ ] **Step 1: Write failing tests for blog cache**

Open `backend/zewadi/blog/tests.py`. Replace its contents with:

```python
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
        with self.assertNumQueries(1):
            r1 = self.client.get("/api/blogs/?public=1")
        with self.assertNumQueries(0):
            r2 = self.client.get("/api/blogs/?public=1")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_blog_save(self):
        b = make_blog(self.author, title="Save Blog")
        self.client.get("/api/blogs/?public=1")   # prime cache
        b.title = "Save Blog Updated"
        b.save()
        r = self.client.get("/api/blogs/?public=1")
        titles = [item["title"] for item in r.data]
        self.assertIn("Save Blog Updated", titles)

    def test_cache_invalidated_on_blog_delete(self):
        b = make_blog(self.author, title="Delete Blog")
        self.client.get("/api/blogs/?public=1")   # prime cache
        b.delete()
        r = self.client.get("/api/blogs/?public=1")
        titles = [item["title"] for item in r.data]
        self.assertNotIn("Delete Blog", titles)


@override_settings(CACHES=CACHE_SETTINGS)
class BlogDetailCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.author = make_user(email="detail_author@test.com")

    def test_second_public_detail_served_from_cache(self):
        b = make_blog(self.author, title="Detail Blog")
        with self.assertNumQueries(1):
            r1 = self.client.get(f"/api/blogs/{b.pk}/")
        with self.assertNumQueries(0):
            r2 = self.client.get(f"/api/blogs/{b.pk}/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_blog_save(self):
        b = make_blog(self.author, title="Detail Save")
        self.client.get(f"/api/blogs/{b.pk}/")     # prime cache
        b.title = "Detail Save Updated"
        b.save()
        r = self.client.get(f"/api/blogs/{b.pk}/")
        self.assertEqual(r.data["title"], "Detail Save Updated")
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test blog.tests -v 2
```

Expected: Tests fail — second GETs still query the DB.

- [ ] **Step 3: Create blog/signals.py**

Create `backend/zewadi/blog/signals.py`:

```python
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Blog

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Blog)
def invalidate_blog_cache(sender, instance, **kwargs):
    try:
        cache.delete("blog_list_public")
        cache.delete(f"blog_detail:{instance.pk}")
    except Exception:
        logger.warning("Failed to invalidate blog cache", exc_info=True)
```

- [ ] **Step 4: Register signals in blog/apps.py**

Replace `backend/zewadi/blog/apps.py`:

```python
from django.apps import AppConfig


class BlogConfig(AppConfig):
    name = "blog"

    def ready(self):
        import blog.signals  # noqa: F401
```

- [ ] **Step 5: Add cache-aside to blog/views.py**

Open `backend/zewadi/blog/views.py`. Add the cache import at the top:

```python
from django.core.cache import cache
```

Replace the `get` method of `BlogListAPIView` (lines 36–113) with:

```python
    def get(self, request):
        user = request.user
        public_list = request.query_params.get("public") == "1" or not user.is_authenticated

        if public_list:
            try:
                cached = cache.get("blog_list_public")
                if cached is not None:
                    return Response(cached, status=status.HTTP_200_OK)
            except Exception:
                cached = None

            blogs = Blog.objects.filter(
                show_in_community_blog=True,
                status__in=[BlogStatus.PUBLISHED, BlogStatus.PENDING],
            ).order_by("-created_at")
            serializer = BlogListSerializer(blogs, many=True, context={"request": request})

            try:
                cache.set("blog_list_public", serializer.data, timeout=300)
            except Exception:
                pass

            return Response(serializer.data, status=status.HTTP_200_OK)

        has_blog_permission = has_permission(user, "blog", "view")

        if has_blog_permission:
            qs = Blog.objects.all()
        elif user.role == "COMMUNITY_USER":
            qs = Blog.objects.filter(author=user)
        else:
            return Response({"message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        search = request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(author__first_name__icontains=search)
                | Q(author__last_name__icontains=search)
            )

        tag = request.query_params.get("tag", "").strip()
        if tag:
            qs = qs.filter(tags__name__icontains=tag).distinct()

        ordering = request.query_params.get("ordering", "-created_at").strip()
        if ordering not in self.ORDERING_WHITELIST:
            ordering = "-created_at"
        qs = qs.order_by(ordering)

        serializer = BlogListSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
```

Replace the `get` method of `BlogDetailAPIView` (lines 205–255) with:

```python
    def get(self, request, blog_id):
        blog = self.get_object(blog_id)

        if not blog:
            return Response({"message": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        public_allowed = (
            blog.show_in_community_blog
            and blog.status in [BlogStatus.PUBLISHED, BlogStatus.PENDING]
        )

        if not user.is_authenticated:
            if not public_allowed:
                return Response({"message": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

            cache_key = f"blog_detail:{blog.pk}"
            try:
                cached = cache.get(cache_key)
                if cached is not None:
                    return Response(cached, status=status.HTTP_200_OK)
            except Exception:
                cached = None

            serializer = BlogSerializer(blog, context={"request": request})
            try:
                cache.set(cache_key, serializer.data, timeout=300)
            except Exception:
                pass
            return Response(serializer.data, status=status.HTTP_200_OK)

        has_blog_permission = has_permission(user, "blog", "view")
        if not (public_allowed or has_blog_permission or blog.author == user):
            return Response({"message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = BlogSerializer(blog, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test blog.tests -v 2
```

Expected: All 5 tests pass.

- [ ] **Step 7: Commit**

```bash
git add blog/signals.py blog/apps.py blog/views.py blog/tests.py
git commit -m "feat: add Redis cache-aside and signal invalidation for blogs"
```

---

## Task 4: Recipe caching

**Files:**
- Create: `backend/zewadi/recipes/signals.py`
- Modify: `backend/zewadi/recipes/apps.py`
- Modify: `backend/zewadi/recipes/views.py`
- Modify: `backend/zewadi/recipes/tests.py`

- [ ] **Step 1: Write failing tests for recipe cache**

Open `backend/zewadi/recipes/tests.py`. Replace its contents with:

```python
from django.test import TestCase, override_settings
from django.core.cache import cache
from rest_framework.test import APIClient
from .models import Recipe, RecipeStatus
from accounts.models import User
from django.utils import timezone

CACHE_SETTINGS = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "KEY_PREFIX": "zawadi",
    }
}


def make_user(email="recipe_author@test.com", role="COMMUNITY_USER"):
    return User.objects.create_user(email=email, password="testpass123", role=role)


def make_recipe(author, title="Test Recipe", status=RecipeStatus.PUBLISHED):
    return Recipe.objects.create(
        title=title,
        short_description="Short desc",
        author=author,
        status=status,
        published_at=timezone.now() if status == RecipeStatus.PUBLISHED else None,
    )


@override_settings(CACHES=CACHE_SETTINGS)
class PublishedRecipeCacheTest(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.author = make_user()

    def test_second_get_served_from_cache(self):
        make_recipe(self.author, title="Cached Recipe")
        with self.assertNumQueries(1):
            r1 = self.client.get("/api/recipes/published/")
        with self.assertNumQueries(0):
            r2 = self.client.get("/api/recipes/published/")
        self.assertEqual(r1.data, r2.data)

    def test_cache_invalidated_on_recipe_save(self):
        r = make_recipe(self.author, title="Save Recipe")
        self.client.get("/api/recipes/published/")   # prime cache
        r.title = "Save Recipe Updated"
        r.save()
        resp = self.client.get("/api/recipes/published/")
        titles = [item["title"] for item in resp.data["data"]]
        self.assertIn("Save Recipe Updated", titles)

    def test_cache_invalidated_on_recipe_delete(self):
        r = make_recipe(self.author, title="Delete Recipe")
        self.client.get("/api/recipes/published/")   # prime cache
        r.delete()
        resp = self.client.get("/api/recipes/published/")
        titles = [item["title"] for item in resp.data["data"]]
        self.assertNotIn("Delete Recipe", titles)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test recipes.tests -v 2
```

Expected: Tests fail — second GETs still hit DB.

- [ ] **Step 3: Create recipes/signals.py**

Create `backend/zewadi/recipes/signals.py`:

```python
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Recipe

logger = logging.getLogger(__name__)


@receiver([post_save, post_delete], sender=Recipe)
def invalidate_recipe_cache(sender, instance, **kwargs):
    try:
        cache.delete("published_recipes")
    except Exception:
        logger.warning("Failed to invalidate recipe cache", exc_info=True)
```

- [ ] **Step 4: Register signals in recipes/apps.py**

Replace `backend/zewadi/recipes/apps.py`:

```python
from django.apps import AppConfig


class RecipesConfig(AppConfig):
    name = "recipes"

    def ready(self):
        import recipes.signals  # noqa: F401
```

- [ ] **Step 5: Add cache-aside to recipes/views.py**

Open `backend/zewadi/recipes/views.py`. Add the cache import at the top alongside existing imports:

```python
from django.core.cache import cache
```

Replace the `get` method of `PublishedRecipeListAPIView` (lines 417–437) with:

```python
    def get(self, request):
        try:
            cached = cache.get("published_recipes")
            if cached is not None:
                return Response(cached, status=status.HTTP_200_OK)
        except Exception:
            cached = None

        recipes = Recipe.objects.select_related("author").filter(
            status=RecipeStatus.PUBLISHED
        )
        serializer = RecipeDetailSerializer(recipes, many=True, context={"request": request})
        data = {
            "success": True,
            "count": recipes.count(),
            "data": serializer.data,
        }

        try:
            cache.set("published_recipes", data, timeout=300)
        except Exception:
            pass

        return Response(data, status=status.HTTP_200_OK)
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test recipes.tests -v 2
```

Expected: All 3 tests pass.

- [ ] **Step 7: Run all app tests together to catch regressions**

```bash
cd backend/zewadi
python manage.py test product.tests blog.tests recipes.tests -v 2
```

Expected: All 13 tests pass, 0 failures.

- [ ] **Step 8: Commit**

```bash
git add recipes/signals.py recipes/apps.py recipes/views.py recipes/tests.py
git commit -m "feat: add Redis cache-aside and signal invalidation for published recipes"
```

---

## Task 5: End-to-end smoke test with Docker

- [ ] **Step 1: Build and start all services**

```bash
# From repo root
docker-compose up --build -d
```

Expected: All 4 services start (db, redis, backend, frontend).

- [ ] **Step 2: Confirm Redis is running**

```bash
docker-compose exec redis redis-cli ping
```

Expected output: `PONG`

- [ ] **Step 3: Hit a cacheable endpoint twice and check Redis**

```bash
# First request (cache miss — populates Redis)
curl -s http://localhost:8000/api/products/ | python -m json.tool | head -5

# Inspect Redis for the key
docker-compose exec redis redis-cli keys "zawadi:*"
```

Expected: At least one key matching `zawadi:*:product_list:*` appears in Redis.

- [ ] **Step 4: Confirm throttle keys also appear in Redis**

```bash
# Make a request and check throttle keys
curl -s http://localhost:8000/api/account/login/ -X POST -d '{}' -H "Content-Type: application/json"
docker-compose exec redis redis-cli keys "*throttle*"
```

Expected: Throttle keys visible in Redis (proves DRF throttles are now Redis-backed).

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verified Redis cache end-to-end in Docker"
```
