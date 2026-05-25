# Security P2 + P3 Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement four P2 security fixes (OTP throttling, admin path, OAuth state, DOMPurify) and three P3 fixes (Cloudinary formats, profile race condition, FRONTEND_URL guard) on branch `feat/prodbugfix`.

**Architecture:** Backend fixes go in `backend/zewadi/`; frontend fixes in `frontend/src/`. Each task is independently deployable. Tests use Django's `APITestCase` for backend and `npm run lint` + `npm run build` for frontend verification.

**Tech Stack:** Django 6, DRF, djangorestframework-simplejwt, Next.js 16 App Router, TypeScript, isomorphic-dompurify (new dependency).

**Working directory:** `d:/Brandbook/zawadi`
**Branch:** `feat/prodbugfix`
**Backend root:** `backend/zewadi/` — run all Django commands from there
**Virtual env:** activate with `backend/zewadi/.venv/Scripts/activate` (Windows) before running `python manage.py` commands if not already active

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/accounts/throttles.py` |
| Modify | `backend/zewadi/accounts/views.py` |
| Modify | `backend/zewadi/accounts/tests.py` |
| Modify | `backend/zewadi/zewadi/settings.py` |
| Modify | `backend/zewadi/zewadi/urls.py` |
| Modify | `backend/zewadi/.env.example` |
| Create | `frontend/src/utils/sanitize.ts` |
| Modify | `frontend/src/components/home/HeroSection.tsx` |
| Modify | `frontend/src/components/home/MeaningSection.tsx` |
| Modify | `frontend/src/components/home/LearnMoreSection.tsx` |
| Modify | `frontend/src/components/home/CommunitySection.tsx` |
| Modify | `frontend/src/components/about/about.tsx` |
| Modify | `frontend/src/components/events/EventTestimonials.tsx` |
| Modify | `frontend/src/components/events/CommunitySection.tsx` |
| Modify | `backend/zewadi/communityuser/views.py` (P3) |

---

### Task 1: OTP Endpoint Brute-Force Throttling

**Files:**
- Modify: `backend/zewadi/accounts/throttles.py`
- Modify: `backend/zewadi/zewadi/settings.py` (add throttle scopes)
- Modify: `backend/zewadi/accounts/views.py` (swap throttle classes on 3 views)
- Modify: `backend/zewadi/accounts/tests.py` (add throttle tests)

**Context:**
- `LoginRateThrottle` is scope `"login"` at 5/minute — currently applied to OTPVerifyAPIView, PasswordResetVerifyAPIView, OTPResendAPIView
- `DEFAULT_THROTTLE_RATES` is in `settings.py` under `REST_FRAMEWORK`
- `OTPVerifyAPIView` throttle_classes is at `accounts/views.py:264`
- `OTPResendAPIView` throttle_classes is at `accounts/views.py:321`
- `PasswordResetVerifyAPIView` throttle_classes is at `accounts/views.py:370`
- The import line for throttles in views.py is: `from .throttles import LoginRateThrottle, RegisterRateThrottle`

- [ ] **Step 1: Write the failing tests**

Read `backend/zewadi/accounts/tests.py` first to find the last line. Then append this class:

```python
class OTPThrottleTests(APITestCase):
    """OTPVerifyAPIView and PasswordResetVerifyAPIView must throttle at 2/min."""

    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.user = User.objects.create_user(
            email="throttle@example.com",
            password="Pass@1234",
            user_name="throttleuser",
            full_name="Throttle User",
            phone="+10000000077",
            role="COMMUNITY_USER",
        )
        self.user.is_active = True
        self.user.save(update_fields=["is_active"])

    def tearDown(self):
        from django.core.cache import cache
        cache.clear()

    def test_otp_verify_throttled_after_two_requests(self):
        """Third OTP verify attempt in a minute must return 429."""
        for _ in range(2):
            self.client.post(
                "/api/account/otp/verify/",
                {"email": "throttle@example.com", "code": "000000", "purpose": "email_verification"},
                format="json",
            )
        response = self.client.post(
            "/api/account/otp/verify/",
            {"email": "throttle@example.com", "code": "000000", "purpose": "email_verification"},
            format="json",
        )
        self.assertEqual(response.status_code, 429)

    def test_password_reset_verify_throttled_after_two_requests(self):
        """Third password-reset verify attempt in a minute must return 429."""
        for _ in range(2):
            self.client.post(
                "/api/account/password-reset/verify/",
                {"email": "throttle@example.com", "code": "000000"},
                format="json",
            )
        response = self.client.post(
            "/api/account/password-reset/verify/",
            {"email": "throttle@example.com", "code": "000000"},
            format="json",
        )
        self.assertEqual(response.status_code, 429)
```

Note: you must check the actual URL patterns to confirm `/api/account/otp/verify/` and `/api/account/password-reset/verify/` — read `backend/zewadi/accounts/urls.py` first and adjust if different.

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd backend/zewadi && python manage.py test accounts.tests.OTPThrottleTests -v 2
```

Expected: 2 test failures — throttle is not tight enough yet (5/min allows 3rd attempt through).

- [ ] **Step 3: Add throttle classes to `accounts/throttles.py`**

Current file:
```python
from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    scope = "login"


class RegisterRateThrottle(AnonRateThrottle):
    scope = "register"
```

New file:
```python
from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    scope = "login"


class RegisterRateThrottle(AnonRateThrottle):
    scope = "register"


class OTPVerifyRateThrottle(AnonRateThrottle):
    scope = "otp_verify"


class OTPResendRateThrottle(AnonRateThrottle):
    scope = "otp_resend"
```

- [ ] **Step 4: Add throttle scopes to `settings.py`**

Find the `DEFAULT_THROTTLE_RATES` dict in `settings.py` (inside `REST_FRAMEWORK`). It currently has:
```python
"DEFAULT_THROTTLE_RATES": {
    "anon": "60/minute",
    "user": "300/minute",
    "login": "5/minute",
    "register": "10/hour",
},
```

Add the two new scopes:
```python
"DEFAULT_THROTTLE_RATES": {
    "anon": "60/minute",
    "user": "300/minute",
    "login": "5/minute",
    "register": "10/hour",
    "otp_verify": "2/minute",
    "otp_resend": "3/hour",
},
```

- [ ] **Step 5: Update the import in `accounts/views.py`**

Find the line (near top of file):
```python
from .throttles import LoginRateThrottle, RegisterRateThrottle
```
Change to:
```python
from .throttles import LoginRateThrottle, OTPResendRateThrottle, OTPVerifyRateThrottle, RegisterRateThrottle
```

- [ ] **Step 6: Swap throttle classes on the three views**

In `accounts/views.py`:

1. `OTPVerifyAPIView` — change `throttle_classes = [LoginRateThrottle]` to `throttle_classes = [OTPVerifyRateThrottle]`
2. `OTPResendAPIView` — change `throttle_classes = [LoginRateThrottle]` to `throttle_classes = [OTPResendRateThrottle]`
3. `PasswordResetVerifyAPIView` — change `throttle_classes = [LoginRateThrottle]` to `throttle_classes = [OTPVerifyRateThrottle]`

- [ ] **Step 7: Run the tests to verify they pass**

```bash
cd backend/zewadi && python manage.py test accounts.tests.OTPThrottleTests -v 2
```

Expected: 2 tests pass.

- [ ] **Step 8: Run full accounts test suite to check for regressions**

```bash
cd backend/zewadi && python manage.py test accounts --verbosity=0
```

Expected: All tests pass (27 previously + 2 new = 29 total).

- [ ] **Step 9: Commit**

```bash
git add backend/zewadi/accounts/throttles.py backend/zewadi/accounts/views.py backend/zewadi/zewadi/settings.py backend/zewadi/accounts/tests.py
git commit -m "security: tighten OTP endpoint throttling to 2/min"
```

---

### Task 2: Django Admin Path Obfuscation

**Files:**
- Modify: `backend/zewadi/zewadi/settings.py` (add `ADMIN_URL`)
- Modify: `backend/zewadi/zewadi/urls.py` (use `settings.ADMIN_URL`)
- Modify: `backend/zewadi/.env.example` (document the setting)

**Context:**
- `urls.py:30` currently: `path("admin/", admin.site.urls)`
- `settings.py` imports `os` and uses `os.getenv()` pattern throughout
- `settings` is already imported in `urls.py` (line 17: `from django.conf import settings`)

- [ ] **Step 1: Add `ADMIN_URL` to `settings.py`**

Find the `DEBUG` / `SECRET_KEY` block near the top of `settings.py`. Add after the `DEBUG` line:

```python
ADMIN_URL = os.getenv("ADMIN_URL", "admin/")
```

- [ ] **Step 2: Update `urls.py`**

Find line 30:
```python
path("admin/", admin.site.urls),
```
Change to:
```python
path(settings.ADMIN_URL, admin.site.urls),
```

- [ ] **Step 3: Append to `.env.example`**

Read the file first, then append at the end (after the production security block from P0/P1):

```
# ADMIN_URL=k3mq7p-admin/   # Set to a random path in production; default is "admin/"
```

- [ ] **Step 4: Verify Django check passes**

```bash
cd backend/zewadi && python manage.py check
```

Expected: System check passes (only the axes W006 warning, which is pre-existing).

- [ ] **Step 5: Verify admin is reachable at default path locally**

```bash
cd backend/zewadi && python manage.py shell -c "from django.conf import settings; print(settings.ADMIN_URL)"
```

Expected output: `admin/`

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/zewadi/settings.py backend/zewadi/zewadi/urls.py backend/zewadi/.env.example
git commit -m "security: make Django admin URL configurable via ADMIN_URL env var"
```

---

### Task 3: OAuth State Parameter CSRF Protection

**Files:**
- Modify: `backend/zewadi/accounts/views.py` (GoogleLoginAPIView + GoogleCallbackAPIView)
- Modify: `backend/zewadi/accounts/tests.py` (add OAuth state tests)

**Context:**
- `GoogleLoginAPIView.get()` is at approximately `accounts/views.py:542`. Read the exact lines first.
- `GoogleCallbackAPIView.get()` is at approximately `accounts/views.py:560`.
- `secrets` is a stdlib module — no installation needed.
- `hmac` is a stdlib module — no installation needed.
- `SessionMiddleware` is already in MIDDLEWARE — `request.session` is available.
- The current `params` dict in `GoogleLoginAPIView` has a duplicate `"response_type"` key — remove the duplicate as part of this fix.
- The view imports `urlencode` from `urllib.parse` (check the imports at the top of views.py).

- [ ] **Step 1: Write the failing tests**

Read `backend/zewadi/accounts/tests.py` last line. Append:

```python
class GoogleOAuthStateTests(APITestCase):
    """OAuth callback must reject requests with wrong or missing state."""

    def test_callback_rejects_missing_state(self):
        response = self.client.get(
            "/api/account/google/callback/",
            {"code": "fake-code"},
        )
        # Missing state — no session entry either — must return 400
        self.assertEqual(response.status_code, 400)
        self.assertIn("state", str(response.data).lower())

    def test_callback_rejects_mismatched_state(self):
        # Prime the session with a known state
        session = self.client.session
        session["google_oauth_state"] = "correct-state-value"
        session.save()

        response = self.client.get(
            "/api/account/google/callback/",
            {"code": "fake-code", "state": "wrong-state-value"},
        )
        self.assertEqual(response.status_code, 400)
```

Note: check actual URL for Google callback in `accounts/urls.py` — adjust if different.

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd backend/zewadi && python manage.py test accounts.tests.GoogleOAuthStateTests -v 2
```

Expected: both tests fail (callback currently ignores state and tries to exchange the code).

- [ ] **Step 3: Read the exact current code**

Read `backend/zewadi/accounts/views.py` lines 530–620 to see the exact current structure before editing.

- [ ] **Step 4: Add imports at top of `views.py`**

Near the top of `accounts/views.py`, find the existing stdlib imports block (look for `import uuid` or `import datetime`). Add:

```python
import hmac as _hmac
import secrets as _secrets
```

- [ ] **Step 5: Update `GoogleLoginAPIView.get()` — add state, remove duplicate key**

Find the `params = {...}` dict in `GoogleLoginAPIView.get()`. Replace the entire params construction and redirect with:

```python
state = _secrets.token_urlsafe(32)
request.session["google_oauth_state"] = state
params = {
    "client_id": settings.GOOGLE_CLIENT_ID,
    "redirect_uri": request.build_absolute_uri("/api/account/google/callback/"),
    "response_type": "code",
    "scope": "openid email profile",
    "access_type": "offline",
    "prompt": "consent",
    "state": state,
}
return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}")
```

- [ ] **Step 6: Update `GoogleCallbackAPIView.get()` — validate state**

Find the `code = request.GET.get("code")` check in `GoogleCallbackAPIView.get()`. Add the state validation immediately after it (before the `requests.post` call to exchange the code):

```python
code = request.GET.get("code")
if not code:
    return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

received_state = request.GET.get("state")
stored_state = request.session.pop("google_oauth_state", None)
if not stored_state or not _hmac.compare_digest(stored_state, received_state or ""):
    return Response(
        {"error": "Invalid OAuth state. Please try again."},
        status=status.HTTP_400_BAD_REQUEST,
    )
```

- [ ] **Step 7: Run the tests to verify they pass**

```bash
cd backend/zewadi && python manage.py test accounts.tests.GoogleOAuthStateTests -v 2
```

Expected: 2 tests pass.

- [ ] **Step 8: Run full accounts test suite**

```bash
cd backend/zewadi && python manage.py test accounts --verbosity=0
```

Expected: All tests pass (29 + 2 new = 31 total).

- [ ] **Step 9: Commit**

```bash
git add backend/zewadi/accounts/views.py backend/zewadi/accounts/tests.py
git commit -m "security: add OAuth state parameter CSRF protection"
```

---

### Task 4: `dangerouslySetInnerHTML` Sanitization (DOMPurify)

**Files:**
- Create: `frontend/src/utils/sanitize.ts`
- Modify: `frontend/src/components/home/HeroSection.tsx`
- Modify: `frontend/src/components/home/MeaningSection.tsx`
- Modify: `frontend/src/components/home/LearnMoreSection.tsx`
- Modify: `frontend/src/components/home/CommunitySection.tsx`
- Modify: `frontend/src/components/about/about.tsx`
- Modify: `frontend/src/components/events/EventTestimonials.tsx`
- Modify: `frontend/src/components/events/CommunitySection.tsx`

**Context:**
- All 9 `dangerouslySetInnerHTML` usages pass `*HTML` translation strings directly — no sanitization.
- `isomorphic-dompurify` works in both SSR and browser environments (required for Next.js).
- The translations contain only simple formatting: `<br>`, `<em>`, `<strong>`, `<span class="...">`.
- The `sanitize.ts` utility will be the single place where the allow-list is defined.

- [ ] **Step 1: Install `isomorphic-dompurify`**

```bash
cd frontend && npm install isomorphic-dompurify && npm install --save-dev @types/dompurify
```

Expected: package added to `package.json` with no peer-dependency errors.

- [ ] **Step 2: Create `frontend/src/utils/sanitize.ts`**

```ts
import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["br", "em", "strong", "span", "wbr"],
    ALLOWED_ATTR: ["class"],
  });
}
```

- [ ] **Step 3: Update all 9 usages**

For each file below, add `import { sanitizeHTML } from "@/utils/sanitize";` at the top (with existing imports), then wrap every `dangerouslySetInnerHTML` value with `sanitizeHTML(...)`.

**File 1: `frontend/src/components/home/HeroSection.tsx`**

Find (line ~147):
```tsx
dangerouslySetInnerHTML={{ __html: heroTranslations.titleHTML }}
```
Replace with:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHTML(heroTranslations.titleHTML) }}
```

**File 2: `frontend/src/components/home/MeaningSection.tsx`**

Find (line ~36):
```tsx
dangerouslySetInnerHTML={{ __html: sectionData.titleHTML }}
```
Replace with:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHTML(sectionData.titleHTML) }}
```

**File 3: `frontend/src/components/home/LearnMoreSection.tsx`**

Find (line ~34):
```tsx
dangerouslySetInnerHTML={{ __html: learnMoreTranslations.titleHTML }}
```
Replace with:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHTML(learnMoreTranslations.titleHTML) }}
```

**File 4: `frontend/src/components/home/CommunitySection.tsx`**

Find (line ~63):
```tsx
dangerouslySetInnerHTML={{ __html: communityTranslations.badgeTextHTML }}
```
Replace with:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHTML(communityTranslations.badgeTextHTML) }}
```

**File 5: `frontend/src/components/about/about.tsx`**

Three usages — find each `dangerouslySetInnerHTML={{ __html: aboutData.*HTML }}` and wrap with `sanitizeHTML(...)`:
- Line ~328: `aboutData.introBadgeSubtitleHTML`
- Line ~361: `aboutData.introTitleHTML`
- Line ~577: `aboutData.testimonialTitleHTML`

**File 6: `frontend/src/components/events/EventTestimonials.tsx`**

Find (line ~24):
```tsx
dangerouslySetInnerHTML={{ __html: testimonialText.titleHTML }}
```
Replace with:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHTML(testimonialText.titleHTML) }}
```

**File 7: `frontend/src/components/events/CommunitySection.tsx`**

Find (line ~37):
```tsx
<span dangerouslySetInnerHTML={{ __html: communityText.statLabelHTML }} />
```
Replace with:
```tsx
<span dangerouslySetInnerHTML={{ __html: sanitizeHTML(communityText.statLabelHTML) }} />
```

- [ ] **Step 4: Run lint**

```bash
cd frontend && npm run lint 2>&1
```

Expected: 0 errors (pre-existing warnings are acceptable).

- [ ] **Step 5: Run build**

```bash
cd frontend && npm run build 2>&1
```

Expected: build completes successfully with all pages prerendered.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/utils/sanitize.ts frontend/src/components/home/HeroSection.tsx frontend/src/components/home/MeaningSection.tsx frontend/src/components/home/LearnMoreSection.tsx frontend/src/components/home/CommunitySection.tsx frontend/src/components/about/about.tsx frontend/src/components/events/EventTestimonials.tsx frontend/src/components/events/CommunitySection.tsx frontend/package.json frontend/package-lock.json
git commit -m "security: sanitize dangerouslySetInnerHTML with DOMPurify allow-list"
```

---

### Task 5 (P3): Cloudinary Upload Content-Type Validation

**Files:**
- Modify: `backend/zewadi/accounts/views.py` (`UploadSignatureView`)

**Context:**
- Read `accounts/views.py` and search for `UploadSignatureView` or `api_sign_request` to find the exact location.
- `cloudinary.utils.api_sign_request(params, api_secret)` signs whatever params are in the dict — adding `allowed_formats` constrains the upload.
- The setting `CLOUDINARY_UPLOAD_PRESET` is already defined in `settings.py`.

- [ ] **Step 1: Read the view**

Read `backend/zewadi/accounts/views.py` and find `UploadSignatureView`. Note the exact lines and the current `params` dict.

- [ ] **Step 2: Add `allowed_formats` to the params dict**

In the params dict passed to `api_sign_request`, add:
```python
"allowed_formats": "jpg,jpeg,png,webp,gif",
```

The full params dict should look like:
```python
params = {
    "timestamp": timestamp,
    "upload_preset": settings.CLOUDINARY_UPLOAD_PRESET,
    "allowed_formats": "jpg,jpeg,png,webp,gif",
}
```

- [ ] **Step 3: Verify Django check**

```bash
cd backend/zewadi && python manage.py check
```

Expected: passes (no new errors).

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/accounts/views.py
git commit -m "security(p3): constrain Cloudinary upload to image formats only"
```

---

### Task 6 (P3): Profile Update Race Condition Fix

**Files:**
- Modify: `backend/zewadi/communityuser/views.py`

**Context:**
- Read `communityuser/views.py` fully before editing to understand the exact pattern.
- Look for `get_or_create`, `_get_or_create_profile`, or `CommunityUser.objects.get_or_create`.
- `from django.db import transaction` is the import needed.
- `select_for_update()` requires a transaction (it must be inside `atomic()`).

- [ ] **Step 1: Read the file**

Read `backend/zewadi/communityuser/views.py` in full to understand current `get_or_create` usage.

- [ ] **Step 2: Add transaction import**

At the top of `communityuser/views.py`, find the Django imports block and add:
```python
from django.db import transaction
```

- [ ] **Step 3: Wrap the `get_or_create` in `select_for_update()` + `atomic()`**

Find the `CommunityUser.objects.get_or_create(user=request.user, ...)` call (exact form may differ). Wrap it:

```python
with transaction.atomic():
    profile, created = CommunityUser.objects.select_for_update().get_or_create(
        user=request.user,
        defaults={
            # keep whatever defaults are currently there — do not change them
        },
    )
```

If the current code is an inline `get_or_create` inside a view method, wrap only that call. Do not restructure the rest of the view.

- [ ] **Step 4: Run existing community user tests**

```bash
cd backend/zewadi && python manage.py test communityuser --verbosity=0
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/communityuser/views.py
git commit -m "fix(p3): wrap profile get_or_create in atomic transaction to prevent race condition"
```

---

### Task 7 (P3): `FRONTEND_URL` Guard in Production

**Files:**
- Modify: `backend/zewadi/zewadi/settings.py`
- Modify: `backend/zewadi/.env.example`

**Context:**
- `FRONTEND_URL` is already defined in `settings.py` (around line 77).
- `_running_cmd` and `_MANAGEMENT_CMDS` are already defined — they gate the `SECRET_KEY` and `SECURE_SSL_REDIRECT` warning guards.
- `DEBUG` is already defined earlier in the file.
- The pattern to follow is the existing `RuntimeError` for insecure `SECRET_KEY`.

- [ ] **Step 1: Read the relevant section of `settings.py`**

Read `backend/zewadi/zewadi/settings.py` lines 70–90 (around the `FRONTEND_URL` definition) and lines 225–255 (the production guard area) to understand exact context.

- [ ] **Step 2: Add the `FRONTEND_URL` guard to `settings.py`**

After the existing `FRONTEND_URL` line, add:

```python
if not DEBUG and not FRONTEND_URL and _running_cmd not in _MANAGEMENT_CMDS:
    raise RuntimeError(
        "FRONTEND_URL is required in production. "
        "Set FRONTEND_URL=https://yourdomain.com in your .env file."
    )
```

Important: `_running_cmd` is defined earlier in the file (used by the `SECRET_KEY` and `HTTPS` guards). If it is defined after the `FRONTEND_URL` line, move this guard to after `_running_cmd` is defined instead.

- [ ] **Step 3: Append to `.env.example`**

Add to the production block:
```
# FRONTEND_URL=https://app.zewadi.com   # Required in production
```

- [ ] **Step 4: Verify Django check**

```bash
cd backend/zewadi && python manage.py check
```

Expected: passes (DEBUG is True in dev — the guard does not fire).

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/zewadi/settings.py backend/zewadi/.env.example
git commit -m "security(p3): raise RuntimeError if FRONTEND_URL unset in production"
```

---

## Self-Review Checklist

**Spec coverage:**
1. Fix 1 (OTP throttling): Task 1 ✅
2. Fix 2 (Admin path): Task 2 ✅
3. Fix 3 (OAuth state): Task 3 ✅
4. Fix 4 (DOMPurify): Task 4 ✅
5. Fix 5 (Cloudinary formats): Task 5 ✅
6. Fix 6 (Profile race): Task 6 ✅
7. Fix 7 (FRONTEND_URL guard): Task 7 ✅

**Placeholder scan:** No TBDs, no "handle edge cases", all steps have exact code or exact commands.

**Type consistency:** `sanitizeHTML` defined in Task 4 Step 2 and used in Task 4 Step 3 — consistent. `OTPVerifyRateThrottle` and `OTPResendRateThrottle` defined in Task 1 Step 3 and used in Task 1 Step 6 — consistent.
