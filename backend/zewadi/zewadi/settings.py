from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
import sys as _sys
import warnings

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def env_bool(name, default=False):
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}

# ─── Security ────────────────────────────────────────────────────────────────

SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-change-me-in-production")
DEBUG = env_bool("DEBUG", False)
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# ─── Cloudinary ───────────────────────────────────────────────────────────────

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")
CLOUDINARY_UPLOAD_PRESET = os.getenv("CLOUDINARY_UPLOAD_PRESET", "zawadi_uploads")

# ─── Applications ─────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Project apps
    "accounts",
    "recipes",
    "product",
    "blog",
    "supperadmin",
    "consultant",
    "communityuser",
    "orders",
    "events",
    "notifications",
    "tax",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "axes",
]

# ─── Middleware ────────────────────────────────────────────────────────────────
# Order matters: SecurityMiddleware first, CorsMiddleware before SessionMiddleware

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "axes.middleware.AxesMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "zewadi.middleware.MaintenanceModeMiddleware",
]

# ─── CORS ─────────────────────────────────────────────────────────────────────

CORS_ALLOW_CREDENTIALS = True
_cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins.split(",") if o.strip()]
FRONTEND_URL = os.getenv("FRONTEND_URL", CORS_ALLOWED_ORIGINS[0] if CORS_ALLOWED_ORIGINS else "http://localhost:3000")
COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN") or None  # e.g. ".zewadi.com" in production
AUTH_COOKIE_SECURE = env_bool("AUTH_COOKIE_SECURE", not DEBUG)
AUTH_COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE", "Lax")

# ─── CSRF ─────────────────────────────────────────────────────────────────────

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.getenv("CSRF_TRUSTED_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

# ─── Email (SMTP) ─────────────────────────────────────────────────────────────

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@zawadi.com")

# ─── URLs & Templates ─────────────────────────────────────────────────────────

ROOT_URLCONF = "zewadi.urls"

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "zewadi.wsgi.application"

# ─── Database (PostgreSQL in production/Docker, SQLite for local dev) ─────────

_db_engine = os.getenv("DB_ENGINE", "sqlite")

if _db_engine == "postgresql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "zawadi"),
            "USER": os.getenv("DB_USER", "zawadi"),
            "PASSWORD": os.getenv("DB_PASSWORD", "zawadi"),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ─── Auth & JWT ───────────────────────────────────────────────────────────────

AUTH_USER_MODEL = "accounts.User"

AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "django.contrib.auth.backends.ModelBackend",
]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "accounts.authentication.CookieJWTAuthentication",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/minute",
        "user": "300/minute",
        "login": "5/minute",
        "register": "10/hour",
    },
    "DEFAULT_PAGINATION_CLASS": "zewadi.pagination.StandardPagination",
    "PAGE_SIZE": 20,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,       # Issue new refresh token on each refresh
    "BLACKLIST_AFTER_ROTATION": True,    # Blacklist old refresh token after rotation
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "AUTH_HEADER_TYPES": ("Bearer",),
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ─── Static & Media ───────────────────────────────────────────────────────────

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ─── Internationalisation ─────────────────────────────────────────────────────

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── Security Headers ─────────────────────────────────────────────────────────

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# Enable in production via env vars (requires HTTPS)
SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", False)
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "0"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURE_HSTS_SECONDS > 0
SECURE_HSTS_PRELOAD = SECURE_HSTS_SECONDS > 0

# Trust the X-Forwarded-Proto header from Traefik so request.build_absolute_uri()
# returns https:// in production (required for correct Google OAuth redirect URIs).
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

# ─── Upload Size Limits ───────────────────────────────────────────────────────

DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024   # 10 MB total POST body
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024    # 5 MB per file

# ─── Production Safety Guard ─────────────────────────────────────────────────

_INSECURE_KEY = "django-insecure-change-me-in-production"
_MANAGEMENT_CMDS = {"collectstatic", "migrate", "makemigrations", "shell", "createsuperuser"}
_running_cmd = _sys.argv[1] if len(_sys.argv) > 1 else ""
if not DEBUG and SECRET_KEY == _INSECURE_KEY and _running_cmd not in _MANAGEMENT_CMDS:
    raise RuntimeError(
        "Set a real SECRET_KEY environment variable before running in production."
    )

if not DEBUG and not SECURE_SSL_REDIRECT and _running_cmd not in _MANAGEMENT_CMDS:
    warnings.warn(
        "SECURE_SSL_REDIRECT is disabled. Set SECURE_SSL_REDIRECT=True in .env, "
        "or ensure your reverse proxy (Traefik/Nginx) enforces HTTPS redirection.",
        RuntimeWarning,
        stacklevel=2,
    )

# ─── Cache (Redis) ────────────────────────────────────────────────────────────
# django-redis with IGNORE_EXCEPTIONS so cache misses degrade gracefully
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        "TIMEOUT": 300,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
            "SOCKET_CONNECT_TIMEOUT": 2,
            "SOCKET_TIMEOUT": 2,
        },
        "KEY_PREFIX": "zawadi",
    }
}

# ─── GCC Tax & Currency ────────────────────────────────────────────────────────
DEFAULT_TAX_COUNTRY = "SA"

# ── Account lockout (django-axes) ─────────────────────────────────────────────
AXES_ENABLED = env_bool("AXES_ENABLED", True)
AXES_FAILURE_LIMIT = 5
AXES_COOLDOWN_TIME = 1          # hours
AXES_RESET_ON_SUCCESS = True
AXES_LOCKOUT_PARAMETERS = ["username"]  # lock by username (email), not IP
AXES_USERNAME_FORM_FIELD = "username"   # key used in Django authenticate() credentials dict
