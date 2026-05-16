# Guest / Member Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the signup Guest/Member toggle so everyone registers as a guest by default, fix the broken Google OAuth button on signup and the hardcoded Google callback redirect, then add a `GuestGate` component that shows an upgrade prompt to guests who try to access member-only community pages.

**Architecture:** All new registrations land as `user_type=guest` automatically. Guests can shop freely; when they navigate to any member-only community page a `GuestGate` component intercepts and shows a benefits panel with a one-click "Become a Member" CTA that calls `PATCH /api/account/upgrade/`. Redux state updates immediately so the gate disappears without a page reload. The backend Google OAuth callback is made role-aware so admin/staff/consultant users land on the correct dashboard after Google sign-in.

**Tech Stack:** Next.js 16 App Router, React 19, Redux Toolkit, TypeScript, Django 6, djangorestframework, Tailwind CSS v4, Sonner (toasts), lucide-react icons.

---

## File Structure

| File | Action | What changes |
|---|---|---|
| `frontend/src/components/signup/SignupComponent.tsx` | Modify | Remove `accountType` state + toggle UI, wire Google button `onClick` |
| `backend/zewadi/accounts/views.py` | Modify | `GoogleCallbackAPIView.get()` — role-aware redirect instead of hardcoded `/communityDashBoard` |
| `backend/zewadi/accounts/tests.py` | Modify | Add test for Google callback redirect logic |
| `frontend/src/redux/userSlice.ts` | Modify | Add `upgradeToMember` async thunk + fulfilled reducer |
| `frontend/src/components/shared/GuestGate.tsx` | Create | Upgrade prompt shown to guests on member-only pages |
| `frontend/src/app/communityDashBoard/page.tsx` | Modify | Wrap `<Home />` with `<GuestGate>` |
| `frontend/src/app/communityDashBoard/consultation/page.tsx` | Modify | Wrap content with `<GuestGate>` |
| `frontend/src/app/communityDashBoard/events/page.tsx` | Modify | Wrap content with `<GuestGate>` |
| `frontend/src/app/communityDashBoard/myrecipy/page.tsx` | Modify | Wrap content with `<GuestGate>` |
| `frontend/src/app/communityDashBoard/diet-plan/page.tsx` | Modify | Wrap content with `<GuestGate>` |
| `frontend/src/app/communityDashBoard/addconsaltation/page.tsx` | Modify | Wrap content with `<GuestGate>` |
| `frontend/src/components/common/Navbar.tsx` | Modify | Add "Community Dashboard" link to profile dropdown (lock icon for guests, dashboard icon for members) |

**Pages left open to guests (no gate):** `cart`, `myorders`, `settings`, `products`, `notifications`, `payment-method` — guests need these to shop.

---

### Task 1: Simplify signup form — remove toggle, wire Google button

**Files:**
- Modify: `frontend/src/components/signup/SignupComponent.tsx`

- [ ] **Step 1: Remove `accountType` state and toggle block**

Open `frontend/src/components/signup/SignupComponent.tsx`. Delete:
```tsx
const [accountType, setAccountType] = useState<"guest" | "member">("guest");
```
And delete the entire toggle block (lines ~120–149):
```tsx
<div className="flex flex-col items-center mt-3 mb-1">
  <p className="text-[10px] text-[#6b7280] mb-2 uppercase font-bold tracking-widest">
    Sign up as
  </p>
  <div className="flex items-center gap-3">
    <button type="button" onClick={() => setAccountType("guest")} ...>Guest</button>
    <span ...>or</span>
    <button type="button" onClick={() => setAccountType("member")} ...>Member</button>
  </div>
</div>
```

- [ ] **Step 2: Remove `user_type` from the API payload and add Google handler**

In `handleSubmit`, change the `api.post` call — remove `user_type: accountType` (backend defaults to `guest`):
```tsx
const { data } = await api.post("/account/register/", {
  full_name: form.full_name.trim(),
  user_name: form.user_name.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  date_of_birth: form.date_of_birth,
  gender: form.gender,
  password: form.password,
});
```

Add import at top of file (after existing imports):
```tsx
import { API_BASE_URL } from "@/lib/config";
```

Add handler inside the component, before `return`:
```tsx
const handleGoogleSignup = () => {
  window.location.href = `${API_BASE_URL}/account/google/login/`;
};
```

- [ ] **Step 3: Wire the Google button `onClick`**

Find the Google button (currently has no `onClick`):
```tsx
<button
  type="button"
  className="mt-4 flex h-[38px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white text-[12px] font-medium text-[#374151] transition hover:bg-[#fafafa]"
>
  <span className="text-[14px] font-semibold text-[#ef4444]">G</span>
  Continue with Google
</button>
```
Replace with:
```tsx
<button
  type="button"
  onClick={handleGoogleSignup}
  className="mt-4 flex h-[38px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white text-[12px] font-medium text-[#374151] transition hover:bg-[#fafafa]"
>
  <span className="text-[14px] font-semibold text-[#ef4444]">G</span>
  Continue with Google
</button>
```

- [ ] **Step 4: Verify the form still submits correctly**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/signup/SignupComponent.tsx
git commit -m "feat: remove guest/member toggle from signup, wire Google button"
```

---

### Task 2: Fix backend Google OAuth callback — role-aware redirect

**Files:**
- Modify: `backend/zewadi/accounts/views.py` — `GoogleCallbackAPIView.get()`
- Modify: `backend/zewadi/accounts/tests.py`

- [ ] **Step 1: Write the failing test**

Open `backend/zewadi/accounts/tests.py`. Add this test class:
```python
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse
from accounts.models import User
from communityuser.models import CommunityUser, UserType


class GoogleCallbackRedirectTest(TestCase):
    def _make_user(self, role, user_type=None):
        email = f"{role}@test.com"
        user = User.objects.create_user(
            email=email, password="pw", role=role.upper(), is_active=True
        )
        if role.upper() == "COMMUNITY_USER":
            CommunityUser.objects.create(
                user=user,
                user_type=user_type or UserType.GUEST,
            )
        return user

    def _mock_google_token_exchange(self, mock_post, mock_get, email, name="Test"):
        mock_token_resp = MagicMock()
        mock_token_resp.json.return_value = {"access_token": "fake-token"}
        mock_post.return_value = mock_token_resp

        mock_user_resp = MagicMock()
        mock_user_resp.json.return_value = {"email": email, "name": name}
        mock_get.return_value = mock_user_resp

    @patch("accounts.views.requests.get")
    @patch("accounts.views.requests.post")
    def test_admin_redirects_to_admindashboard(self, mock_post, mock_get):
        self._make_user("ADMIN")
        self._mock_google_token_exchange(mock_post, mock_get, "admin@test.com")
        res = self.client.get(
            reverse("google-callback"),
            {"code": "fake-code"},
            HTTP_HOST="localhost",
        )
        self.assertIn("/admindashboard", res["Location"])

    @patch("accounts.views.requests.get")
    @patch("accounts.views.requests.post")
    def test_guest_redirects_to_products(self, mock_post, mock_get):
        self._make_user("COMMUNITY_USER", UserType.GUEST)
        self._mock_google_token_exchange(mock_post, mock_get, "community_user@test.com")
        res = self.client.get(
            reverse("google-callback"),
            {"code": "fake-code"},
            HTTP_HOST="localhost",
        )
        self.assertIn("/products", res["Location"])

    @patch("accounts.views.requests.get")
    @patch("accounts.views.requests.post")
    def test_member_redirects_to_communityDashBoard(self, mock_post, mock_get):
        self._make_user("COMMUNITY_USER", UserType.MEMBER)
        self._mock_google_token_exchange(mock_post, mock_get, "community_user@test.com")
        res = self.client.get(
            reverse("google-callback"),
            {"code": "fake-code"},
            HTTP_HOST="localhost",
        )
        self.assertIn("/communityDashBoard", res["Location"])
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend/zewadi
DB_ENGINE=sqlite python manage.py test accounts.tests.GoogleCallbackRedirectTest -v 2
```
Expected: Tests FAIL (redirect is hardcoded to `/communityDashBoard` for all roles).

- [ ] **Step 3: Fix `GoogleCallbackAPIView.get()` in `accounts/views.py`**

Find the `GoogleCallbackAPIView.get()` method. Replace the final redirect block:

**Before:**
```python
response = redirect(f"{get_frontend_url()}/communityDashBoard")
set_auth_cookies(response, refresh, access)
return response
```

**After:**
```python
role = user.role.lower()
user_type = getattr(getattr(user, "communityuser", None), "user_type", None)

if role in ("admin", "internal_staff"):
    redirect_path = "/admindashboard"
elif role == "consultant":
    redirect_path = "/consultant"
elif role == "community_user" and user_type == "guest":
    redirect_path = "/products"
else:
    redirect_path = "/communityDashBoard"

response = redirect(f"{get_frontend_url()}{redirect_path}")
set_auth_cookies(response, refresh, access)
return response
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend/zewadi
DB_ENGINE=sqlite python manage.py test accounts.tests.GoogleCallbackRedirectTest -v 2
```
Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/accounts/views.py backend/zewadi/accounts/tests.py
git commit -m "fix: Google OAuth callback redirects based on role instead of hardcoding /communityDashBoard"
```

---

### Task 3: Add `upgradeToMember` thunk to Redux

**Files:**
- Modify: `frontend/src/redux/userSlice.ts`

- [ ] **Step 1: Add the thunk and fulfilled reducer**

Open `frontend/src/redux/userSlice.ts`. After the `fetchCartCount` thunk (around line 63), add:

```typescript
export const upgradeToMember = createAsyncThunk(
  "user/upgradeToMember",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/account/upgrade/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      return rejectWithValue(error.response?.data ?? "Upgrade failed");
    }
  }
);
```

In the `extraReducers` builder, after the `fetchCartCount` cases, add:

```typescript
builder.addCase(upgradeToMember.fulfilled, (state) => {
  state.userType = "member";
});
```

- [ ] **Step 2: Export the thunk**

The `upgradeToMember` const is already exported via `export const`. Verify the export exists by checking the file compiles:

```bash
cd frontend && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/redux/userSlice.ts
git commit -m "feat: add upgradeToMember thunk to Redux userSlice"
```

---

### Task 4: Create `GuestGate` component

**Files:**
- Create: `frontend/src/components/shared/GuestGate.tsx`

- [ ] **Step 1: Create the component file**

Create `frontend/src/components/shared/GuestGate.tsx` with this content:

```tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { upgradeToMember } from "@/redux/userSlice";
import { toast } from "sonner";
import { BookOpen, Calendar, ChefHat, Stethoscope, Users } from "lucide-react";

const BENEFITS = [
  { Icon: ChefHat,      text: "Exclusive member recipes & personalised meal plans" },
  { Icon: Stethoscope,  text: "Book one-on-one nutritionist consultations" },
  { Icon: Calendar,     text: "Join wellness events & community challenges" },
  { Icon: BookOpen,     text: "Full community dashboard with progress tracking" },
  { Icon: Users,        text: "Connect with other community members" },
];

export default function GuestGate({ children }: { children: React.ReactNode }) {
  const userType = useSelector((s: RootState) => s.user.userType);
  const dispatch = useDispatch<AppDispatch>();
  const [upgrading, setUpgrading] = useState(false);

  // Member — render the real page
  if (userType === "member") return <>{children}</>;

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      await dispatch(upgradeToMember()).unwrap();
      toast.success("Welcome to the Zawadi community!");
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#9f8151]/30 bg-[#fdfaf3] p-8 shadow-sm">

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0a4833]/10">
            <Users className="h-7 w-7 text-[#0a4833]" />
          </div>
          <h2 className="text-xl font-bold text-[#0a4833]">Members Only</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Upgrade your free account to unlock the full Zawadi community experience.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {BENEFITS.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-[#374151]">
              <Icon className="h-4 w-4 shrink-0 text-[#9f8151]" />
              {text}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={upgrading}
          className="mt-8 w-full rounded-lg bg-[#0a4833] py-3 text-sm font-bold text-white transition hover:bg-[#0c5a40] disabled:opacity-60"
        >
          {upgrading ? "Upgrading…" : "Become a Community Member"}
        </button>

        <p className="mt-3 text-center text-xs text-[#9ca3af]">
          Free — no payment required
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/shared/GuestGate.tsx
git commit -m "feat: add GuestGate component for member-only community pages"
```

---

### Task 5: Apply `GuestGate` to community dashboard pages

**Files:**
- Modify: `frontend/src/app/communityDashBoard/page.tsx`
- Modify: `frontend/src/app/communityDashBoard/consultation/page.tsx`
- Modify: `frontend/src/app/communityDashBoard/events/page.tsx`
- Modify: `frontend/src/app/communityDashBoard/myrecipy/page.tsx`
- Modify: `frontend/src/app/communityDashBoard/diet-plan/page.tsx`
- Modify: `frontend/src/app/communityDashBoard/addconsaltation/page.tsx`

- [ ] **Step 1: Gate the community dashboard home page**

Replace the full content of `frontend/src/app/communityDashBoard/page.tsx`:
```tsx
import GuestGate from "@/components/shared/GuestGate";
import Home from "@/components/communityUsers/home/Home";

export default function HomePage() {
  return (
    <GuestGate>
      <Home />
    </GuestGate>
  );
}
```

- [ ] **Step 2: Gate the consultation page**

Open `frontend/src/app/communityDashBoard/consultation/page.tsx`. Read the current import and default export. Wrap the rendered component with `GuestGate`. Pattern:
```tsx
import GuestGate from "@/components/shared/GuestGate";
import ConsultationPage from "@/components/communityUsers/consultation/..."; // keep existing import

export default function ConsultationRoute() {
  return (
    <GuestGate>
      <ConsultationPage />
    </GuestGate>
  );
}
```

- [ ] **Step 3: Gate the events page**

Open `frontend/src/app/communityDashBoard/events/page.tsx`. Apply the same GuestGate pattern as Step 2.

- [ ] **Step 4: Gate the my-recipes page**

Open `frontend/src/app/communityDashBoard/myrecipy/page.tsx`. Apply GuestGate pattern.

- [ ] **Step 5: Gate the diet-plan page**

Open `frontend/src/app/communityDashBoard/diet-plan/page.tsx`. Apply GuestGate pattern.

- [ ] **Step 6: Gate the add-consultation page**

Open `frontend/src/app/communityDashBoard/addconsaltation/page.tsx`. Apply GuestGate pattern.

- [ ] **Step 7: Verify build**

```bash
cd frontend && npm run build
```
Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 8: Manual smoke test**

1. Log in as a guest user → you should land on `/products`
2. Navigate to `/communityDashBoard` → you should see the GuestGate upgrade prompt (not the dashboard home)
3. Navigate to `/communityDashBoard/consultation` → GuestGate shown
4. Navigate to `/communityDashBoard/cart` → cart works normally (no gate)
5. Navigate to `/communityDashBoard/myorders` → orders work normally (no gate)
6. On the GuestGate, click "Become a Community Member" → toast "Welcome to the Zawadi community!" → page re-renders showing the real content immediately (no page reload needed — Redux state updates `userType` to `"member"`)
7. Navigate to `/communityDashBoard/consultation` again → shows real content, no gate

- [ ] **Step 9: Commit**

```bash
git add frontend/src/app/communityDashBoard/page.tsx \
        frontend/src/app/communityDashBoard/consultation/page.tsx \
        frontend/src/app/communityDashBoard/events/page.tsx \
        frontend/src/app/communityDashBoard/myrecipy/page.tsx \
        frontend/src/app/communityDashBoard/diet-plan/page.tsx \
        frontend/src/app/communityDashBoard/addconsaltation/page.tsx
git commit -m "feat: apply GuestGate to member-only community dashboard pages"
```

---

### Task 6: Add "Community Dashboard" link to the navbar profile dropdown

**Files:**
- Modify: `frontend/src/components/common/Navbar.tsx`

Show a "Community Dashboard" entry in the profile dropdown only for `community_user` role. Members get a plain link with a dashboard icon; guests get the same link but with a lock icon and a "Members only" pill. Both navigate to `/communityDashBoard` — for guests, `GuestGate` (Task 4) handles the upgrade prompt there.

- [ ] **Step 1: Add two new lucide icons to the import**

In `frontend/src/components/common/Navbar.tsx`, line 7, extend the lucide import:

**Before:**
```tsx
import { Menu, X, Globe, ChevronDown, ArrowRight, ShoppingCart, LogOut } from "lucide-react";
```
**After:**
```tsx
import { Menu, X, Globe, ChevronDown, ArrowRight, ShoppingCart, LogOut, LayoutDashboard, Lock } from "lucide-react";
```

- [ ] **Step 2: Insert the Community Dashboard link in the dropdown**

In the profile dropdown, find the block that ends with the "My Orders" link and the following divider (around lines 254–263):

```tsx
                        <Link
                          href={routes.orders}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                        >
                          My Orders
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 mx-1" />
```

Replace with:

```tsx
                        <Link
                          href={routes.orders}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                        >
                          My Orders
                        </Link>

                        {role === "community_user" && (
                          <Link
                            href="/communityDashBoard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                          >
                            {userType === "member" ? (
                              <>
                                <LayoutDashboard size={14} className="shrink-0 text-[#0a4833]" />
                                Community Dashboard
                              </>
                            ) : (
                              <>
                                <Lock size={14} className="shrink-0 text-gray-400" />
                                <span>Community Dashboard</span>
                                <span className="ml-auto rounded-full bg-[#fef3c7] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#92400e]">
                                  Members only
                                </span>
                              </>
                            )}
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 mx-1" />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 4: Manual smoke test**

1. Log in as a **guest** (`community_user` + `user_type=guest`) → open the profile dropdown → "Community Dashboard" link appears with a lock icon and "Members only" pill → clicking it navigates to `/communityDashBoard` → `GuestGate` shows the upgrade prompt.
2. Log in as a **member** (`community_user` + `user_type=member`) → open the profile dropdown → "Community Dashboard" link appears with the dashboard icon (no lock, no pill) → clicking it navigates to `/communityDashBoard` → real dashboard shown.
3. Log in as **admin** → open the profile dropdown → "Community Dashboard" link is NOT shown (role is not `community_user`).
4. Not logged in → no profile dropdown shown.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/common/Navbar.tsx
git commit -m "feat: add Community Dashboard link to navbar profile dropdown for community users"
```

---

## Notes for implementer

**Pages intentionally left open to guests** (no GuestGate):
- `cart` — guests need this to purchase products
- `myorders` and sub-pages — guests need order history and tracking
- `settings` — guests need basic account settings
- `products` — browsing products is the core guest experience
- `notifications` — basic account feature
- `payment-method` — needed for checkout

**The upgrade is instant and free.** After `PATCH /api/account/upgrade/` succeeds, Redux `userType` becomes `"member"` and `GuestGate` re-renders the children immediately. No page reload, no login required.

**Guest profile page** (`/guestprofile`) already has an upgrade modal that calls the same endpoint — this continues to work unchanged.

**OTP post-verification redirect** is already correct in `frontend/src/app/otp/page.tsx` line 51:
```tsx
router.replace(userType === "guest" ? "/products" : "/communityDashBoard");
```
No changes needed there.
