# Redis Caching Design — Zawadi

**Date:** 2026-05-13  
**Status:** Approved  
**Scope:** Django backend only — no frontend changes

---

## Goal

Add Redis as a shared cache and throttle backend to reduce Postgres load on high-traffic read endpoints and make rate limiting resilient across multiple Gunicorn workers and server restarts.

---

## Architecture

### Cache Pattern: Cache-Aside

Views check Redis first. On a miss they query Postgres, store the serialized response in Redis, then return it. On a hit Postgres is never touched. Writes (POST/PUT/PATCH/DELETE) trigger signal-based invalidation.

### Invalidation Strategy: Django Signals

`post_save` and `post_delete` signals on each relevant model delete the affected cache keys automatically. No manual `cache.delete()` calls in views.

### Throttle Backend

DRF throttle classes read from Django's `CACHES` backend. Pointing `CACHES` at Redis makes all existing throttles (login: 5/min, register: 10/hour) Redis-backed automatically — no code change to throttle classes.

---

## Infrastructure Changes

### docker-compose.yml

Add a `redis:7-alpine` service. The backend service gains a `depends_on: redis` entry.

```yaml
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

Backend environment adds:
```yaml
REDIS_URL: redis://redis:6379/0
```

### requirements.txt

```
django-redis>=5.4
```

### settings.py

```python
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

### .env.example

```
REDIS_URL=redis://redis:6379/0
```

---

## Cached Endpoints

| Endpoint | Cache Key | TTL | Invalidated by |
|----------|-----------|-----|----------------|
| `GET /api/products/` | `product_list:{category}:{search}:{ordering}` | 3 min | Product post_save / post_delete |
| `GET /api/products/<id>/` | `product_detail:{id}` | 10 min | Product post_save / post_delete |
| `GET /api/blogs/?public=1` | `blog_list_public` | 5 min | Blog post_save / post_delete |
| `GET /api/blogs/<id>/` | `blog_detail:{id}` | 5 min | Blog post_save / post_delete |
| `GET /api/recipes/published/` | `published_recipes` | 5 min | Recipe post_save / post_delete |

**Not cached (intentional):**
- Orders, cart, user-specific recipe lists — mutable per-user state
- Any authenticated endpoint with user-specific filtering

---

## Component Changes

### product/signals.py (new)

```python
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Product

@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, instance, **kwargs):
    cache.delete(f"zawadi:product_detail:{instance.pk}")
    cache.delete_pattern("zawadi:product_list:*")
```

### product/apps.py

Import signals in `ready()`.

### product/views.py

Cache-aside added to `ProductListCreateView.get()` and `ProductDetailView.get()`. All `cache.get` / `cache.set` calls are wrapped in `try/except Exception` so a Redis outage falls back to Postgres silently:

```python
cache_key = f"product_list:{category}:{search}:{ordering}"
cached = cache.get(cache_key)
if cached:
    return Response(cached)
# ... query + serialize ...
cache.set(cache_key, data, timeout=180)
return Response(data)
```

Same pattern applied to detail view with key `product_detail:{pk}` and 600s timeout.

### blog/signals.py (new)

Invalidates `blog_list_public` and `blog_detail:{id}` on Blog save/delete.

### blog/apps.py

Import signals in `ready()`.

### blog/views.py

Cache-aside on `BlogListAPIView` (public=1 requests only) and `BlogDetailAPIView`.  
Non-public/authenticated list requests are **not** cached.

### recipes/signals.py (new)

Invalidates `published_recipes` on Recipe save/delete.

### recipes/apps.py

Import signals in `ready()`.

### recipes/views.py

Cache-aside on `PublishedRecipeListAPIView` only.

---

## Data Flow

```
Client GET /api/products/
        │
        ▼
  Django View
        │
        ├─── cache.get(key) ──► Redis HIT ──► return cached Response
        │
        └─── Redis MISS
                │
                ▼
           Postgres query
                │
                ▼
           Serialize
                │
                ├─── cache.set(key, data, timeout)
                │
                ▼
           return Response

Product updated (admin panel / API write)
        │
        ▼
  post_save signal fires
        │
        ├─── cache.delete(product_detail:{id})
        └─── cache.delete_pattern(product_list:*)
```

---

## Error Handling

- If Redis is unavailable, `django-redis` raises `ConnectionError`. Views must not crash — wrap cache calls in `try/except` with a fallback to Postgres.
- Signals that fail to invalidate should log a warning, not raise.

---

## What Is Not Changed

- No frontend changes
- No Celery or async workers
- No session backend change (sessions remain default)
- No changes to throttle class definitions — they inherit Redis automatically

---

## Out of Scope

- Celery task queue (future phase)
- Frontend HTTP cache headers / ETags
- S3 media storage
- Authenticated user-specific caching
