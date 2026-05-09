# Cart Auth Flow & Smart Navbar Profile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow unauthenticated users to add items to cart via a 2-field modal (guest register or sign in), complete the action without redirect, and replace the static profile icon with an auth-aware dropdown.

**Architecture:** Six coordinated file changes — one backend (serializer), one new frontend component (modal), two callers updated (productcards + ProductDetails), one Navbar rewrite (auth-aware profile), one guest profile page wired (banner + edit). No new pages, no localStorage cart, no migration.

**Tech Stack:** Django REST Framework (RegisterSerializer), Next.js 16 App Router, React 19, TypeScript, Redux Toolkit (userSlice — `isAuthenticated`, `role`, `userType`, `fullName`, `email`, `cartCount`), Axios via `api.js`, Sonner toasts (bottom-right), Tailwind CSS v4.

---

## File Map

| File | Action |
|---|---|
| `backend/zewadi/accounts/serializers.py` | Modify — make 5 fields optional |
| `frontend/src/components/shared/AddToCartModal.tsx` | Create — new modal component |
| `frontend/src/components/productcards/productcards.tsx` | Modify — auth check + modal |
| `frontend/src/components/products/ProductDetails.tsx` | Modify — auth check + modal |
| `frontend/src/components/common/Navbar.tsx` | Modify — auth-aware profile icon + dropdown |
| `frontend/src/components/guestprofile/guestprofile.tsx` | Modify — banner + edit profile wiring |

---

## Task 1: Backend — Make Registration Fields Optional

**Files:**
- Modify: `backend/zewadi/accounts/serializers.py`

- [ ] **Step 1: Make the 5 fields optional in `RegisterSerializer`**

In `backend/zewadi/accounts/serializers.py`, change the field declarations for `full_name`, `user_name`, `phone`, `date_of_birth`, `gender`:

```python
# Before
full_name = serializers.CharField(max_length=100)
user_name = serializers.CharField(max_length=20)
phone = serializers.CharField(max_length=15)
date_of_birth = serializers.DateField()
gender = serializers.CharField(max_length=10)

# After
full_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default="")
user_name = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
phone = serializers.CharField(max_length=15, required=False, allow_blank=True, default="")
date_of_birth = serializers.DateField(required=False, allow_null=True, default=None)
gender = serializers.CharField(max_length=10, required=False, allow_blank=True, default="")
```

- [ ] **Step 2: Auto-generate `full_name` and `user_name` from email in `create()`**

Add `import random` at the top of `serializers.py` (after existing imports). Then at the top of the `create()` method, before calling `User.objects.create_user`, insert the auto-generation logic:

```python
def create(self, validated_data):
    import random

    # Auto-generate missing full_name and user_name from email prefix
    email = validated_data.get("email", "")
    email_prefix = email.split("@")[0]

    if not validated_data.get("full_name"):
        validated_data["full_name"] = email_prefix

    if not validated_data.get("user_name"):
        suffix = random.randint(1000, 9999)
        validated_data["user_name"] = f"{email_prefix}_{suffix}"

    password = validated_data.get("password")
    # ... rest of create() unchanged
```

- [ ] **Step 3: Verify with curl that registration works with only email + password + user_type**

```bash
cd backend/zewadi
python manage.py runserver
```

In another terminal:
```bash
curl -s -X POST http://localhost:8000/api/account/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"testguest@example.com","password":"test1234","user_type":"guest"}' | python -m json.tool
```

Expected: `201` response with `user_id`, no validation errors about missing fields.

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/accounts/serializers.py
git commit -m "feat: make phone, dob, gender, full_name, user_name optional in RegisterSerializer"
```

---

## Task 2: Frontend — Create AddToCartModal Component

**Files:**
- Create: `frontend/src/components/shared/AddToCartModal.tsx`

- [ ] **Step 1: Create the file with the full component**

```tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setCredentials, setCartCount } from "@/redux/userSlice";

type AddToCartModalProps = {
  isOpen: boolean;
  productId: number;
  variantId?: number;
  quantity?: number;
  onClose: () => void;
  onSuccess: (cartCount: number) => void;
};

export default function AddToCartModal({
  isOpen,
  productId,
  variantId,
  quantity = 1,
  onClose,
  onSuccess,
}: AddToCartModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [tab, setTab] = useState<"guest" | "signin">("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  if (!isOpen) return null;

  function switchTab(next: "guest" | "signin") {
    setTab(next);
    setInlineError(null);
  }

  async function handleGuest() {
    setLoading(true);
    setInlineError(null);
    try {
      const emailPrefix = email.split("@")[0];
      const suffix = Math.floor(1000 + Math.random() * 9000);

      // 1. Register
      try {
        await api.post("/account/register/", {
          email,
          password,
          user_type: "guest",
          full_name: emailPrefix,
          user_name: `${emailPrefix}_${suffix}`,
        });
      } catch (err: unknown) {
        const errData = (err as { response?: { data?: { email?: string[] } } }).response?.data;
        if (errData?.email) {
          setTab("signin");
          setInlineError("Account exists — sign in instead");
          setLoading(false);
          return;
        }
        throw err;
      }

      // 2. Login
      const loginRes = await api.post("/account/login/", { email, password });
      const { user_id, role, email: userEmail } = loginRes.data;

      // 3. GET /me/
      const meRes = await api.get<{
        full_name: string;
        user_type: string;
      }>("/account/me/");
      const { full_name, user_type } = meRes.data;

      // 4. POST cart
      const cartRes = await api.post("/orders/cart/items/", {
        product_id: productId,
        ...(variantId ? { variant_id: variantId } : {}),
        quantity,
      });
      const count: number = cartRes.data.summary?.item_count ?? 0;

      // 5. Dispatch auth + cart
      dispatch(
        setCredentials({
          userId: user_id,
          role,
          email: userEmail,
          fullName: full_name || emailPrefix,
          userType: user_type === "guest" ? "guest" : "member",
        })
      );
      dispatch(setCartCount(count));

      // 6. Close
      toast.success("Added to cart!");
      onSuccess(count);
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    setInlineError(null);
    try {
      // 1. Login
      const loginRes = await api.post("/account/login/", { email, password });
      const { user_id, role, email: userEmail } = loginRes.data;

      // 2. GET /me/
      const meRes = await api.get<{
        full_name: string;
        user_type: string;
      }>("/account/me/");
      const { full_name, user_type } = meRes.data;

      // 3. POST cart
      const cartRes = await api.post("/orders/cart/items/", {
        product_id: productId,
        ...(variantId ? { variant_id: variantId } : {}),
        quantity,
      });
      const count: number = cartRes.data.summary?.item_count ?? 0;

      // 4. Dispatch auth + cart
      dispatch(
        setCredentials({
          userId: user_id,
          role,
          email: userEmail,
          fullName: full_name,
          userType: user_type === "guest" ? "guest" : "member",
        })
      );
      dispatch(setCartCount(count));

      // 5. Close
      toast.success("Added to cart!");
      onSuccess(count);
      onClose();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 400 || status === 401) {
        setInlineError("Incorrect password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="mb-5 text-lg font-bold text-[#0a4833]">
          Sign in to add to cart
        </h2>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => switchTab("guest")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "guest"
                ? "bg-[#1f4d3a] text-white"
                : "text-[#6b7280] hover:bg-gray-50"
            }`}
          >
            New here?
          </button>
          <button
            type="button"
            onClick={() => switchTab("signin")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "signin"
                ? "bg-[#1f4d3a] text-white"
                : "text-[#6b7280] hover:bg-gray-50"
            }`}
          >
            Sign in
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            />
          </div>

          {inlineError && (
            <p className="text-sm font-medium text-red-600">{inlineError}</p>
          )}

          {tab === "guest" && !inlineError && (
            <p className="text-xs text-[#6b7280]">
              You can complete your profile details later
            </p>
          )}

          <button
            type="button"
            onClick={tab === "guest" ? handleGuest : handleSignIn}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-lg bg-[#1f4d3a] py-3 text-sm font-bold text-white transition hover:bg-[#1f4d3a]/90 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : tab === "guest"
              ? "Continue as Guest"
              : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run lint to confirm no TypeScript errors**

```bash
cd frontend
npm run lint
```

Expected: no errors in `src/components/shared/AddToCartModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/shared/AddToCartModal.tsx
git commit -m "feat: add AddToCartModal for unauthenticated cart flow"
```

---

## Task 3: Update productcards.tsx — Auth Check + Modal

**Files:**
- Modify: `frontend/src/components/productcards/productcards.tsx`

- [ ] **Step 1: Add the required imports**

At the top of `productcards.tsx`, add `useSelector` and the new component alongside existing imports:

```ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import AddToCartModal from "@/components/shared/AddToCartModal";
```

Remove the existing `useRouter` import and `router` usage (no longer needed — 401 is handled by modal).

- [ ] **Step 2: Add modal state and `isAuthenticated` selector in `ProductCards()`**

Inside `export default function ProductCards()`, after the existing state declarations, add:

```ts
const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
const [modalOpen, setModalOpen] = useState(false);
const [pendingProductId, setPendingProductId] = useState<number | null>(null);
```

- [ ] **Step 3: Replace `handleAddToCart` with auth-aware version**

```ts
async function handleAddToCart(productId: number) {
  if (!isAuthenticated) {
    setPendingProductId(productId);
    setModalOpen(true);
    return;
  }
  try {
    const res = await api.post("/orders/cart/items/", { product_id: productId, quantity: 1 });
    toast.success("Added to cart!");
    dispatch(setCartCount(res.data.summary?.item_count ?? 0));
  } catch {
    toast.error("Could not add to cart.");
  }
}
```

- [ ] **Step 4: Render `<AddToCartModal>` in the JSX return**

Inside the outer `<section>` return, before the closing `</section>`, add:

```tsx
{modalOpen && pendingProductId !== null && (
  <AddToCartModal
    isOpen={modalOpen}
    productId={pendingProductId}
    quantity={1}
    onClose={() => { setModalOpen(false); setPendingProductId(null); }}
    onSuccess={() => { setModalOpen(false); setPendingProductId(null); }}
  />
)}
```

- [ ] **Step 5: Run lint**

```bash
cd frontend
npm run lint
```

Expected: no errors in `productcards.tsx`.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/productcards/productcards.tsx
git commit -m "feat: open AddToCartModal for unauthenticated users in product cards"
```

---

## Task 4: Update ProductDetails.tsx — Auth Check + Modal

**Files:**
- Modify: `frontend/src/components/products/ProductDetails.tsx`

- [ ] **Step 1: Add the required imports**

In the existing imports block in `ProductDetails.tsx`, add:

```ts
import { useDispatch, useSelector } from "react-redux";  // useDispatch already imported — add useSelector
import type { RootState } from "@/redux/store";           // AppDispatch already imported
import AddToCartModal from "@/components/shared/AddToCartModal";
```

Note: `useDispatch` and `AppDispatch` are already imported. Only add `useSelector`, `RootState`, and `AddToCartModal`.

- [ ] **Step 2: Add `isAuthenticated` selector and modal state**

Inside `const ProductDetails = () => {`, after the existing state declarations:

```ts
const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
const [modalOpen, setModalOpen] = useState(false);
```

- [ ] **Step 3: Replace `handleAddToCart` with auth-aware version**

```ts
async function handleAddToCart() {
  if (!product) return;
  if (!isAuthenticated) {
    setModalOpen(true);
    return;
  }
  try {
    const res = await api.post("/orders/cart/items/", {
      product_id: product.id,
      ...(selectedVariantId ? { variant_id: selectedVariantId } : {}),
      quantity,
    });
    toast.success("Added to cart!");
    dispatch(setCartCount(res.data.summary?.item_count ?? 0));
  } catch {
    toast.error("Could not add to cart.");
  }
}
```

- [ ] **Step 4: Render `<AddToCartModal>` in the JSX return**

Inside the outer `<section ref={sectionRef}>` return, before the closing `</section>`, add:

```tsx
{modalOpen && product && (
  <AddToCartModal
    isOpen={modalOpen}
    productId={product.id}
    variantId={selectedVariantId ?? undefined}
    quantity={quantity}
    onClose={() => setModalOpen(false)}
    onSuccess={() => setModalOpen(false)}
  />
)}
```

- [ ] **Step 5: Run lint**

```bash
cd frontend
npm run lint
```

Expected: no errors in `ProductDetails.tsx`.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/products/ProductDetails.tsx
git commit -m "feat: open AddToCartModal for unauthenticated users in ProductDetails"
```

---

## Task 5: Smart Navbar Profile Icon + Dropdown

**Files:**
- Modify: `frontend/src/components/common/Navbar.tsx`

- [ ] **Step 1: Add new imports**

In `frontend/src/components/common/Navbar.tsx`, the existing imports include `useDispatch`, `useSelector`, `AppDispatch`, `RootState`, `fetchCartCount`. Add these to the existing import block:

```ts
import { useRouter } from "next/navigation";   // add alongside usePathname
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchCartCount, clearCredentials } from "@/redux/userSlice";  // add clearCredentials
```

Remove the `User` icon from lucide-react imports (no longer needed). The final lucide-react import line should be:

```ts
import { Menu, X, Globe, ChevronDown, ArrowRight, ShoppingCart, LogOut } from "lucide-react";
```

- [ ] **Step 2: Add selectors and new state inside `const Navbar = () => {`**

After the existing `const cartCount = useSelector(...)` line, add:

```ts
const router = useRouter();
const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
const role = useSelector((s: RootState) => s.user.role);
const userType = useSelector((s: RootState) => s.user.userType);
const fullName = useSelector((s: RootState) => s.user.fullName);
const userEmail = useSelector((s: RootState) => s.user.email);
const [profileOpen, setProfileOpen] = useState(false);
```

- [ ] **Step 3: Add helper functions (before the `return` statement)**

```ts
const initials =
  fullName?.charAt(0)?.toUpperCase() ||
  userEmail?.charAt(0)?.toUpperCase() ||
  "U";

function getProfileRoutes() {
  if (role === "admin") return { profile: "/admindashboard", orders: "/admindashboard/orders" };
  if (role === "consultant") return { profile: "/consultant/profile", orders: "/consultant/appointments" };
  if (userType === "guest") return { profile: "/guestprofile", orders: "/guestprofile/history" };
  return { profile: "/communityDashBorde", orders: "/communityDashBorde/myorders" };
}

async function handleLogout() {
  await api.post("/account/logout/").catch(() => {});
  dispatch(clearCredentials());
  router.push("/login");
}
```

- [ ] **Step 4: Replace the profile icon in the JSX**

Find the current `{/* Profile Icon */}` block in `Navbar.tsx`:

```tsx
{/* Profile Icon */}
<Link href="/login">
  <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-brand-primary hover:text-brand-dark transition-all shadow-inner">
    <User size={20} strokeWidth={2} />
  </div>
</Link>
```

Replace it with:

```tsx
{/* Profile Icon — auth-aware */}
{!isAuthenticated ? (
  <Link
    href="/login"
    className="hidden lg:flex items-center text-white text-sm font-bold px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
  >
    Login
  </Link>
) : (
  <div className="relative">
    <button
      onClick={() => setProfileOpen((v) => !v)}
      aria-label="Open profile menu"
      className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition"
    >
      {initials}
    </button>

    {/* Backdrop */}
    {profileOpen && (
      <div
        className="fixed inset-0 z-40"
        onClick={() => setProfileOpen(false)}
      />
    )}

    {/* Dropdown */}
    {profileOpen && (() => {
      const routes = getProfileRoutes();
      return (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {fullName || userEmail}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p>
              {userType === "guest" && (
                <span className="inline-block mt-1 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#92400e]">
                  Guest
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 mx-1" />

          {/* Menu */}
          <div className="py-1.5">
            <Link
              href={routes.profile}
              onClick={() => setProfileOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
            >
              My Profile
            </Link>
            <Link
              href={routes.orders}
              onClick={() => setProfileOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
            >
              My Orders
            </Link>
          </div>

          <div className="border-t border-gray-100 mx-1" />

          <div className="py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      );
    })()}
  </div>
)}
```

- [ ] **Step 5: Add `api` import if not already present**

Confirm the file already has `import api from "@/services/api"`. If not, add it. (The logout handler calls `api.post`.)

- [ ] **Step 6: Run lint**

```bash
cd frontend
npm run lint
```

Expected: no errors in `Navbar.tsx`.

- [ ] **Step 7: Verify manually**

Start the dev server: `npm run dev`

1. Not logged in → navbar shows "Login" button (desktop only)
2. Log in as guest → avatar appears, click it → dropdown with "My Profile" (→ `/guestprofile`), "My Orders" (→ `/guestprofile/history`), "Logout"
3. Log in as member → same dropdown, "My Profile" → `/communityDashBorde`
4. Click Logout → dispatches `clearCredentials`, redirects to `/login`, avatar disappears, "Login" button reappears

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/common/Navbar.tsx
git commit -m "feat: auth-aware navbar profile — Login button vs avatar+dropdown with role routing"
```

---

## Task 6: Wire Guest Profile — Complete Banner + Edit Profile

**Files:**
- Modify: `frontend/src/components/guestprofile/guestprofile.tsx`

- [ ] **Step 1: Add edit state to `GuestProfile()`**

Inside `export default function GuestProfile()`, after the existing state declarations, add:

```ts
const [editOpen, setEditOpen] = useState(false);
const [editName, setEditName] = useState("");
const [editPhone, setEditPhone] = useState("");
const [saving, setSaving] = useState(false);
```

- [ ] **Step 2: Populate edit fields when profile loads**

In the existing `.then(([meRes, ...])` block, after `setProfile(meRes.data)`, add:

```ts
setEditName(meRes.data.full_name ?? "");
setEditPhone(meRes.data.phone ?? "");
```

- [ ] **Step 3: Add `handleSaveProfile` function**

Below the existing `handleUpgrade` function, add:

```ts
async function handleSaveProfile() {
  setSaving(true);
  try {
    const res = await api.patch("/account/me/", {
      full_name: editName.trim(),
      phone: editPhone.trim(),
    });
    setProfile((prev) => prev ? { ...prev, full_name: res.data.full_name, phone: res.data.phone } : prev);
    setEditOpen(false);
    toast.success("Profile updated!");
  } catch {
    toast.error("Could not save profile.");
  } finally {
    setSaving(false);
  }
}
```

- [ ] **Step 4: Add "Complete your profile" banner**

In the JSX, inside the `<div className="space-y-8">` content area, add the banner as the **first child** (before the existing "Upgrade Banner" div):

```tsx
{/* Complete Profile Banner */}
{profile && (!profile.full_name || !profile.phone) && (
  <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center justify-between gap-4">
    <p className="text-sm text-blue-800">
      Add your full name and phone number to complete your profile
    </p>
    <a
      href="#personal-info"
      onClick={() => setEditOpen(true)}
      className="shrink-0 text-sm font-bold text-blue-700 underline hover:text-blue-900 transition"
    >
      Complete now
    </a>
  </div>
)}
```

- [ ] **Step 5: Wire the "Edit Profile" button**

Find the existing `<button type="button" className="... text-[#b47800] underline">Edit Profile</button>` and replace it with:

```tsx
<button
  type="button"
  onClick={() => setEditOpen(true)}
  className="self-start text-base font-bold leading-6 text-[#b47800] underline"
>
  Edit Profile
</button>
```

- [ ] **Step 6: Add `id="personal-info"` to the Personal Information section**

Find `<section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">` (the Personal Information section) and add `id="personal-info"`:

```tsx
<section id="personal-info" className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
```

- [ ] **Step 7: Add the inline edit form modal**

Before the closing `</main>` tag (after the existing Upgrade Modal), add:

```tsx
{/* Edit Profile Modal */}
{editOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-lg font-bold text-[#0a4833]">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setEditOpen(false)}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-[#374151] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex-1 rounded-lg bg-[#0a4833] py-2 text-sm font-bold text-white hover:bg-[#0c5a40] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 8: Run lint**

```bash
cd frontend
npm run lint
```

Expected: no errors in `guestprofile.tsx`.

- [ ] **Step 9: Verify manually**

1. Log in as a guest user with no full_name and no phone
2. Navigate to `/guestprofile`
3. The blue "complete your profile" banner appears
4. Click "Complete now" → edit modal opens
5. Enter name and phone, click Save → profile updates, banner disappears
6. Click "Edit Profile" button → same modal opens

- [ ] **Step 10: Commit**

```bash
git add frontend/src/components/guestprofile/guestprofile.tsx
git commit -m "feat: guest profile — complete profile banner and wired edit profile modal"
```

---

## Post-Implementation Checklist

- [ ] Guest adds to cart from `/products` (unauthenticated) → modal opens → fills email + password → account created + logged in + item added → cart badge updates → modal closes
- [ ] Existing email in "New here?" tab → automatically switches to "Sign in" tab with inline message
- [ ] Signed-in user clicks "Add to Cart" → modal never opens, API called directly
- [ ] Navbar: unauthenticated → "Login" button; authenticated → avatar with initials
- [ ] Navbar dropdown routes: guest → `/guestprofile`; member → `/communityDashBorde`; logout → clears Redux + redirects to `/login`
- [ ] Backend: `POST /api/account/register/` with only `{email, password, user_type}` returns 201
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run build` completes without TypeScript errors
