# Cart Auth Flow & Smart Navbar Profile — Design Spec

## Goal

Allow unauthenticated users to add items to cart via a 2-field modal (email + password), create a guest account silently, complete the cart action without any page redirect, and replace the static profile icon with an auth-aware dropdown.

## Architecture

Three coordinated changes:

1. **AddToCartModal** — intercepts the "Add to Cart" action for unauthenticated users, handles guest registration + login + cart add in one flow
2. **Smart Navbar Profile Icon** — reads Redux auth state; renders "Login" button when unauthenticated, avatar + dropdown when authenticated
3. **Guest Profile Wiring** — navbar dropdown routes authenticated users to the correct profile/orders destination by role + userType; guest profile page already built

No new pages. No anonymous/localStorage cart. No session management changes. Backend cart remains server-side and user-tied.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Redux Toolkit (`userSlice` — `isAuthenticated`, `role`, `userType`, `cartCount`)
- Django REST Framework — `RegisterSerializer`, `CartItemCreateView`
- Axios via `api.js` (auto-attaches JWT cookie)
- Sonner toasts (bottom-right)

---

## Section 1: Add-to-Cart Modal

### Trigger

Any component that calls "Add to Cart" checks `isAuthenticated` from Redux before calling the cart API:
- If `true` → call API directly (existing behaviour)
- If `false` → open `AddToCartModal` with the `productId` (and optional `variantId`, `quantity`) stored in modal state

### Component: `frontend/src/components/shared/AddToCartModal.tsx`

**Props:**
```ts
type AddToCartModalProps = {
  isOpen: boolean;
  productId: number;
  variantId?: number;
  quantity?: number;
  onClose: () => void;
  onSuccess: (cartCount: number) => void;
};
```

**UI structure:**
- Full-screen semi-transparent backdrop
- Centered card (max-w-sm), rounded-2xl, white background
- Two tabs: `New here?` (default) | `Sign in`
- Guest tab fields: `Email`, `Password` (2 fields only)
- Sign in tab fields: `Email`, `Password`
- Primary CTA: `Continue as Guest` / `Sign In`
- Sub-text under guest tab: *"You can complete your profile details later"*
- Loading state on CTA button while requests are in-flight
- Error message inline (toast for unexpected errors, inline for wrong password)

### Guest tab call sequence

```
1. POST /account/register/
   Body: { email, password, user_type: "guest",
           full_name: email.split("@")[0],
           user_name: email.split("@")[0] + "_" + random4digits }

2. POST /account/login/
   Body: { email, password }

3. GET /account/me/
   → reads role, userType

4. POST /orders/cart/items/
   Body: { product_id, variant_id?, quantity }

5. dispatch(setCredentials({ userId, role, email, userType }))
   dispatch(setCartCount(res.data.summary.item_count))

6. onSuccess(cartCount) → modal closes, toast "Added to cart!"
```

### Sign in tab call sequence

```
1. POST /account/login/
   Body: { email, password }

2. GET /account/me/
   → reads role, userType

3. POST /orders/cart/items/
   Body: { product_id, variant_id?, quantity }

4. dispatch(setCredentials(...))
   dispatch(setCartCount(res.data.summary.item_count))

5. onSuccess(cartCount) → modal closes, toast "Added to cart!"
```

### Error handling

| Error | Handling |
|---|---|
| Email already registered (register step) | Switch to Sign In tab automatically, show inline: "Account exists — sign in instead" |
| Wrong password (login step) | Inline error: "Incorrect password" |
| Cart add fails | Toast error, modal stays open |
| Network failure | Toast error, modal stays open |

### Callers to update

- `frontend/src/components/productcards/productcards.tsx` — `handleAddToCart`: check `isAuthenticated` before API call; if false, set modal open state with productId
- `frontend/src/components/products/ProductDetails.tsx` — `handleAddToCart`: same pattern

Both components hold local state `{ modalOpen: boolean, pendingProductId: number | null }` and render `<AddToCartModal>`.

---

## Section 2: Backend — Make Registration Fields Optional

**File:** `backend/zewadi/accounts/serializers.py` — `RegisterSerializer`

Make the following fields `required=False` with sensible defaults:
- `phone` — optional, defaults to `""`
- `date_of_birth` — optional, defaults to `None`
- `gender` — optional, defaults to `""`
- `user_name` — optional, auto-generate from email prefix + 4 random digits if blank
- `full_name` — optional, defaults to email prefix if blank

`email`, `password`, `user_type` remain required.

**No migration needed** — these are serializer-level changes only (model fields already allow blank/null or the serializer handles defaults before saving).

---

## Section 3: Smart Navbar Profile Icon

**File:** `frontend/src/components/common/Navbar.tsx`

### State

Read from Redux:
```ts
const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
const role = useSelector((s: RootState) => s.user.role);
const userType = useSelector((s: RootState) => s.user.userType);
const fullName = useSelector((s: RootState) => s.user.fullName);
const email = useSelector((s: RootState) => s.user.email);
```

Local state: `const [profileOpen, setProfileOpen] = useState(false)`

### Not authenticated

Replace the current `<Link href="/login"><div>User icon</div></Link>` with:

```tsx
<Link
  href="/login"
  className="... text-white text-sm font-bold px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
>
  Login
</Link>
```

### Authenticated — Avatar

```tsx
<button onClick={() => setProfileOpen(v => !v)} aria-label="Open profile menu">
  <div className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold">
    {initials}  {/* first letter of fullName or email */}
  </div>
</button>
```

### Authenticated — Dropdown

Anchored below avatar, `z-50`, white card with shadow:

```
┌─────────────────────────────┐
│  [Avatar] Full Name         │
│           email@example.com │
│           [Guest] badge     │
├─────────────────────────────┤
│  My Profile                 │
│  My Orders                  │
├─────────────────────────────┤
│  Logout                     │
└─────────────────────────────┘
```

### Profile routing table

| role | userType | "My Profile" href | "My Orders" href |
|---|---|---|---|
| `community_user` | `guest` | `/guestprofile` | `/guestprofile/history` |
| `community_user` | `member` | `/communityDashBorde` | `/communityDashBorde/myorders` |
| `admin` | — | `/admindashboard` | `/admindashboard/orders` |
| `consultant` | — | `/consultant/profile` | `/consultant/appointments` |

### Logout

```ts
async function handleLogout() {
  await api.post("/account/logout/").catch(() => {});
  dispatch(clearCredentials());   // resets cartCount to 0 too
  router.push("/login");
}
```

Backdrop `<div onClick={() => setProfileOpen(false)}>` closes the dropdown.

---

## Section 4: Guest Profile Wiring

The `/guestprofile` page is fully built. It fetches `/account/me/`, `/orders/`, `/community/addresses/` and renders profile info, recent order, recipes panel, personal info, and upgrade CTA.

**What still needs wiring:**

1. **Navbar dropdown** (Section 3 above) — routes guest users to `/guestprofile`
2. **"Complete your profile" banner** — in `guestprofile.tsx`, after fetching `/account/me/`, check if `full_name` is blank or `phone` is blank. If either is missing, show a banner: *"Add your full name and phone number to complete your profile"* with an anchor scroll to the Personal Information section.
3. **Edit profile** — the existing "Edit Profile" button in `guestprofile.tsx` currently has no action. Wire it to open an inline edit form (name, phone fields) that calls `PATCH /account/me/`.

---

## Data Flow Summary

```
Unauthenticated user clicks "Add to Cart"
  └─→ AddToCartModal opens (productId stored in modal state)
        ├─ Guest tab: register → login → GET /me/ → POST cart → dispatch → close
        └─ Sign in tab:          login → GET /me/ → POST cart → dispatch → close

Authenticated user clicks "Add to Cart"
  └─→ POST /orders/cart/items/ directly → dispatch setCartCount → toast

Navbar profile icon
  ├─ isAuthenticated=false → "Login" button → /login
  └─ isAuthenticated=true  → avatar → dropdown
                                ├─ My Profile → role-based route
                                ├─ My Orders  → role-based route
                                └─ Logout → clearCredentials + /login
```

---

## Files Changed

| File | Change |
|---|---|
| `backend/zewadi/accounts/serializers.py` | Make `phone`, `date_of_birth`, `gender`, `user_name`, `full_name` optional |
| `frontend/src/components/shared/AddToCartModal.tsx` | **New** — modal component |
| `frontend/src/components/productcards/productcards.tsx` | Check auth before cart call; open modal if not authenticated |
| `frontend/src/components/products/ProductDetails.tsx` | Same |
| `frontend/src/components/common/Navbar.tsx` | Auth-aware profile icon + dropdown |
| `frontend/src/components/guestprofile/guestprofile.tsx` | "Complete profile" banner + wire Edit Profile button |

## Out of Scope

- Anonymous localStorage cart (not needed — modal captures account first)
- Cart merge logic (server cart is always tied to the authenticated user)
- Full profile edit page (inline edit in guestprofile is sufficient)
- Community dashboard Navbar (already has its own profile dropdown)
