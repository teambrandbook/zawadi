# Zawadi — Production Hardening Design

**Date:** 2026-05-11
**Branch:** MVPpass
**Scope:** All production gaps except payment gateway integration

---

## Overview

Fix all gaps identified in the pre-staging audit across 5 sequential groups. Each group is independently deployable. Payment gateway is explicitly out of scope.

---

## Group 1 — Config & Security

### Goal
Unblock staging deployment and harden existing auth/cookie behaviour.

### Changes

**`backend/zewadi/zewadi/settings.py`**
- Add `CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")` 
- Add full SMTP email config:
  ```
  EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
  EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
  EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
  EMAIL_USE_TLS = True
  EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
  EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
  DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@zawadi.com")
  ```
- Add `SECRET_KEY` guard: raise `ImproperlyConfigured` if the insecure default value is used when `DEBUG=False`
- Set `SESSION_COOKIE_SAMESITE = "Strict"`

**`backend/zewadi/accounts/views.py`**
- Change both auth cookie `samesite="Lax"` → `samesite="Strict"`
- Wrap `RegisterSerializer.create()` body in `transaction.atomic()`
- Fix Google OAuth callback redirect typo: `communityDashBorde` → `communityDashBoard`
- Add `throttle_classes = [AnonRateThrottle]` to `LoginAPIView`, `RegisterAPIView`, and OTP endpoints

**`frontend/next.config.js`**
- Throw at build time if `NEXT_PUBLIC_API_URL` env var is not set

**`.env.example` files (both backend and frontend)**
- Backend: add `CSRF_TRUSTED_ORIGINS`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`
- Frontend: add `NEXT_PUBLIC_API_URL` with a comment marking it as required

### Success Criteria
- Staging can be deployed with no console errors about missing env vars
- POST requests from staging frontend are not rejected by CSRF
- Login/register are throttled at 60 req/hour for anonymous users

---

## Group 2 — Auth Completion

### Goal
Email verification on register, OTP-based password reset, logout all sessions.

### Data Model

**New: `accounts/models.py` — `OTP` model**
```
user          ForeignKey(User, on_delete=CASCADE)
code          CharField(6 digits)
purpose       CharField(choices: EMAIL_VERIFICATION, PASSWORD_RESET)
created_at    DateTimeField(auto_now_add)
expires_at    DateTimeField  (created_at + 10 minutes)
is_used       BooleanField(default=False)
```
One active OTP per user per purpose. Generating a new OTP invalidates the previous one.

### Email Service

**New: `accounts/email.py`**
- `send_otp_email(user, code, purpose)` — sends plain-text email via Django SMTP backend
- Subject: "Your Zawadi verification code" / "Your Zawadi password reset code"
- Body: code + expiry notice

### Register Flow Change

Current: User created `is_active=True` → immediate login
New: User created `is_active=False` → OTP generated + emailed → redirect to OTP page → on verify, set `is_active=True` + issue JWT

### New Backend Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/account/otp/verify/` | Verify OTP, activate account or return reset token |
| POST | `/api/account/otp/resend/` | Resend OTP (rate-limited: 1 per minute) |
| POST | `/api/account/password-reset/request/` | Send password reset OTP to email |
| POST | `/api/account/password-reset/verify/` | Verify OTP, return short-lived reset token (UUID, 15 min TTL, stored in OTP record as `reset_token` field) |
| POST | `/api/account/password-reset/confirm/` | Accept reset token + new password, set password |
| POST | `/api/account/logout-all/` | Blacklist all active refresh tokens for authenticated user |

### Frontend Changes

- **After register:** redirect to `/otp` page with `purpose=EMAIL_VERIFICATION` + `email` in router state (not URL)
- **OTP page:** reuses existing `OtpComponent`, adds resend button with 60-second countdown
- **New `/forgot-password` page:** 3-step flow on single page:
  1. Email input → calls `password-reset/request/`
  2. OTP entry → calls `password-reset/verify/` → stores reset token in component state
  3. New password + confirm → calls `password-reset/confirm/`
- **Login page:** add "Forgot password?" link pointing to `/forgot-password`

### Success Criteria
- New user cannot log in until OTP verified
- Expired/used OTP returns clear error
- Password reset works end-to-end without accessing Django admin
- Logout all clears all sessions

---

## Group 3 — Notifications

### Goal
Notify users via email and in-app bell when order or booking status changes.

### Backend

**`orders/signals.py`** (new file, registered in `orders/apps.py`)
- `post_save` on `Order` — fires when `status` field changes
- Creates `Notification` record for the order's user
- Calls `send_notification_email()` with order-specific subject/body

**`consultant/signals.py`** (new file, registered in `consultant/apps.py`)
- `post_save` on `ConsultationBooking` — fires when `status` field changes
- Creates `Notification` record
- Calls `send_notification_email()`

**Email notification service** — `notifications/email.py`
- `send_notification_email(user, subject, body)` — thin wrapper over Django's `send_mail`
- Plain-text templates for each status:
  - Order: placed, confirmed, shipped, delivered, cancelled
  - Booking: confirmed, cancelled, completed

**New notification API endpoints** (in `notifications` app):

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications/` | List user notifications, paginated, newest first |
| POST | `/api/notifications/<id>/read/` | Mark one as read |
| POST | `/api/notifications/read-all/` | Mark all as read |
| GET | `/api/notifications/unread-count/` | Returns `{ count: N }` |

All endpoints require authentication.

### Frontend

**Bell icon in Navbar**
- Shows unread count badge (hidden when 0)
- Polls `/api/notifications/unread-count/` every 60 seconds while user is logged in
- On click: opens notification dropdown panel, calls `read-all`

**Notification dropdown panel**
- Lists 10 most recent notifications with relative timestamp ("2 min ago")
- Each row links to relevant page: order detail or booking detail
- "View all" link at bottom if more than 10

### Success Criteria
- Placing an order triggers an in-app notification and an email
- Bell badge updates within 60 seconds of a status change
- Marking all as read sets badge to 0

---

## Group 4 — API Completion

### Goal
Search/filter on content entities, booking auto-status, client-side form validation.

### Search & Filter

Add `SearchFilter` and `OrderingFilter` to existing list views. No new endpoints — just query params.

| App | Endpoint | Search fields | Filter fields | Order fields |
|-----|----------|---------------|---------------|--------------|
| product | `/api/product/` | name, description | category | price, name |
| recipes | `/api/recipes/` | title, ingredients | category | — |
| blog | `/api/blog/` | title, content | tag | created_at |
| consultant | `/api/consultant/` | name, specialization | available | — |

### Consultant Booking Auto-Status

**`consultant/signals.py`** (same file as notifications signal)
- On `ConsultationBooking` save: if `scheduled_date < now` and `status == CONFIRMED`, set `status = COMPLETED`

**New management command:** `python manage.py complete_past_bookings`
- Bulk-updates all CONFIRMED bookings with past scheduled_date to COMPLETED
- Safe to run repeatedly (idempotent)
- Intended for a daily cron job

### Client-Side Validation (Zod)

Add Zod schemas to 4 forms:

| Form | File | Rules |
|------|------|-------|
| Register | `components/shared/LoginComponent` or register page | email format, password ≥ 8 chars, name required |
| Login | Login component | email format, password required |
| COD Checkout | checkout page | name required, phone 10 digits, address required, pincode 6 digits |
| Password reset | `/forgot-password` | new password ≥ 8 chars, confirm matches |

**Search bars** on Products, Recipes, Blogs pages:
- Debounced 300ms input
- Updates URL `?search=` query param
- Results re-fetch on param change

### Success Criteria
- `GET /api/product/?search=moringa` returns matching products
- A past CONFIRMED booking becomes COMPLETED after signal or management command runs
- Register form shows inline error for short password before hitting API

---

## Group 5 — Frontend Hardening

### Goal
Remove all hardcoded localhost fallbacks, centralise API URL, fix image handling, wire error boundaries.

### Central Config

**New: `frontend/src/lib/config.ts`**
```ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_BASE_URL && typeof window !== "undefined") {
  console.error("NEXT_PUBLIC_API_URL is not set")
}
```

All 20+ component files that have `|| "http://localhost:8000/api"` fallbacks are updated to import `API_BASE_URL` from this file instead. The fallback string is removed everywhere.

### Image URL Utility

**Add to `frontend/src/lib/utils.ts`:**
```ts
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.png"
  if (path.startsWith("http")) return path
  return `${API_BASE_URL}${path}`
}
```

Replace the fragile `localhost` rewrite in `Navbar.tsx:87-92` and all other components that manually prefix image paths with this utility.

**`next.config.js` — `images.remotePatterns`**
- Add staging and production API hostname so Next.js image optimisation works

### Error Boundaries

- Audit `app/global-error.tsx` — ensure it exports a valid Next.js error boundary with a "Try again" button
- Add `<ErrorBoundary>` wrapper (React class component or `react-error-boundary` package) around:
  - Order list section
  - Product list section
  - Notification panel
- Each boundary shows: "Something went wrong. Please refresh." with a retry button

### Success Criteria
- Build fails if `NEXT_PUBLIC_API_URL` is not set
- No `localhost` string appears in any component file
- Crashing one section (e.g. notifications) does not unmount the whole page

---

## Out of Scope

- Payment gateway (Razorpay / Stripe) — future phase
- 2FA / MFA
- WebSocket / real-time features
- Advanced analytics
- Elasticsearch / full-text search beyond DRF SearchFilter
- API documentation (Swagger)

---

## Implementation Order

1. Group 1 — Config & Security (unblocks staging)
2. Group 2 — Auth Completion
3. Group 3 — Notifications
4. Group 4 — API Completion
5. Group 5 — Frontend Hardening
