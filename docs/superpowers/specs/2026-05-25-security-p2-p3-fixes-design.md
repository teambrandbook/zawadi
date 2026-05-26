# Security P2 + P3 Fixes — Design Spec

**Date:** 2026-05-25
**Status:** Approved
**Branch:** feat/prodbugfix

---

## Scope

Four P2 fixes (ship before launch) and three P3 fixes (post-launch backlog):

| # | Priority | Fix | Effort |
|---|----------|-----|--------|
| 1 | P2 | OTP endpoint brute-force throttling | Low |
| 2 | P2 | Django admin path obfuscation | Low |
| 3 | P2 | OAuth `state` parameter CSRF protection | Low |
| 4 | P2 | `dangerouslySetInnerHTML` sanitization via DOMPurify | Low |
| 5 | P3 | Cloudinary upload content-type validation | Low |
| 6 | P3 | Profile update race condition (`get_or_create`) | Low |
| 7 | P3 | `FRONTEND_URL` fallback guard in production | Low |

---

## Fix 1 — OTP Endpoint Brute-Force Throttling

### Problem

`OTPVerifyAPIView`, `PasswordResetVerifyAPIView`, and `OTPResendAPIView` all use `LoginRateThrottle` (scope `"login"`, 5/minute = 300/hour). A 6-digit OTP has 1,000,000 combinations. At 300 guesses/hour an attacker enumerating a known user's OTP needs ≈3,333 hours — but with multiple IPs this is practical. The OTP validity window is 10 minutes, narrowing the window to the 50 guesses possible in that time — still too many for a short code.

### Solution

**`backend/zewadi/accounts/throttles.py`** — add two new throttle classes:

```python
class OTPVerifyRateThrottle(AnonRateThrottle):
    scope = "otp_verify"       # 2/minute — strict: guessing OTPs


class OTPResendRateThrottle(AnonRateThrottle):
    scope = "otp_resend"       # 3/hour — prevents OTP spam
```

**`backend/zewadi/zewadi/settings.py`** — add the two new scopes to `DEFAULT_THROTTLE_RATES`:

```python
"otp_verify": "2/minute",
"otp_resend": "3/hour",
```

**`backend/zewadi/accounts/views.py`** — swap throttle classes:

- `OTPVerifyAPIView` (line 264): `throttle_classes = [OTPVerifyRateThrottle]`
- `PasswordResetVerifyAPIView` (line 370): `throttle_classes = [OTPVerifyRateThrottle]`
- `OTPResendAPIView` (line 321): `throttle_classes = [OTPResendRateThrottle]`

`PasswordResetRequestAPIView` (line 345) and `PasswordResetConfirmAPIView` (line 396) keep `LoginRateThrottle` — their payloads are not short codes, so the current 5/min is fine.

### Import change in views.py

```python
from .throttles import LoginRateThrottle, RegisterRateThrottle, OTPVerifyRateThrottle, OTPResendRateThrottle
```

---

## Fix 2 — Django Admin Path Obfuscation

### Problem

`backend/zewadi/zewadi/urls.py:30` exposes the Django admin at the guessable path `/admin/`. This aids attacker reconnaissance (confirms Django is in use) and makes the admin login form publicly accessible.

### Solution

**`backend/zewadi/zewadi/settings.py`** — add near the `DEBUG` / `SECRET_KEY` block:

```python
ADMIN_URL = os.getenv("ADMIN_URL", "admin/")
```

**`backend/zewadi/zewadi/urls.py:30`** — change:

```python
path("admin/", admin.site.urls),
```
to:
```python
path(settings.ADMIN_URL, admin.site.urls),
```

Add `from django.conf import settings` if not already present (it is already imported at line 17).

**`backend/zewadi/.env.example`** — append to the production block:

```
# ADMIN_URL=zw9k2-secure-admin/   # Change this to a random path in production
```

In production `.env`, operators set `ADMIN_URL` to a random token (e.g. `ADMIN_URL=k3mq7p-admin/`).

---

## Fix 3 — OAuth State Parameter CSRF Protection

### Problem

`GoogleLoginAPIView.get()` (`accounts/views.py:542-554`) redirects to Google OAuth without a `state` parameter. `GoogleCallbackAPIView.get()` (`accounts/views.py:560-614`) never validates a state value. This is a textbook OAuth CSRF vulnerability: an attacker can craft a callback URL with their own `code` and trick a victim into logging in as the attacker's Google account.

### Solution

Django's `SessionMiddleware` is already installed. Use the session to store and verify a one-time random state token.

**`accounts/views.py` — `GoogleLoginAPIView.get()`** (change `params` dict construction):

```python
import secrets as _secrets
import hmac as _hmac

# inside get():
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

Note: the current code has a duplicate `"response_type"` key (lines 549 and 551) — remove the duplicate.

**`accounts/views.py` — `GoogleCallbackAPIView.get()`** — add state validation immediately after the `code` check:

```python
received_state = request.GET.get("state")
stored_state = request.session.pop("google_oauth_state", None)
if not stored_state or not _hmac.compare_digest(stored_state, received_state or ""):
    return Response(
        {"error": "Invalid OAuth state. Please try again."},
        status=status.HTTP_400_BAD_REQUEST,
    )
```

`_hmac.compare_digest` prevents timing attacks on the state comparison. `session.pop` ensures the state is one-use.

---

## Fix 4 — `dangerouslySetInnerHTML` Sanitization

### Problem

Nine usages of `dangerouslySetInnerHTML` across five components pass `*HTML` strings from `@/locales/translations` directly to the browser DOM. The content is currently static (authored strings with simple HTML formatting like `<br>`, `<em>`, `<span>`). However, if translations are ever sourced from a CMS, database, or user input, XSS is trivially possible. The pattern is unsafe by construction.

Affected files (all `*HTML` field names):
- `frontend/src/components/home/HeroSection.tsx:147` — `heroTranslations.titleHTML`
- `frontend/src/components/home/MeaningSection.tsx:36` — `sectionData.titleHTML`
- `frontend/src/components/home/LearnMoreSection.tsx:34` — `learnMoreTranslations.titleHTML`
- `frontend/src/components/home/CommunitySection.tsx:63` — `communityTranslations.badgeTextHTML`
- `frontend/src/components/about/about.tsx:328` — `aboutData.introBadgeSubtitleHTML`
- `frontend/src/components/about/about.tsx:361` — `aboutData.introTitleHTML`
- `frontend/src/components/about/about.tsx:577` — `aboutData.testimonialTitleHTML`
- `frontend/src/components/events/EventTestimonials.tsx:24` — `testimonialText.titleHTML`
- `frontend/src/components/events/CommunitySection.tsx:37` — `communityText.statLabelHTML`

### Solution

**New dependency**: `isomorphic-dompurify` (works in both SSR and browser; needed because `"use client"` components still SSR in Next.js App Router).

```bash
npm install isomorphic-dompurify
npm install --save-dev @types/dompurify
```

**New file: `frontend/src/utils/sanitize.ts`**:

```ts
import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["br", "em", "strong", "span", "wbr"],
    ALLOWED_ATTR: ["class"],
  });
}
```

The allow-list matches what the current translations actually use. `class` is allowed for Tailwind class strings on `<span>` elements.

**Each component**: wrap every `dangerouslySetInnerHTML` value:

```tsx
// Before
dangerouslySetInnerHTML={{ __html: heroTranslations.titleHTML }}

// After
dangerouslySetInnerHTML={{ __html: sanitizeHTML(heroTranslations.titleHTML) }}
```

Add `import { sanitizeHTML } from "@/utils/sanitize";` to each file.

---

## Fix 5 (P3) — Cloudinary Upload Content-Type Validation

### Problem

`UploadSignatureView` in `accounts/views.py` generates a Cloudinary upload signature without constraining `allowed_formats`. If the associated Cloudinary upload preset is misconfigured (or switched from signed to unsigned), arbitrary file types including HTML and SVG (which can carry XSS payloads) can be uploaded.

### Solution

**`accounts/views.py` — `UploadSignatureView`**: add `allowed_formats` to the params dict passed to `cloudinary.utils.api_sign_request`:

```python
params = {
    "timestamp": timestamp,
    "upload_preset": settings.CLOUDINARY_UPLOAD_PRESET,
    "allowed_formats": "jpg,jpeg,png,webp,gif",
}
```

This embeds the format constraint in the signed payload so Cloudinary enforces it even if the preset changes.

---

## Fix 6 (P3) — Profile Update Race Condition

### Problem

`communityuser/views.py` `_get_or_create_profile()` (or the inline `get_or_create` call) is not wrapped in a database transaction. Two simultaneous requests for a new user could both pass the "does not exist" check and attempt to create a profile, causing an `IntegrityError`.

### Solution

**`backend/zewadi/communityuser/views.py`**: use Django's `get_or_create()` inside a `select_for_update()` transaction:

```python
from django.db import transaction

with transaction.atomic():
    profile, _ = CommunityUser.objects.select_for_update().get_or_create(
        user=request.user,
        defaults={...},
    )
```

`select_for_update()` locks the row (or the absence of it) so the second concurrent request waits rather than racing.

---

## Fix 7 (P3) — `FRONTEND_URL` Fallback Guard

### Problem

`accounts/views.py` `get_frontend_url()` falls back to `CORS_ALLOWED_ORIGINS[0]` and ultimately `"http://localhost:3000"` if `FRONTEND_URL` is not set. In production, a missing env var silently redirects OAuth callbacks to localhost.

### Solution

**`backend/zewadi/zewadi/settings.py`** — add a non-DEBUG guard after the existing `FRONTEND_URL` line (currently around line 77):

```python
if not DEBUG and not FRONTEND_URL and _running_cmd not in _MANAGEMENT_CMDS:
    raise RuntimeError(
        "FRONTEND_URL is required in production. Set it in your .env file."
    )
```

This follows the same pattern as the existing `SECRET_KEY` guard.

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

## Delivery

P2 fixes (1–4) first, in order, each as its own commit on `feat/prodbugfix`.
P3 fixes (5–7) follow, each as its own commit.
One PR to `main`.

---

## Success Criteria

1. POST to `/api/account/otp/verify/` 3 times in a row returns 429 on the 3rd request
2. POST to `/api/account/password-reset/verify/` 3 times in a row returns 429 on the 3rd
3. Django admin is not reachable at `/admin/` when `ADMIN_URL` is overridden
4. OAuth callback with a mismatched or missing state parameter returns 400
5. OAuth login flow completes successfully end-to-end (state round-trip works)
6. `sanitizeHTML('<script>alert(1)</script><em>title</em>')` returns `<em>title</em>`
7. All 9 `dangerouslySetInnerHTML` sites pass sanitized content; build and lint pass
8. `PATCH /api/community/profile/` with concurrent requests does not create duplicate profiles (P3)
9. Starting the server without `FRONTEND_URL` in non-DEBUG mode raises `RuntimeError` (P3)
