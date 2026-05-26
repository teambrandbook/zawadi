"""
Test settings - override production settings for testing.
"""
from .settings import *  # noqa

# Use local memory cache for tests instead of Redis
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

# Override throttle rates for testing to avoid false positives from cache locality
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
    "anon": "10000/minute",  # Effectively unlimited for testing
    "user": "10000/minute",
    "login": "10000/minute",
    "register": "10000/minute",
    "otp_verify": "2/minute",  # Keep strict for OTP throttle tests
    "otp_resend": "3/hour",     # Keep strict for OTP resend throttle tests
}
