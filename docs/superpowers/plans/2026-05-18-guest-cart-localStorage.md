# Guest Cart localStorage Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let unauthenticated users freely add products to a localStorage cart; gate login only at checkout, draining localStorage to the backend on sign-in.

**Architecture:** `guestCart.ts` holds all localStorage read/write logic as pure utilities. Product components call these directly instead of opening a modal. The cart page reads localStorage when the user is unauthenticated and shows a `CheckoutAuthModal` when they click "Proceed to Payment". After login (email or Google OAuth), a `drainGuestCart` Redux thunk POSTs each localStorage item to the backend cart and clears the local store. `AuthRehydrator` in `providers.tsx` triggers the drain on every page load when an auth cookie is detected, which covers the Google OAuth redirect landing.

**Tech Stack:** Next.js 16 App Router, React 19, Redux Toolkit, TypeScript, Tailwind CSS v4, Sonner toasts, lucide-react icons.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `frontend/src/lib/guestCart.ts` | Create | Pure localStorage cart utilities (add, remove, update qty, clear, count, get all) |
| `frontend/src/redux/userSlice.ts` | Modify | Add `drainGuestCart` thunk; fix `fetchCartCount` to return localStorage count on 401 |
| `frontend/src/components/productcards/productcards.tsx` | Modify | Add to localStorage when unauthenticated; remove `AddToCartModal` usage |
| `frontend/src/components/products/ProductDetails.tsx` | Modify | Add to localStorage when unauthenticated; remove `AddToCartModal` usage |
| `frontend/src/components/shared/AddToCartModal.tsx` | Delete | No longer used |
| `frontend/src/components/shared/CheckoutAuthModal.tsx` | Create | Login/signup modal shown at checkout; drains cart then navigates to `/checkout` |
| `frontend/src/components/cart/cart.tsx` | Modify | Guest cart from localStorage when unauthenticated; checkout gate via `CheckoutAuthModal` |
| `frontend/src/app/providers.tsx` | Modify | Dispatch `drainGuestCart` in `AuthRehydrator` after credentials are set |

---

### Task 1: Create `guestCart.ts` localStorage utility

**Files:**
- Create: `frontend/src/lib/guestCart.ts`

- [ ] **Step 1: Create the file with exact content**

Create `d:\Brandbook\zawadi\frontend\src\lib\guestCart.ts`:

```typescript
const KEY = "zawadi_guest_cart";

export type GuestCartItem = {
  productId: number;
  variantId?: number;
  quantity: number;
  productName: string;
  productSubtitle: string;
  image: string | null;
  unitPrice: number;
  currency: string;
};

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as GuestCartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: GuestCartItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToGuestCart(item: GuestCartItem): void {
  const cart = getGuestCart();
  const idx = cart.findIndex(
    (i) => i.productId === item.productId && i.variantId === item.variantId
  );
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function updateGuestCartQty(
  productId: number,
  variantId: number | undefined,
  quantity: number
): void {
  const cart = getGuestCart();
  const idx = cart.findIndex(
    (i) => i.productId === productId && i.variantId === variantId
  );
  if (idx < 0) return;
  if (quantity <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromGuestCart(
  productId: number,
  variantId?: number
): void {
  saveCart(
    getGuestCart().filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    )
  );
}

export function clearGuestCart(): void {
  localStorage.removeItem(KEY);
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, i) => sum + i.quantity, 0);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit
```
Expected: No errors in `guestCart.ts`.

- [ ] **Step 3: Commit**

```bash
git -C d:\Brandbook\zawadi add frontend/src/lib/guestCart.ts
git -C d:\Brandbook\zawadi commit -m "feat: add localStorage guest cart utility"
```

---

### Task 2: Add `drainGuestCart` thunk and fix `fetchCartCount`

**Files:**
- Modify: `frontend/src/redux/userSlice.ts`

Read the file first to find the exact line numbers of `fetchCartCount` and the `extraReducers` builder.

- [ ] **Step 1: Add `getGuestCart`, `clearGuestCart`, `getGuestCartCount` imports at top of file**

At the top of `frontend/src/redux/userSlice.ts`, after the existing imports, add:

```typescript
import { getGuestCart, clearGuestCart, getGuestCartCount } from "@/lib/guestCart";
```

- [ ] **Step 2: Replace `fetchCartCount` with the version that handles unauthenticated users**

Find the existing `fetchCartCount` thunk:
```typescript
export const fetchCartCount = createAsyncThunk("user/fetchCartCount", async () => {
  try {
    const res = await api.get<{ summary: { item_count: number } }>("/orders/cart/");
    return Number(res.data.summary?.item_count ?? 0);
  } catch {
    return 0;
  }
});
```

Replace with:
```typescript
export const fetchCartCount = createAsyncThunk("user/fetchCartCount", async () => {
  try {
    const res = await api.get<{ summary: { item_count: number } }>("/orders/cart/");
    return Number(res.data.summary?.item_count ?? 0);
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } }).response?.status;
    if (status === 401 || status === 403) {
      return getGuestCartCount();
    }
    return 0;
  }
});
```

- [ ] **Step 3: Add `drainGuestCart` thunk after `upgradeToMember`**

After the `upgradeToMember` thunk, add:

```typescript
export const drainGuestCart = createAsyncThunk(
  "user/drainGuestCart",
  async () => {
    const items = getGuestCart();
    if (items.length === 0) return 0;
    await Promise.allSettled(
      items.map((item) =>
        api.post("/orders/cart/items/", {
          product_id: item.productId,
          ...(item.variantId ? { variant_id: item.variantId } : {}),
          quantity: item.quantity,
        })
      )
    );
    clearGuestCart();
    try {
      const res = await api.get<{ summary: { item_count: number } }>("/orders/cart/");
      return Number(res.data.summary?.item_count ?? 0);
    } catch {
      return 0;
    }
  }
);
```

- [ ] **Step 4: Add fulfilled reducer for `drainGuestCart` in `extraReducers`**

In the `extraReducers` builder block, after the `upgradeToMember.fulfilled` case, add:

```typescript
builder.addCase(drainGuestCart.fulfilled, (state, action) => {
  state.cartCount = action.payload;
});
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git -C d:\Brandbook\zawadi add frontend/src/redux/userSlice.ts
git -C d:\Brandbook\zawadi commit -m "feat: add drainGuestCart thunk, fix fetchCartCount for unauthenticated users"
```

---

### Task 3: Update product components to add to localStorage; delete AddToCartModal

**Files:**
- Modify: `frontend/src/components/productcards/productcards.tsx`
- Modify: `frontend/src/components/products/ProductDetails.tsx`
- Delete: `frontend/src/components/shared/AddToCartModal.tsx`

Read both component files before modifying.

#### productcards.tsx

- [ ] **Step 1: Add guestCart imports and remove AddToCartModal import**

In `productcards.tsx`, find:
```typescript
import AddToCartModal from "@/components/shared/AddToCartModal";
```
Replace with:
```typescript
import { addToGuestCart, getGuestCartCount } from "@/lib/guestCart";
```

- [ ] **Step 2: Remove modal state and replace unauthenticated add-to-cart**

Find the `ProductCards` component (the one that manages the list). It has state like:
```typescript
const [modalOpen, setModalOpen] = useState(false);
const [pendingProductId, setPendingProductId] = useState<number | null>(null);
```
And an authenticated check in the add handler like:
```typescript
if (!isAuthenticated) {
  setPendingProductId(productId);
  setModalOpen(true);
  return;
}
```

Delete `modalOpen` and `pendingProductId` state declarations.

Replace the unauthenticated branch with:
```typescript
if (!isAuthenticated) {
  const unitPrice = Number(
    product.selling_price ?? product.sale_price ?? product.base_price ?? 0
  );
  addToGuestCart({
    productId: product.id,
    quantity: 1,
    productName: product.product_name,
    productSubtitle: product.product_subtitle,
    image: product.image,
    unitPrice,
    currency: "INR",
  });
  dispatch(setCartCount(getGuestCartCount()));
  toast.success("Added to cart!");
  return;
}
```

Note: the add handler receives `productId: number` — you need to also receive the `product` object. Look at how the handler is currently called from `ProductCard` and adjust the call signature so the full `product` is passed. The `ProductCard` calls `onAddToCart(product.id)` — change to `onAddToCart(product)` and update the `onAddToCart` prop type from `(id: number) => void` to `(product: Product) => void`.

- [ ] **Step 3: Remove AddToCartModal JSX**

Find the `<AddToCartModal ... />` JSX in the return of `ProductCards` and delete it entirely.

- [ ] **Step 4: Verify productcards.tsx compiles**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit 2>&1 | grep productcards
```
Expected: No errors for this file.

#### ProductDetails.tsx

- [ ] **Step 5: Update ProductDetails.tsx**

In `frontend/src/components/products/ProductDetails.tsx`:

Find:
```typescript
import AddToCartModal from "@/components/shared/AddToCartModal";
```
Replace with:
```typescript
import { addToGuestCart, getGuestCartCount } from "@/lib/guestCart";
```

Find and delete: `const [modalOpen, setModalOpen] = useState(false);`

Find the button/handler that opens the modal when unauthenticated:
```typescript
if (!isAuthenticated) {
  setModalOpen(true);
  return;
}
```
Replace with:
```typescript
if (!isAuthenticated) {
  const unitPrice = Number(
    product.selling_price ?? product.sale_price ?? product.base_price ?? 0
  );
  addToGuestCart({
    productId: product.id,
    quantity,
    productName: product.product_name,
    productSubtitle: product.product_subtitle,
    image: product.image,
    unitPrice,
    currency: product.currency || "INR",
  });
  dispatch(setCartCount(getGuestCartCount()));
  toast.success("Added to cart!");
  return;
}
```

Delete the `<AddToCartModal ... />` JSX from the return.

- [ ] **Step 6: Delete AddToCartModal**

```bash
Remove-Item d:\Brandbook\zawadi\frontend\src\components\shared\AddToCartModal.tsx
```

- [ ] **Step 7: Verify full TypeScript compile**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit
```
Expected: No errors (any remaining errors should be pre-existing in other files).

- [ ] **Step 8: Commit**

```bash
git -C d:\Brandbook\zawadi add frontend/src/components/productcards/productcards.tsx frontend/src/components/products/ProductDetails.tsx
git -C d:\Brandbook\zawadi rm frontend/src/components/shared/AddToCartModal.tsx
git -C d:\Brandbook\zawadi commit -m "feat: add to localStorage when unauthenticated, remove AddToCartModal from product flow"
```

---

### Task 4: Create `CheckoutAuthModal`

**Files:**
- Create: `frontend/src/components/shared/CheckoutAuthModal.tsx`

- [ ] **Step 1: Create the file**

Create `d:\Brandbook\zawadi\frontend\src\components\shared\CheckoutAuthModal.tsx`:

```tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setCredentials, drainGuestCart } from "@/redux/userSlice";
import api from "@/services/api";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CheckoutAuthModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function switchTab(t: "signin" | "signup") {
    setTab(t);
    setError(null);
  }

  async function loginAndDrain(trimmedEmail: string) {
    const loginRes = await api.post("/account/login/", {
      email: trimmedEmail,
      password,
    });
    const data = loginRes.data.data ?? loginRes.data;
    const meRes = await api.get<{ full_name: string; user_type: string }>(
      "/account/me/"
    );
    dispatch(
      setCredentials({
        userId: data.user_id,
        role: data.role,
        email: data.email,
        fullName: meRes.data.full_name,
        userType: meRes.data.user_type === "guest" ? "guest" : "member",
      })
    );
    await dispatch(drainGuestCart());
    router.push("/checkout");
    onClose();
  }

  async function handleSignIn() {
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await loginAndDrain(email.trim());
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 400 || status === 401) {
        setError("Incorrect email or password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    const trimmedEmail = email.trim();
    try {
      const prefix =
        trimmedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 15) ||
        "User";
      const suffix = Math.floor(1000 + Math.random() * 9000);
      try {
        const regRes = await api.post("/account/register/", {
          email: trimmedEmail,
          password,
          full_name: prefix,
          user_name: `${prefix}_${suffix}`,
        });
        if (regRes.data?.requires_otp) {
          window.location.href = `/otp?email=${encodeURIComponent(trimmedEmail)}&purpose=EMAIL_VERIFICATION`;
          return;
        }
      } catch (err: unknown) {
        const errData = (
          err as { response?: { data?: { email?: string[] } } }
        ).response?.data;
        if (errData?.email) {
          setError("Account already exists — sign in instead");
          setTab("signin");
          return;
        }
        throw err;
      }
      await loginAndDrain(trimmedEmail);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
          Sign in to checkout
        </h2>

        <div className="mb-6 flex gap-2">
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
          <button
            type="button"
            onClick={() => switchTab("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "signup"
                ? "bg-[#1f4d3a] text-white"
                : "text-[#6b7280] hover:bg-gray-50"
            }`}
          >
            New here?
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
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
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
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={tab === "signin" ? handleSignIn : handleSignUp}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-lg bg-[#1f4d3a] py-3 text-sm font-bold text-white transition hover:bg-[#1f4d3a]/90 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : tab === "signin"
              ? "Sign In & Checkout"
              : "Create Account & Checkout"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = `${API_BASE_URL}/account/google/login/`;
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.32-2.04 3.03l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.71-.06-1.39-.19-2.05H12Z" />
              <path fill="#4285F4" d="M12 21.5c2.73 0 5.03-.9 6.7-2.43l-3.3-2.56c-.91.61-2.08.97-3.4.97-2.61 0-4.82-1.76-5.61-4.12H2.98v2.65A10.12 10.12 0 0 0 12 21.5Z" />
              <path fill="#FBBC05" d="M6.39 13.36a6.08 6.08 0 0 1 0-3.86V6.85H2.98a10.12 10.12 0 0 0 0 9.16l3.41-2.65Z" />
              <path fill="#34A853" d="M12 8.52c1.48 0 2.81.51 3.86 1.5l2.89-2.89C17.02 5.52 14.72 4.5 12 4.5A10.12 10.12 0 0 0 2.98 6.85l3.41 2.65C7.18 10.28 9.39 8.52 12 8.52Z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-[#9ca3af]">
            Your cart items will be saved after sign in
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit
```
Expected: No errors for `CheckoutAuthModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git -C d:\Brandbook\zawadi add frontend/src/components/shared/CheckoutAuthModal.tsx
git -C d:\Brandbook\zawadi commit -m "feat: add CheckoutAuthModal — login/signup gate at checkout with cart drain"
```

---

### Task 5: Update `cart.tsx` to show guest cart and trigger checkout gate

**Files:**
- Modify: `frontend/src/components/cart/cart.tsx`

Read the full file before starting — the current structure is `Cart()` component with `authError` state and `OrderSummary` sub-component.

- [ ] **Step 1: Add imports**

At the top of `frontend/src/components/cart/cart.tsx`, add to the existing React import line and add new imports:

```tsx
// Add to existing import from "react":
import { useEffect, useState } from "react";  // already there

// Add after existing imports:
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import {
  getGuestCart,
  updateGuestCartQty,
  removeFromGuestCart,
  getGuestCartCount,
  type GuestCartItem,
} from "@/lib/guestCart";
import CheckoutAuthModal from "@/components/shared/CheckoutAuthModal";
```

- [ ] **Step 2: Add `onProceed` prop to `OrderSummary` to support guest checkout gate**

Find the `OrderSummary` function and its props type:
```tsx
function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
}) {
```

Replace with:
```tsx
function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  onProceed,
}: {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  onProceed?: () => void;
}) {
```

Then find the `<Link href="/payment" ...>Proceed to Payment</Link>` inside `OrderSummary` and replace it with:
```tsx
{onProceed ? (
  <button
    type="button"
    onClick={onProceed}
    className="mt-7 flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-[#1f4d3a] px-6 text-sm font-bold text-white shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition hover:bg-[#1a4331] active:scale-[0.99]"
  >
    Proceed to Payment
    <ArrowRight size={17} />
  </button>
) : (
  <Link
    href="/payment"
    className="mt-7 flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-[#1f4d3a] px-6 text-sm font-bold text-white shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition hover:bg-[#1a4331] active:scale-[0.99]"
  >
    Proceed to Payment
    <ArrowRight size={17} />
  </Link>
)}
```

- [ ] **Step 3: Add guest cart state and adapter to the `Cart` component**

Inside the `Cart()` function, add new state after the existing state declarations:

```tsx
const dispatch = useDispatch<AppDispatch>();
const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
```

Also add this helper function inside `Cart()` to convert a `GuestCartItem` to the `CartItem` shape that `CartRow` already renders:

```tsx
function guestToCartItem(g: GuestCartItem, index: number): CartItem {
  return {
    id: -(index + 1),
    product_id: g.productId,
    product_name: g.productName,
    product_subtitle: g.productSubtitle,
    category: "",
    image: g.image ?? "",
    unit_price: String(g.unitPrice),
    line_total: String(g.unitPrice * g.quantity),
    quantity: g.quantity,
    stock_quantity: 999,
    currency: g.currency,
  };
}
```

- [ ] **Step 4: Load guest cart on mount when unauthenticated**

Modify the `useEffect` that calls `fetchCart()`:

```tsx
useEffect(() => {
  if (isAuthenticated) {
    fetchCart();
  } else {
    setGuestItems(getGuestCart());
    setLoading(false);
  }
}, [isAuthenticated]);
```

- [ ] **Step 5: Add guest quantity and remove handlers**

After the existing `handleAddRelatedProduct` function, add:

```tsx
function handleGuestQuantityChange(productId: number, variantId: number | undefined, newQty: number) {
  if (newQty < 1) return;
  updateGuestCartQty(productId, variantId, newQty);
  setGuestItems(getGuestCart());
  dispatch(setCartCount(getGuestCartCount()));
}

function handleGuestRemove(productId: number, variantId?: number) {
  removeFromGuestCart(productId, variantId);
  setGuestItems(getGuestCart());
  dispatch(setCartCount(getGuestCartCount()));
  toast.success("Item removed.");
}
```

- [ ] **Step 6: Replace the `authError` return with the guest cart view**

Find:
```tsx
if (authError) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-semibold text-[#0A4833]">Please log in to view your cart</p>
      <Link
        href="/login?next=/cart"
        className="rounded-lg bg-[#0A4833] px-6 py-2 text-sm text-white"
      >
        Log In
      </Link>
      <Link href="/products" className="text-sm text-[#6b7280] underline">
        Continue Shopping
      </Link>
    </div>
  );
}
```

Replace with:
```tsx
if (!isAuthenticated) {
  const guestSubtotal = guestItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  if (guestItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-[#0A4833]">Your cart is empty</p>
        <Link href="/products" className="rounded-lg bg-[#0A4833] px-6 py-2 text-sm text-white">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-10">
          <section>
            <div className="mb-7 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold leading-9 text-[#1f4d3a]">Your Cart</h1>
              <p className="text-base font-medium leading-6 text-[#6b7280]">
                {guestItems.length} items
              </p>
            </div>
            <div className="space-y-4">
              {guestItems.map((gItem, idx) => (
                <CartRow
                  key={`${gItem.productId}-${gItem.variantId ?? "none"}`}
                  item={guestToCartItem(gItem, idx)}
                  onDecrease={() =>
                    handleGuestQuantityChange(gItem.productId, gItem.variantId, gItem.quantity - 1)
                  }
                  onIncrease={() =>
                    handleGuestQuantityChange(gItem.productId, gItem.variantId, gItem.quantity + 1)
                  }
                  onRemove={() => handleGuestRemove(gItem.productId, gItem.variantId)}
                />
              ))}
            </div>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-brand-green"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </section>

          <div className="lg:mt-16">
            <OrderSummary
              subtotal={String(guestSubtotal)}
              shipping="0"
              tax="0"
              total={String(guestSubtotal)}
              onProceed={() => setCheckoutModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CheckoutAuthModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </main>
  );
}
```

- [ ] **Step 7: Also delete the now-unreachable `authError` state and the old `authError` return (if any remains)**

Since we replaced the `authError` block with `!isAuthenticated`, you can also remove `const [authError, setAuthError] = useState(false)` and the `setAuthError(true)` call inside `fetchCart`. Remove both.

- [ ] **Step 8: Verify TypeScript compiles**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit
```
Expected: No errors for `cart.tsx`.

- [ ] **Step 9: Commit**

```bash
git -C d:\Brandbook\zawadi add frontend/src/components/cart/cart.tsx
git -C d:\Brandbook\zawadi commit -m "feat: show guest cart from localStorage, gate login at checkout"
```

---

### Task 6: Wire `drainGuestCart` in `providers.tsx` (Google OAuth post-redirect)

**Files:**
- Modify: `frontend/src/app/providers.tsx`

Read the file first. The `AuthRehydrator` calls `/account/me/`, dispatches `setCredentials`, then `fetchCartCount`.

- [ ] **Step 1: Import `drainGuestCart`**

In `frontend/src/app/providers.tsx`, find:
```typescript
import { setCredentials, fetchCartCount } from "@/redux/userSlice";
```
Replace with:
```typescript
import { setCredentials, fetchCartCount, drainGuestCart } from "@/redux/userSlice";
```

- [ ] **Step 2: Dispatch `drainGuestCart` after `fetchCartCount`**

Find the `.then()` block inside `AuthRehydrator`:
```typescript
.then(({ data }) => {
  dispatch(
    setCredentials({
      userId: data.user_id,
      role: data.role,
      email: data.email,
      fullName: data.full_name,
      userType: (data.user_type as "guest" | "member") ?? null,
    })
  );
  dispatch(fetchCartCount());
})
```

Replace with:
```typescript
.then(({ data }) => {
  dispatch(
    setCredentials({
      userId: data.user_id,
      role: data.role,
      email: data.email,
      fullName: data.full_name,
      userType: (data.user_type as "guest" | "member") ?? null,
    })
  );
  dispatch(drainGuestCart()).then(() => {
    dispatch(fetchCartCount());
  });
})
```

This ensures:
1. Drain runs first (POSTs any localStorage items to the backend)
2. Then fetches the updated backend cart count

For the Google OAuth redirect landing case: `localStorage` persists across page navigations. When the user lands back on the frontend after Google auth, `AuthRehydrator` finds the auth cookie, calls `/me/`, and then drains the localStorage cart automatically.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd d:\Brandbook\zawadi\frontend && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 4: Verify build passes**

```bash
cd d:\Brandbook\zawadi\frontend && npm run build 2>&1 | tail -10
```
Expected: Build succeeds (the pre-existing `myorders/order/page.js` error may appear — that is unrelated).

- [ ] **Step 5: Commit**

```bash
git -C d:\Brandbook\zawadi add frontend/src/app/providers.tsx
git -C d:\Brandbook\zawadi commit -m "feat: drain localStorage guest cart on auth rehydration (covers Google OAuth redirect)"
```

---

## Manual smoke test checklist

Run `cd frontend && npm run dev` and test the full flow:

1. **Guest add to cart (product card):** Not logged in → click "Add to Cart" → item added instantly, toast shown, navbar cart count increments → no modal
2. **Guest add to cart (product detail):** Same flow, with user-selected quantity
3. **Guest cart page:** Navigate to `/cart` → sees items from localStorage with correct names, images, quantities → quantity +/- works → remove works → cart count in navbar updates
4. **Guest checkout gate:** On cart page → click "Proceed to Payment" → `CheckoutAuthModal` opens with Sign in / New here? tabs and Google button
5. **Email login + drain:** Sign in with existing account in modal → toast + navigated to `/checkout` → backend cart has the items that were in localStorage → localStorage is cleared
6. **New signup + drain:** Create account → OTP flow OR direct checkout (depends on OTP config) → same drain
7. **Google OAuth + drain:** Click "Continue with Google" in `CheckoutAuthModal` → redirects to Google → after auth, backend redirects to `/products` → `AuthRehydrator` drains localStorage to backend → cart count correct → user can navigate to `/cart` and see the items
8. **Logged-in user:** Cart page shows backend items normally; "Proceed to Payment" links directly to `/payment` (no modal)
9. **Navbar cart count for guest:** On fresh page load while not authenticated, `fetchCartCount` hits 401, falls back to `getGuestCartCount()` → count is correct

---

## Notes

- `localStorage` persists across full page navigations and Google OAuth redirects (unlike `sessionStorage`). No special handling is needed for the Google OAuth case beyond `AuthRehydrator` draining the cart.
- The `drainGuestCart` thunk uses `Promise.allSettled` so a single item failure does not block the rest from being added.
- Guest cart items on the cart page are rendered using the same `CartRow` component as authenticated items, via the `guestToCartItem` adapter. No UI duplication.
- The `OrderSummary` for guest shows subtotal only (no backend-computed shipping/tax). Shipping and tax are computed by the backend at `/orders/cart/checkout/` — the guest sees the accurate total only after signing in.
