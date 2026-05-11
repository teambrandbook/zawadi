# Group 4 — API Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add search/filter to product, recipe, blog, and consultant list endpoints; add consultant booking auto-status; add Zod client-side validation to key frontend forms.

**Architecture:** Backend uses DRF's built-in `SearchFilter` and `OrderingFilter` — no new endpoints, just query params added to existing list views. Booking auto-status uses a Django signal and a management command. Frontend adds Zod schemas to 3 forms and debounced search bars on listing pages.

**Tech Stack:** Django 6, DRF SearchFilter/OrderingFilter, Next.js 16, Zod

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/product/views.py` |
| Modify | `backend/zewadi/recipes/views.py` |
| Modify | `backend/zewadi/blog/views.py` |
| Modify | `backend/zewadi/consultant/views.py` |
| Create | `backend/zewadi/consultant/management/__init__.py` |
| Create | `backend/zewadi/consultant/management/commands/__init__.py` |
| Create | `backend/zewadi/consultant/management/commands/complete_past_bookings.py` |

---

### Task 1: Add search and filter to Product list view

**Files:**
- Modify: `backend/zewadi/product/views.py`

- [ ] **Step 1: Read the current ProductListCreateView**

```bash
grep -n "class ProductListCreateView\|filter_backends\|search_fields\|ordering_fields" backend/zewadi/product/views.py
```

Note the current class definition and any existing filter_backends.

- [ ] **Step 2: Add filter_backends, search_fields, ordering_fields**

In `backend/zewadi/product/views.py`, add the following import at the top:

```python
from rest_framework.filters import OrderingFilter, SearchFilter
```

In the `ProductListCreateView` class body, add these class attributes (alongside any existing `permission_classes`, `serializer_class`, etc.):

```python
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "name", "created_at"]
    ordering = ["-created_at"]
```

For category filtering, also add:
```python
    def get_queryset(self):
        qs = super().get_queryset()  # or Product.objects.filter(status="ACTIVE") if no super
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)
        return qs
```

If `ProductListCreateView` doesn't already have a `get_queryset()`, create it as above. If it does, add the category filter logic inside it.

- [ ] **Step 3: Test the search endpoint**

```bash
cd backend/zewadi
python manage.py runserver &
curl "http://localhost:8000/api/products/products/?search=moringa" -H "Accept: application/json"
```

Expected: JSON response with products matching "moringa" in name or description.

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/product/views.py
git commit -m "feat: add search, ordering, and category filter to product list"
```

---

### Task 2: Add search and filter to Recipes list view

**Files:**
- Modify: `backend/zewadi/recipes/views.py`

- [ ] **Step 1: Read the current recipes list view**

```bash
grep -n "class.*List\|filter_backends\|search_fields" backend/zewadi/recipes/views.py | head -20
```

- [ ] **Step 2: Add filter_backends and search_fields**

In `backend/zewadi/recipes/views.py`, add the import:

```python
from rest_framework.filters import OrderingFilter, SearchFilter
```

In the recipes list view class, add:

```python
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "description", "ingredients"]
    ordering_fields = ["title", "created_at"]
    ordering = ["-created_at"]
```

Add a `get_queryset()` with category filter:

```python
    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)
        return qs
```

If the view uses `queryset = Recipe.objects.all()` as a class attribute (no `get_queryset`), replace it with the method above.

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/recipes/views.py
git commit -m "feat: add search and category filter to recipes list"
```

---

### Task 3: Add search and filter to Blog list view

**Files:**
- Modify: `backend/zewadi/blog/views.py`

- [ ] **Step 1: Read the current blog list view**

```bash
grep -n "class.*List\|filter_backends\|search_fields" backend/zewadi/blog/views.py | head -20
```

- [ ] **Step 2: Add filter_backends and search_fields**

In `backend/zewadi/blog/views.py`, add:

```python
from rest_framework.filters import OrderingFilter, SearchFilter
```

In the blog list view class:

```python
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "content", "author"]
    ordering_fields = ["title", "created_at"]
    ordering = ["-created_at"]
```

Add `get_queryset()` with tag filter:

```python
    def get_queryset(self):
        qs = super().get_queryset()
        tag = self.request.query_params.get("tag")
        if tag:
            qs = qs.filter(tags__icontains=tag)
        return qs
```

Adjust field names to match the actual `Blog` model fields (`tags` may be called something else — check `blog/models.py` with `grep -n "tags\|tag\|category" backend/zewadi/blog/models.py`).

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/blog/views.py
git commit -m "feat: add search, ordering, and tag filter to blog list"
```

---

### Task 4: Add search and filter to Consultant list view

**Files:**
- Modify: `backend/zewadi/consultant/views.py`

- [ ] **Step 1: Read the current consultant list view**

```bash
grep -n "class.*List\|filter_backends\|search_fields\|available" backend/zewadi/consultant/views.py | head -20
```

- [ ] **Step 2: Add filter_backends and search_fields**

In `backend/zewadi/consultant/views.py`, add:

```python
from rest_framework.filters import OrderingFilter, SearchFilter
```

In the consultant list view class:

```python
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["user__full_name", "short_bio", "experience_areas", "specialization"]
    ordering_fields = ["rating", "consultation_fee", "years_of_experience"]
    ordering = ["-rating"]
```

Add `get_queryset()` with availability filter:

```python
    def get_queryset(self):
        qs = super().get_queryset()
        available = self.request.query_params.get("available")
        if available is not None:
            qs = qs.filter(available=available.lower() == "true")
        return qs
```

- [ ] **Step 3: Commit**

```bash
git add backend/zewadi/consultant/views.py
git commit -m "feat: add search, ordering, and availability filter to consultant list"
```

---

### Task 5: Add consultant booking auto-status management command

**Files:**
- Create: `backend/zewadi/consultant/management/__init__.py`
- Create: `backend/zewadi/consultant/management/commands/__init__.py`
- Create: `backend/zewadi/consultant/management/commands/complete_past_bookings.py`

Also uses the signal already added in Group 3 (`consultant/signals.py`).

- [ ] **Step 1: Create the management command directory**

```bash
mkdir -p backend/zewadi/consultant/management/commands
touch backend/zewadi/consultant/management/__init__.py
touch backend/zewadi/consultant/management/commands/__init__.py
```

- [ ] **Step 2: Create complete_past_bookings.py**

Create `backend/zewadi/consultant/management/commands/complete_past_bookings.py`:

```python
from django.core.management.base import BaseCommand
from django.utils import timezone
from consultant.models import ConsultationBooking


class Command(BaseCommand):
    help = "Mark CONFIRMED bookings with a past scheduled_date as COMPLETED."

    def handle(self, *args, **options):
        now = timezone.now()

        # Use update() to avoid triggering signals (bulk operation)
        updated = ConsultationBooking.objects.filter(
            status="confirmed",
            booked_date__lt=now.date(),
        ).update(status="completed")

        self.stdout.write(
            self.style.SUCCESS(f"Marked {updated} booking(s) as COMPLETED.")
        )
```

- [ ] **Step 3: Test the command**

```bash
cd backend/zewadi
python manage.py complete_past_bookings
```

Expected output: `Marked N booking(s) as COMPLETED.` (N may be 0 on a fresh database).

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/consultant/management/
git commit -m "feat: add complete_past_bookings management command for auto-status on past bookings"
```

---

### Task 6: Add Zod validation to frontend forms

**Files:**
- Modify: register form component
- Modify: login form component  
- Modify: COD checkout form component

- [ ] **Step 1: Install Zod**

```bash
cd frontend
npm install zod
```

- [ ] **Step 2: Find the form component files**

```bash
grep -r "password\|register\|Register" frontend/src/components/shared/LoginComponent.tsx | head -5
grep -r "checkout\|delivery\|cod\|COD" frontend/src/components/ --include="*.tsx" -l | head -5
```

Note the exact file paths — use them in the steps below.

- [ ] **Step 3: Add Zod schema to register form**

In the register form component (likely `frontend/src/components/shared/LoginComponent.tsx` or similar), add at the top of the file:

```ts
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(1, "Name is required"),
});
```

Before the API call in the register submit handler, validate:

```ts
const result = registerSchema.safeParse({ email, password, full_name });
if (!result.success) {
  const firstError = result.error.errors[0];
  setError(firstError.message);
  return;
}
```

- [ ] **Step 4: Add Zod schema to login form**

In the login form component, add:

```ts
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
```

Before the login API call:

```ts
const result = loginSchema.safeParse({ email, password });
if (!result.success) {
  setError(result.error.errors[0].message);
  return;
}
```

- [ ] **Step 5: Add Zod schema to COD checkout form**

Find the COD checkout form component. Add:

```ts
import { z } from "zod";

const checkoutSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  address_line: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});
```

Before the checkout API call:

```ts
const result = checkoutSchema.safeParse(formData);
if (!result.success) {
  const errors: Record<string, string> = {};
  result.error.errors.forEach((e) => {
    if (e.path[0]) errors[String(e.path[0])] = e.message;
  });
  setFieldErrors(errors);
  return;
}
```

- [ ] **Step 6: Run lint**

```bash
cd frontend
npm run lint
```

Fix any errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "feat: add Zod client-side validation to register, login, and checkout forms"
```

---

## Verification

```bash
# Backend search — run server and test each endpoint
cd backend/zewadi
python manage.py runserver &
curl "http://localhost:8000/api/products/products/?search=test"
curl "http://localhost:8000/api/recipes/?search=rice"
curl "http://localhost:8000/api/consultant/?available=true"

# Management command
python manage.py complete_past_bookings

# Frontend
cd frontend
npm run lint
npm run build
# Test: submit register form with short password → should show inline error before API call
# Test: submit login form with invalid email → should show inline error before API call
```
