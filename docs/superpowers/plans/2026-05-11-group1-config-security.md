# Group 1 — Config & Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unblock staging by adding CSRF config, email backend, fixing the OAuth typo, adding DB transaction safety to registration, and adding a build-time env check on the frontend.

**Architecture:** All changes are configuration or small defensive code additions to existing files. No new models, no migrations, no new endpoints.

**Tech Stack:** Django 6, DRF, Next.js 16 (TypeScript)

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/zewadi/settings.py` |
| Modify | `backend/zewadi/accounts/views.py` |
| Modify | `backend/zewadi/accounts/serializers.py` |
| Modify | `frontend/next.config.ts` |
| Modify | `backend/zewadi/.env.example` |
| Modify | `frontend/.env.example` |

---

### Task 1: Add CSRF_TRUSTED_ORIGINS and EMAIL config to settings.py

**Files:**
- Modify: `backend/zewadi/zewadi/settings.py`

- [ ] **Step 1: Add CSRF and EMAIL config after the CORS block (line 65)**

Open `backend/zewadi/zewadi/settings.py`. After the CORS block (after line 65), add:

```python
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
```

- [ ] **Step 2: Verify Django starts without error**

```bash
cd backend/zewadi
python manage.py check
```

Expected: `System check identified no issues (0 silenced).`

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/zewadi/settings.py
git commit -m "config: add CSRF_TRUSTED_ORIGINS and SMTP email backend config"
```

---

### Task 2: Fix Google OAuth callback typo

The redirect on line 284 of `backend/zewadi/accounts/views.py` says `/communityDashBorde` (missing "a"). The frontend route is `/communityDashBoard`.

**Files:**
- Modify: `backend/zewadi/accounts/views.py` line 284

- [ ] **Step 1: Fix the typo in GoogleCallbackAPIView**

In `backend/zewadi/accounts/views.py`, find line 284:
```python
        response = redirect(f"{get_frontend_url()}/communityDashBorde")
```
Change it to:
```python
        response = redirect(f"{get_frontend_url()}/communityDashBoard")
```

- [ ] **Step 2: Check AuthGuard.tsx for the same typo**

Search frontend for the typo:
```bash
grep -r "communityDashBorde" frontend/src/
```

If any matches are found, replace each `communityDashBorde` with `communityDashBoard` in those files.

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/accounts/views.py
git commit -m "fix: correct communityDashBoard typo in Google OAuth callback redirect"
```

---

### Task 3: Add transaction.atomic() to RegisterSerializer.create()

Without this, if `CommunityUser.objects.create()` or `CommunityUserAddress.objects.create()` fails, the `User` record is left orphaned in the database.

**Files:**
- Modify: `backend/zewadi/accounts/serializers.py`

- [ ] **Step 1: Wrap the create() body in transaction.atomic()**

In `backend/zewadi/accounts/serializers.py`, find the `create` method (line 108). The `django.db.transaction` import is already in `accounts/models.py` but not `serializers.py`. Add the import and wrap:

Replace:
```python
    def create(self, validated_data):
        import random

        # Auto-generate missing full_name and user_name from email prefix
        email = validated_data.get("email", "")
```

With:
```python
    def create(self, validated_data):
        import random
        from django.db import transaction

        with transaction.atomic():
            # Auto-generate missing full_name and user_name from email prefix
            email = validated_data.get("email", "")
```

Then indent the entire remaining body of `create()` (lines 113–181) by one extra level (4 spaces) so it is inside the `with` block.

The method should end like:

```python
            # 🔹 CONSULTANT
            elif user.role == "CONSULTANT":
                Consultant.objects.create(
                    user=user,
                    years_of_experience=validated_data.get("years_of_experience"),
                    qualification=validated_data.get("qualification"),
                    certifications=validated_data.get("certifications"),
                    short_bio=validated_data.get("short_bio"),
                    languages_spoken=validated_data.get("languages_spoken"),
                    experience_areas=validated_data.get("experience_areas"),
                    session_type=validated_data.get("session_type"),
                    consultation_fee=validated_data.get("consultation_fee"),
                    session_duration=validated_data.get("session_duration"),
                )

            return user
```

- [ ] **Step 2: Run backend tests**

```bash
cd backend/zewadi
python manage.py test accounts
```

Expected: no failures (or pre-existing failures only).

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/accounts/serializers.py
git commit -m "fix: wrap RegisterSerializer.create() in transaction.atomic()"
```

---

### Task 4: Add build-time check for NEXT_PUBLIC_API_URL

**Files:**
- Modify: `frontend/next.config.ts`

- [ ] **Step 1: Add build-time guard**

Replace the contents of `frontend/next.config.ts` with:

```ts
import type { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is required. Add it to your .env.local file.\n" +
    "Example: NEXT_PUBLIC_API_URL=http://localhost:8000/api"
  );
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "https", hostname: "**", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Test that build fails without the env var**

Temporarily rename `.env.local` if it exists, then run:
```bash
cd frontend
npm run build
```
Expected: build exits with error `NEXT_PUBLIC_API_URL is required.`

Restore `.env.local` after the test.

- [ ] **Step 3: Test that build succeeds with the env var set**

```bash
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run build
```
Expected: build completes without error.

- [ ] **Step 4: Commit**

```bash
git add frontend/next.config.ts
git commit -m "config: throw at build time if NEXT_PUBLIC_API_URL is not set"
```

---

### Task 5: Update .env.example files

**Files:**
- Modify: `backend/zewadi/.env.example`
- Modify: `frontend/.env.example`

- [ ] **Step 1: Update backend .env.example**

Replace the full contents of `backend/zewadi/.env.example` with:

```
SECRET_KEY=<CHANGE_ME_generate_with_python_-c_"import_secrets;print(secrets.token_hex(50))">
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-server-ip

DB_ENGINE=postgresql
DB_NAME=zawadi
DB_USER=zawadi
DB_PASSWORD=<CHANGE_ME>
DB_HOST=db
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://your-server-ip:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://your-server-ip:3000
FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_real_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_real_client_secret

# Email (SMTP) — for OTP verification and notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=<your-app-password>
DEFAULT_FROM_EMAIL=noreply@zawadi.com

# Security — set to True in production (requires HTTPS)
DJANGO_SECURE_COOKIES=False
SECURE_SSL_REDIRECT=False
SECURE_HSTS_SECONDS=0
```

- [ ] **Step 2: Update frontend .env.example**

Replace the contents of `frontend/.env.example` with:

```
# REQUIRED — the base URL of the Django API (no trailing slash)
# Set this in your .env.local file. The build will fail if this is missing.
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

- [ ] **Step 3: Ensure .env.local exists for local dev**

```bash
cd frontend
cp .env.example .env.local
```

Confirm `.env.local` is in `frontend/.gitignore`:
```bash
grep ".env.local" frontend/.gitignore || echo ".env.local" >> frontend/.gitignore
```

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/.env.example frontend/.env.example frontend/.gitignore
git commit -m "config: update .env.example files with all required staging/production vars"
```

---

## Verification

After all tasks:

```bash
# Backend
cd backend/zewadi
python manage.py check
python manage.py test accounts

# Frontend (with env var set)
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run build
```

Both should complete without errors.
