# Security P0 + P1 Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply five security fixes identified in the pre-production audit — httpOnly JWT cookie, tax-rate admin gate, CSP/Permissions-Policy headers, HTTPS production guard, and account lockout.

**Architecture:** All backend changes are in the Django app at `backend/zewadi/`. Frontend changes are in `frontend/`. Each task is independent and commits separately. Tasks 1–3 and 6 are test-driven. Tasks 4–5 are config-only with manual verification.

**Tech Stack:** Django 6, Django REST Framework, simplejwt, django-axes, Next.js 16 (App Router), Axios, TypeScript

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `backend/zewadi/accounts/views.py` | Flip access_token cookie to httpOnly |
| Modify | `backend/zewadi/accounts/tests.py` | Tests: cookie flag, lockout |
| Modify | `backend/zewadi/accounts/serializers.py` | Add axes lockout pre-check |
| Modify | `backend/zewadi/tax/views.py` | Add admin role gate to write endpoints |
| Modify | `backend/zewadi/tax/tests.py` | Tests: 403 for non-admin on write ops |
| Modify | `backend/zewadi/zewadi/settings.py` | axes config + HTTPS warning guard |
| Modify | `backend/zewadi/requirements.txt` | Add django-axes>=7.0 |
| Modify | `backend/zewadi/.env.example` | Document production HTTPS vars |
| Modify | `frontend/next.config.ts` | Add CSP + Permissions-Policy headers |
| Modify | `frontend/src/services/api.js` | Remove localStorage reads/writes |

---

## Task 1 — Backend: Make access_token cookie httpOnly

**Files:**
- Modify: `backend/zewadi/accounts/views.py` (line 107)
- Modify: `backend/zewadi/accounts/tests.py`

- [ ] **Step 1: Write the failing test**

Open `backend/zewadi/accounts/tests.py`. Append this class at the end of the file:

```python
class LoginCookieSecurityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="cookie-sec@example.com",
            password="Pass@1234",
            user_name="cookiesec",
            full_name="Cookie Security",
            phone="+10000000099",
            role="COMMUNITY_USER",
        )
        self.user.is_active = True
        self.user.save(update_fields=["is_active"])

    def test_access_token_cookie_is_httponly(self):
        response = self.client.post(
            "/api/account/login/",
            {"email": "cookie-sec@example.com", "password": "Pass@1234"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        access_cookie = response.cookies.get("access_token")
        self.assertIsNotNone(access_cookie, "access_token cookie must be set on login")
        self.assertTrue(
            access_cookie["httponly"],
            "access_token cookie must be httpOnly — JS must not be able to read it",
        )

    def test_refresh_token_cookie_is_httponly(self):
        response = self.client.post(
            "/api/account/login/",
            {"email": "cookie-sec@example.com", "password": "Pass@1234"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        refresh_cookie = response.cookies.get("refresh_token")
        self.assertIsNotNone(refresh_cookie)
        self.assertTrue(refresh_cookie["httponly"])
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test accounts.tests.LoginCookieSecurityTests -v 2
```

Expected: `test_access_token_cookie_is_httponly` FAILS because `access_cookie["httponly"]` is currently `False`. `test_refresh_token_cookie_is_httponly` should already PASS.

- [ ] **Step 3: Fix the cookie flag**

Open `backend/zewadi/accounts/views.py`. Find `set_auth_cookies` (around line 91). Change the `access_token` cookie from `httponly=False` to `httponly=True`:

```python
def set_auth_cookies(response, refresh, access):
    secure = getattr(settings, "AUTH_COOKIE_SECURE", not settings.DEBUG)
    samesite = getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax")
    domain = getattr(settings, "COOKIE_DOMAIN", None)
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=7 * 24 * 60 * 60,
        domain=domain,
    )
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,          # ← changed from False
        secure=secure,
        samesite=samesite,
        max_age=30 * 60,
        domain=domain,
    )
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test accounts.tests.LoginCookieSecurityTests -v 2
```

Expected: `Ran 2 tests ... OK`

- [ ] **Step 5: Run full accounts test suite to check for regressions**

```bash
cd backend/zewadi
python manage.py test accounts -v 2
```

Expected: All existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/accounts/views.py backend/zewadi/accounts/tests.py
git commit -m "$(cat <<'EOF'
security(auth): make access_token cookie httpOnly

JS can no longer read the access token via document.cookie.
The browser still auto-sends the cookie on credentialed requests;
CookieJWTAuthentication reads it from request.COOKIES unchanged.
LogoutAPIView already calls delete_cookie('access_token') server-side.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2 — Frontend: Remove localStorage from api.js

**Files:**
- Modify: `frontend/src/services/api.js`

No automated test framework is configured for frontend JS. Verification is manual (browser DevTools).

- [ ] **Step 1: Update setAccessToken — remove localStorage write**

Open `frontend/src/services/api.js`. Replace the `setAccessToken` function:

```js
export const setAccessToken = (token) => {
  _memoryToken = token || null;
};
```

(Remove the `if (typeof window !== "undefined" && token) { window.localStorage.setItem(...) }` block entirely.)

- [ ] **Step 2: Update getAccessToken — return memory only**

Replace the `getAccessToken` function:

```js
export const getAccessToken = () => {
  return _memoryToken;
};
```

(Remove the `localStorage.getItem` block on lines 40–45 and the `document.cookie` fallback on lines 49–53 entirely.)

- [ ] **Step 3: Update clearAccessToken — remove localStorage and cookie clear**

Replace the `clearAccessToken` function:

```js
export const clearAccessToken = () => {
  _memoryToken = null;
};
```

(Remove `window.localStorage.removeItem(ACCESS_TOKEN_KEY)` and `document.cookie = "access_token=; Max-Age=0; path=/"` — the access_token cookie is now httpOnly and must be cleared server-side by the logout endpoint, which already calls `response.delete_cookie("access_token")`.)

- [ ] **Step 4: Remove the unused ACCESS_TOKEN_KEY constant**

Delete line 5:
```js
const ACCESS_TOKEN_KEY = "zawadi_access_token";
```

- [ ] **Step 5: Verify the complete final state of the three functions**

The three functions should look exactly like this after all edits:

```js
let _memoryToken = null;

export const setAccessToken = (token) => {
  _memoryToken = token || null;
};

export const clearAccessToken = () => {
  _memoryToken = null;
};

export const getAccessToken = () => {
  return _memoryToken;
};
```

- [ ] **Step 6: Manual verification — confirm localStorage is gone**

Start the frontend dev server:
```bash
cd frontend
npm run dev
```

Open the app in a browser. Open DevTools → Application → Local Storage → `http://localhost:3000`. Log in. Confirm `zawadi_access_token` does **not** appear. Open DevTools → Application → Cookies → confirm `access_token` cookie shows `HttpOnly` checked. Open DevTools → Console and run `document.cookie` — confirm `access_token` is **not** in the output.

- [ ] **Step 7: Verify page-reload re-auth**

While logged in, hard-reload the page (Ctrl+Shift+R). Confirm you remain logged in (the httpOnly `access_token` cookie is auto-sent by the browser, re-authenticating server-side without a redirect to login).

- [ ] **Step 8: Commit**

```bash
git add frontend/src/services/api.js
git commit -m "$(cat <<'EOF'
security(frontend): remove access token from localStorage

Token now lives in _memoryToken only. Page reloads are handled by the
httpOnly access_token cookie (auto-sent by the browser for up to 30 min)
and the 401->refresh interceptor beyond that.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3 — Backend: Tax Rate Admin Role Gate

**Files:**
- Modify: `backend/zewadi/tax/views.py`
- Modify: `backend/zewadi/tax/tests.py`

- [ ] **Step 1: Write failing tests**

Open `backend/zewadi/tax/tests.py`. The imports `datetime`, `Decimal`, `get_user_model`, `APIClient`, `TaxCategory`, `TaxRate`, and `User = get_user_model()` are already present at the top of the file — do not duplicate them.

Append this class at the end of the file:

```python
class TaxRateWritePermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.community_user = User.objects.create_user(
            email="community@taxtest.com",
            password="pass1234",
            user_name="commtax",
            full_name="Community Tester",
            phone="+10000000088",
            role="COMMUNITY_USER",
        )
        self.community_user.is_active = True
        self.community_user.save(update_fields=["is_active"])

        self.admin_user = User.objects.create_user(
            email="admin@taxtest.com",
            password="pass1234",
            user_name="admintax",
            full_name="Admin Tester",
            phone="+10000000089",
            role="ADMIN",
        )
        self.admin_user.is_active = True
        self.admin_user.save(update_fields=["is_active"])

        standard, _ = TaxCategory.objects.get_or_create(
            code="STANDARD", defaults={"name": "Standard Rate"}
        )
        self.rate, _ = TaxRate.objects.get_or_create(
            country="SA",
            tax_category=standard,
            region=None,
            is_active=True,
            defaults={
                "rate": Decimal("0.15"),
                "name": "SA Standard VAT",
                "effective_from": datetime.date(2020, 1, 1),
            },
        )

    def test_community_user_cannot_patch_tax_rate(self):
        self.client.force_authenticate(user=self.community_user)
        response = self.client.patch(
            f"/api/tax/rates/{self.rate.pk}/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_community_user_cannot_delete_tax_rate(self):
        self.client.force_authenticate(user=self.community_user)
        response = self.client.delete(f"/api/tax/rates/{self.rate.pk}/")
        self.assertEqual(response.status_code, 403)

    def test_community_user_cannot_create_tax_rate(self):
        self.client.force_authenticate(user=self.community_user)
        response = self.client.post(
            "/api/tax/rates/",
            {
                "country": "AE",
                "tax_category": "STANDARD",
                "rate_percent": 5,
                "name": "AE VAT",
                "effective_from": "2020-01-01",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_admin_can_patch_tax_rate(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(
            f"/api/tax/rates/{self.rate.pk}/",
            {"name": "SA VAT Updated"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_unauthenticated_cannot_patch_tax_rate(self):
        response = self.client.patch(
            f"/api/tax/rates/{self.rate.pk}/",
            {"is_active": False},
            format="json",
        )
        self.assertIn(response.status_code, [401, 403])
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test tax.tests.TaxRateWritePermissionTests -v 2
```

Expected: `test_community_user_cannot_patch_tax_rate`, `test_community_user_cannot_delete_tax_rate`, `test_community_user_cannot_create_tax_rate` FAIL with status 200 (no gate currently).

- [ ] **Step 3: Add IsAdminRole import and gate to tax/views.py**

Open `backend/zewadi/tax/views.py`. Add the import at line 4 (after the existing DRF imports):

```python
from supperadmin.utils.permissions import IsAdminRole
```

Then update `tax_rate_list` — add an admin check at the top of the POST branch. Find the `# POST — create a new rate` comment and insert the guard immediately after it:

```python
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def tax_rate_list(request):
    if request.method == "GET":
        rates = TaxRate.objects.select_related("tax_category").order_by(
            "country", "tax_category__code"
        )
        return Response([_rate_to_dict(r) for r in rates])

    # POST — create a new rate
    if not IsAdminRole().has_permission(request, None):
        return Response(
            {"error": "Admin access required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    country = str(request.data.get("country", "")).upper().strip()
    # ... rest of POST handler unchanged
```

Then update `tax_rate_detail` — change the `permission_classes` decorator:

```python
@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated, IsAdminRole])
def tax_rate_detail(request, pk):
    # ... body unchanged
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test tax.tests.TaxRateWritePermissionTests -v 2
```

Expected: `Ran 5 tests ... OK`

- [ ] **Step 5: Run full tax test suite**

```bash
cd backend/zewadi
python manage.py test tax -v 2
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/tax/views.py backend/zewadi/tax/tests.py
git commit -m "$(cat <<'EOF'
security(tax): gate tax rate write endpoints to admin role

PATCH/DELETE /api/tax/rates/<pk>/ and POST /api/tax/rates/ now require
IsAdminRole. Community users and consultants receive 403. GET (listing)
remains open to all authenticated users for the admin dashboard.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4 — Frontend: CSP + Permissions-Policy Headers

**Files:**
- Modify: `frontend/next.config.ts`

- [ ] **Step 1: Add headers() to next.config.ts**

Open `frontend/next.config.ts`. Replace the entire `nextConfig` object (the `const nextConfig: NextConfig = { ... }` block) with:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/recipes/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/recipes/**" },
      { protocol: mediaHost.protocol, hostname: mediaHost.hostname, ...(mediaHost.port ? { port: mediaHost.port } : {}), pathname: "/media/**" },
      { protocol: mediaHost.protocol, hostname: mediaHost.hostname, ...(mediaHost.port ? { port: mediaHost.port } : {}), pathname: "/recipes/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com`,
      "font-src 'self' data:",
      `connect-src 'self' ${apiOrigin} https://api.cloudinary.com`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
```

Note: `apiOrigin` is already defined earlier in the file (parsed from `NEXT_PUBLIC_API_URL`). Do not redeclare it.

- [ ] **Step 2: Build to confirm no TypeScript errors**

```bash
cd frontend
npm run build
```

Expected: Build succeeds with no errors. If `NEXT_PUBLIC_API_URL` is not set in the environment, the build will throw the guard error at the top of `next.config.ts` — set it first:
```bash
$env:NEXT_PUBLIC_API_URL="http://localhost:8000/api"
npm run build
```

- [ ] **Step 3: Manual verification — confirm headers are present**

Start the dev server and curl a page response:
```bash
cd frontend
npm run dev
# In another terminal:
curl -s -I http://localhost:3000 | grep -i "content-security-policy\|permissions-policy"
```

Expected output includes both:
```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
permissions-policy: camera=(), microphone=(), geolocation=()
```

- [ ] **Step 4: Commit**

```bash
git add frontend/next.config.ts
git commit -m "$(cat <<'EOF'
security(frontend): add CSP and Permissions-Policy headers

Blocks object-src, restricts frame-ancestors, limits connect-src to
self + API origin + Cloudinary. unsafe-inline required for Next.js
App Router hydration and Tailwind v4 inline styles.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5 — Backend: HTTPS / HSTS Production Warning Guard

**Files:**
- Modify: `backend/zewadi/zewadi/settings.py`
- Modify: `backend/zewadi/.env.example`

No automated test — the warning fires at import time, which conflicts with Django's test settings loader. Manual verification below.

- [ ] **Step 1: Add import warnings to settings.py**

Open `backend/zewadi/zewadi/settings.py`. Add `import warnings` to the imports block at the top (after `import sys as _sys`):

```python
import warnings
```

- [ ] **Step 2: Add the HTTPS warning guard**

In `settings.py`, find the existing production safety guard block (around line 232):

```python
_INSECURE_KEY = "django-insecure-change-me-in-production"
_MANAGEMENT_CMDS = {"collectstatic", "migrate", "makemigrations", "shell", "createsuperuser"}
_running_cmd = _sys.argv[1] if len(_sys.argv) > 1 else ""
if not DEBUG and SECRET_KEY == _INSECURE_KEY and _running_cmd not in _MANAGEMENT_CMDS:
    raise RuntimeError(
        "Set a real SECRET_KEY environment variable before running in production."
    )
```

Append the HTTPS warning **immediately after** that block:

```python
if not DEBUG and not SECURE_SSL_REDIRECT and _running_cmd not in _MANAGEMENT_CMDS:
    warnings.warn(
        "SECURE_SSL_REDIRECT is disabled. "
        "Set SECURE_SSL_REDIRECT=True in .env, or ensure your reverse proxy (Traefik/Nginx) "
        "enforces HTTPS redirection.",
        RuntimeWarning,
        stacklevel=2,
    )
```

- [ ] **Step 3: Update .env.example with production HTTPS vars**

Open `backend/zewadi/.env.example`. Add a production section. Find the end of the file and append:

```
# ── Production security (set before deploying) ───────────────────────
# SECURE_SSL_REDIRECT=True        # Enable Django HTTPS redirect (if not handled by proxy)
# SECURE_HSTS_SECONDS=31536000    # Enable HSTS for 1 year after confirming HTTPS works
```

- [ ] **Step 4: Manual verification of the warning**

Run the server in a simulated production mode (without SSL redirect, so the warning fires):

```bash
cd backend/zewadi
DEBUG=False SECRET_KEY=a-real-secret-key SECURE_SSL_REDIRECT=False python manage.py check
```

Expected: output includes `RuntimeWarning: SECURE_SSL_REDIRECT is disabled...`

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/zewadi/settings.py backend/zewadi/.env.example
git commit -m "$(cat <<'EOF'
security(settings): add HTTPS warning guard and document production env vars

Warn at startup when DEBUG=False and SECURE_SSL_REDIRECT=False so
operators are reminded to activate HTTPS or confirm proxy handles it.
Documents SECURE_SSL_REDIRECT and SECURE_HSTS_SECONDS in .env.example.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6 — Backend: Account Lockout via django-axes

**Files:**
- Modify: `backend/zewadi/requirements.txt`
- Modify: `backend/zewadi/zewadi/settings.py`
- Modify: `backend/zewadi/accounts/serializers.py`
- Modify: `backend/zewadi/accounts/tests.py`

- [ ] **Step 1: Write failing tests**

Open `backend/zewadi/accounts/tests.py`. Append this class at the end:

```python
from django.test import override_settings

@override_settings(
    AXES_ENABLED=True,
    AXES_FAILURE_LIMIT=5,
    AXES_COOLDOWN_TIME=1,
    AXES_ONLY_USER_FAILURES=True,
    AXES_RESET_ON_SUCCESS=True,
)
class AccountLockoutTests(APITestCase):
    def setUp(self):
        self.victim = User.objects.create_user(
            email="victim@lockout.com",
            password="Correct@1234",
            user_name="victimuser",
            full_name="Victim User",
            phone="+10000000077",
            role="COMMUNITY_USER",
        )
        self.victim.is_active = True
        self.victim.save(update_fields=["is_active"])

    def _bad_login(self):
        return self.client.post(
            "/api/account/login/",
            {"email": "victim@lockout.com", "password": "WrongPassword!"},
            format="json",
        )

    def test_account_locks_after_5_failed_attempts(self):
        for _ in range(5):
            self._bad_login()

        response = self._bad_login()
        self.assertEqual(response.status_code, 400)
        errors = str(response.data)
        self.assertIn("locked", errors.lower())

    def test_successful_login_resets_lockout_counter(self):
        for _ in range(4):
            self._bad_login()

        # Correct login resets the counter
        self.client.post(
            "/api/account/login/",
            {"email": "victim@lockout.com", "password": "Correct@1234"},
            format="json",
        )

        # Should be able to fail again without triggering lockout yet
        response = self._bad_login()
        errors = str(response.data)
        self.assertNotIn("locked", errors.lower())

    def test_lockout_message_is_user_friendly(self):
        for _ in range(5):
            self._bad_login()

        response = self._bad_login()
        errors = str(response.data)
        self.assertIn("locked", errors.lower())
        # Must not say "Invalid credentials" — that's the wrong message for lockout
        self.assertNotEqual(errors.strip(), "['Invalid credentials']")
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend/zewadi
python manage.py test accounts.tests.AccountLockoutTests -v 2
```

Expected: Tests FAIL — `axes` is not installed yet, so `ImportError` or `ModuleNotFoundError`.

- [ ] **Step 3: Install django-axes**

Open `backend/zewadi/requirements.txt`. Add after `django-redis>=5.4`:

```
django-axes>=7.0
```

Install it:

```bash
cd backend/zewadi
pip install django-axes
```

- [ ] **Step 4: Add axes to INSTALLED_APPS and AUTHENTICATION_BACKENDS**

Open `backend/zewadi/zewadi/settings.py`.

In `INSTALLED_APPS`, add `"axes"` after the project apps block (before the `# Third-party` comment or at the end of the list):

```python
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
```

Find the **existing** `AUTHENTICATION_BACKENDS` list (around line 148 — it already has `ModelBackend`). Add `AxesStandaloneBackend` to it:

```python
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "axes.backends.AxesStandaloneBackend",   # ← add this line
]
```

Add the axes config block at the end of `settings.py` (after `DEFAULT_TAX_COUNTRY`):

```python
# ─── Account lockout (django-axes) ───────────────────────────────────────────

AXES_ENABLED = env_bool("AXES_ENABLED", True)
AXES_FAILURE_LIMIT = 5          # Lock after 5 consecutive failures
AXES_COOLDOWN_TIME = 1          # Unlock after 1 hour
AXES_RESET_ON_SUCCESS = True    # Reset failure counter on successful login
AXES_ONLY_USER_FAILURES = True  # Track by username (email), not by IP
```

- [ ] **Step 5: Run the migration**

```bash
cd backend/zewadi
python manage.py migrate
```

Expected: Creates `axes_accessattempt` and `axes_accesslog` tables.

- [ ] **Step 6: Add the lockout pre-check to LoginSerializer**

Open `backend/zewadi/accounts/serializers.py`. Add the axes import at the top of the file (after `from django.contrib.auth import authenticate`):

```python
from axes.handlers.proxy import AxesProxyHandler
```

Then inside `LoginSerializer.validate()`, add the lockout check **after** the `user_obj = User.objects.get(...)` lookup and the `is_active` check, **before** the `authenticate()` call. The full `validate` method becomes:

```python
def validate(self, data):
    email = User.objects.normalize_email(data["email"].strip()).lower()
    try:
        user_obj = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        raise serializers.ValidationError("Invalid credentials")

    if not user_obj.is_active:
        raise serializers.ValidationError(
            "Please verify your email before logging in. Check your inbox for a verification code."
        )

    request = self.context.get("request")
    if AxesProxyHandler.is_already_locked(request, credentials={"username": user_obj.email}):
        raise serializers.ValidationError(
            "Account temporarily locked due to too many failed login attempts. "
            "Please try again in 1 hour or contact support."
        )

    user = authenticate(
        request=request,
        username=user_obj.email,
        password=data["password"],
    )
    if not user:
        raise serializers.ValidationError("Invalid credentials")

    refresh = RefreshToken.for_user(user)
    return {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role.lower(),
        "user_type": getattr(getattr(user, "communityuser", None), "user_type", None),
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
```

- [ ] **Step 7: Run axes tests to confirm they pass**

```bash
cd backend/zewadi
python manage.py test accounts.tests.AccountLockoutTests -v 2
```

Expected: `Ran 3 tests ... OK`

- [ ] **Step 8: Run full accounts test suite**

```bash
cd backend/zewadi
python manage.py test accounts -v 2
```

Expected: All tests pass. If existing tests fail because axes is interfering, add `AXES_ENABLED=False` to the `AXES_ENABLED` env var when running tests, or add `@override_settings(AXES_ENABLED=False)` to the affected test class.

- [ ] **Step 9: Run all backend tests**

```bash
cd backend/zewadi
python manage.py test -v 2
```

Expected: All tests pass across all apps.

- [ ] **Step 10: Commit**

```bash
git add backend/zewadi/requirements.txt \
        backend/zewadi/zewadi/settings.py \
        backend/zewadi/accounts/serializers.py \
        backend/zewadi/accounts/tests.py
git commit -m "$(cat <<'EOF'
security(auth): add account lockout via django-axes

After 5 consecutive failed login attempts, the account is locked for
1 hour. The lockout pre-check in LoginSerializer gives a clear error
message. Successful login resets the failure counter.
Tracking is by username (email), not by IP.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Verification Checklist

After all 6 tasks, confirm each success criterion from the spec:

1. Open DevTools → Application → Local Storage after login: `zawadi_access_token` must not appear
2. Open DevTools → Application → Cookies after login: `access_token` must show `HttpOnly ✓`
3. Run `document.cookie` in DevTools Console: `access_token` must not appear in the output
4. Hard-reload while logged in: user stays logged in (no redirect to login)
5. `PATCH /api/tax/rates/1/` with a community-user Bearer token returns `403`
6. `curl -I http://localhost:3000` response includes `content-security-policy:` and `permissions-policy:`
7. `DEBUG=False SECRET_KEY=somekey SECURE_SSL_REDIRECT=False python manage.py check` prints `RuntimeWarning: SECURE_SSL_REDIRECT is disabled`
8. 5 failed logins → 6th attempt response body contains "locked"
9. Successful login after 4 failures → next failure gives "Invalid credentials" (not "locked")
