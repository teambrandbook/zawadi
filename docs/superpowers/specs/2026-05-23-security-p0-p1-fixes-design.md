# Security P0 + P1 Fixes — Design Spec

**Date:** 2026-05-23
**Status:** Approved
**Branch:** feat/prodbugfix

---

## Scope

Five security fixes identified in the pre-production security audit, prioritised P0 (critical, ship-blocking) and P1 (high, ship before launch):

| # | Priority | Fix | Effort |
|---|----------|-----|--------|
| 1 | P0 | JWT access token: remove localStorage + make cookie httpOnly | Medium |
| 2 | P0 | Tax rate endpoints: add admin role gate to write operations | Low |
| 3 | P0 | CSP + Permissions-Policy headers on Next.js frontend | Low |
| 4 | P1 | HTTPS / HSTS: production activation + warning guard | Low |
| 5 | P1 | Account lockout via `django-axes` | Low |

---

## Fix 1 — JWT Full Fix

### Problem
The JWT access token is stored in two JS-readable locations:
- `localStorage` under key `zawadi_access_token` (`api.js:26`)
- A non-httpOnly cookie `access_token` (`accounts/views.py:107`)

Either can be read by an XSS payload. The refresh token is correctly httpOnly.

### Solution

**Backend — `accounts/views.py:107`**

Change `httponly=False` → `httponly=True` on the `access_token` cookie inside `set_auth_cookies()`. The cookie is still auto-sent by the browser on every `withCredentials: true` request; `CookieJWTAuthentication` reads it from `request.COOKIES` — server-side auth is unchanged.

The `LogoutAPIView` already calls `response.delete_cookie("access_token")` at lines 650 and 666, so logout correctly clears the now-httpOnly cookie server-side.

**Frontend — `services/api.js`**

Three changes:
1. `setAccessToken(token)`: remove `window.localStorage.setItem(ACCESS_TOKEN_KEY, token)`. Keep `_memoryToken = token`.
2. `getAccessToken()`: remove the `localStorage.getItem` block (lines 40–45) and the `document.cookie` read fallback (lines 49–53). Return only `_memoryToken`.
3. `clearAccessToken()`: remove `window.localStorage.removeItem(ACCESS_TOKEN_KEY)` and `document.cookie = "access_token=; Max-Age=0; path=/"` (JS cannot clear an httpOnly cookie anyway).

### Page-reload behaviour (no regression)

On reload `_memoryToken` is null. The browser auto-sends the httpOnly `access_token` cookie, which authenticates the request server-side for up to 30 minutes. After the 30-minute expiry, the existing 401 → `/account/refresh/` interceptor fires, uses the httpOnly `refresh_token` cookie, gets a new access token in the response body (`data.access`), and populates `_memoryToken` via `setAccessToken`. No user-visible change at any point.

### What does NOT change
- `_memoryToken` module variable — stays as the in-memory token cache
- Response interceptor that reads `response.data?.access` and calls `setAccessToken` — unchanged
- `withCredentials: true` on the axios instance — unchanged
- 401 → refresh → retry flow — unchanged

---

## Fix 2 — Tax Rate Role Gate

### Problem
`PATCH /api/tax/rates/<pk>/` and `DELETE /api/tax/rates/<pk>/` (and `POST /api/tax/rates/`) only require `IsAuthenticated`. Any logged-in community user can modify or delete tax rates.

### Solution

**`tax/views.py`** — two changes:

**`tax_rate_detail`**: change permission decorator from `@permission_classes([IsAuthenticated])` to `@permission_classes([IsAuthenticated, IsAdminRole])`. DRF AND-gates them — unauthenticated gets 401, non-admin gets 403.

**`tax_rate_list` POST branch**: add an inline check at the top of the POST handler:
```python
if not IsAdminRole().has_permission(request, None):
    return Response(
        {"error": "Admin access required."},
        status=status.HTTP_403_FORBIDDEN,
    )
```
GET on `tax_rate_list` remains `IsAuthenticated` only — the admin dashboard still lists rates for all staff roles.

`IsAdminRole` is imported from `supperadmin.utils.permissions` (already imported in other files across the project).

---

## Fix 3 — CSP + Permissions-Policy Headers

### Problem
No `Content-Security-Policy` or `Permissions-Policy` header is configured. Without CSP, XSS payloads face no browser-level containment.

### Solution

**`frontend/next.config.ts`** — add an `async headers()` function to the `nextConfig` object:

```ts
async headers() {
  const apiOriginForCSP = apiOrigin;   // already parsed at top of file
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",      // required: Next.js App Router hydration
            "style-src 'self' 'unsafe-inline'",        // required: Tailwind v4 inline styles
            `img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com`,
            "font-src 'self' data:",
            `connect-src 'self' ${apiOriginForCSP} https://api.cloudinary.com`,
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
          ].join("; "),
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ];
},
```

### Limitations acknowledged
`'unsafe-inline'` in `script-src` is required by Next.js App Router hydration and prevents strict inline-script blocking. The CSP still provides value: blocks arbitrary external script domains, prevents plugin injection (`object-src 'none'`), prevents framing (`frame-ancestors 'none'`), and restricts form targets. A nonce-based strict CSP is a separate future task.

---

## Fix 4 — HTTPS / HSTS Production Activation

### Problem
`SECURE_SSL_REDIRECT` defaults to `False` and `SECURE_HSTS_SECONDS` to `0`. The `.env.example` leaves both as-is. A deployment using the defaults ships without HTTPS enforcement.

### Solution

**`backend/zewadi/.env.example`** — add a clearly labelled production block:
```
# ── Production (uncomment and set before deploying) ──────────────────
# SECURE_SSL_REDIRECT=True
# SECURE_HSTS_SECONDS=31536000
```

**`backend/zewadi/zewadi/settings.py`** — add a `warnings.warn()` beneath the existing insecure-key guard (not a `RuntimeError` — Traefik/Nginx setups legitimately terminate TLS at the proxy with `SECURE_SSL_REDIRECT=False`):
```python
import warnings

if not DEBUG and not SECURE_SSL_REDIRECT and _running_cmd not in _MANAGEMENT_CMDS:
    warnings.warn(
        "SECURE_SSL_REDIRECT is disabled. Ensure your reverse proxy enforces HTTPS redirection.",
        RuntimeWarning,
        stacklevel=2,
    )
```

Note: `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` is already set in `settings.py`, so behind Traefik the app correctly detects HTTPS even without `SECURE_SSL_REDIRECT=True`.

---

## Fix 5 — Account Lockout via django-axes

### Problem
`LoginAPIView` rate-throttles at 5 requests/minute but does not lock accounts. An attacker can retry indefinitely by spacing requests across throttle windows.

### Solution

**New dependency**: `django-axes>=7.0` added to `requirements.txt`.

**`settings.py`** additions:
```python
AXES_FAILURE_LIMIT = 5           # lock after 5 failed attempts
AXES_COOLDOWN_TIME = 1           # unlock after 1 hour (integer = hours)
AXES_RESET_ON_SUCCESS = True     # reset failure counter on successful login
AXES_ONLY_USER_FAILURES = True   # lock by username (email), not by IP
```

**`INSTALLED_APPS`**: add `'axes'` (after existing apps).

**`AUTHENTICATION_BACKENDS`**: append `'axes.backends.AxesStandaloneBackend'` after `ModelBackend`.

**Migration**: `python manage.py migrate` creates the `axes_accessattempt` and `axes_accesslog` tables.

**`accounts/serializers.py` — `LoginSerializer.validate()`**: add a pre-auth lockout check before the `authenticate()` call at line 201 to give users a meaningful error instead of the generic "Invalid credentials" that results when axes blocks `authenticate()` silently:

```python
from axes.handlers.proxy import AxesProxyHandler

# Inside validate(), after normalising email, before authenticate():
request = self.context.get("request")
if AxesProxyHandler.is_already_locked(request, credentials={"username": email}):
    raise serializers.ValidationError(
        "Account temporarily locked due to too many failed login attempts. "
        "Please try again in 1 hour or contact support."
    )
```

`LoginSerializer.validate()` already calls `authenticate(request=request, username=user_obj.email, password=...)` — axes hooks into `authenticate()` automatically via `AxesStandaloneBackend`, so failed-attempt tracking requires no additional code.

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/accounts/views.py` |
| Modify | `backend/zewadi/accounts/serializers.py` |
| Modify | `backend/zewadi/tax/views.py` |
| Modify | `backend/zewadi/zewadi/settings.py` |
| Modify | `backend/zewadi/requirements.txt` |
| Modify | `backend/zewadi/.env.example` |
| Modify | `frontend/next.config.ts` |
| Modify | `frontend/src/services/api.js` |

---

## Delivery

All 5 fixes on the current branch `feat/prodbugfix`, each as its own commit, in the order listed above. One PR to `main`.

---

## Success Criteria

1. `localStorage.getItem('zawadi_access_token')` returns `null` after login
2. `document.cookie` does not contain `access_token=` after login
3. Page reload re-authenticates transparently (no login redirect) for sessions under 30 min
4. `PATCH /api/tax/rates/1/` with a community-user JWT returns 403
5. CSP header is present on all Next.js page responses
6. `Permissions-Policy` header is present on all Next.js page responses
7. Startup in non-DEBUG mode with `SECURE_SSL_REDIRECT=False` prints a RuntimeWarning
8. After 5 failed logins, the 6th attempt returns a lockout message instead of "Invalid credentials"
9. Successful login resets the failure counter (re-testing after success works normally)
