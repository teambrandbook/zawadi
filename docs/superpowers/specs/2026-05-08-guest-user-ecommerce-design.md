# Guest User E-Commerce Flow — Design Spec
**Date:** 2026-05-08
**Status:** Approved
**Approach:** Leverage existing `CommunityUser.user_type` (GUEST/MEMBER) field — no new roles, no schema disruption beyond the address model fix.

---

## Overview

Guest users are registered, authenticated shoppers who can browse and purchase products but cannot access the Community Dashboard (recipes, consultations, events, blogs submission). They have a profile, order history, and order tracking. They can upgrade to a full Community Member at any time.

**What guests CAN do:**
- Sign up and log in (same form as members, Guest/Member toggle)
- Browse and search products
- Add to cart, manage cart
- Checkout with COD, save/reuse delivery addresses
- View order history and track orders
- Edit their profile (name, phone, photo)
- Upgrade to Community Member

**What guests CANNOT do:**
- Access `/communityDashBorde` (redirected to `/shop`)
- Submit recipes or blogs
- Book consultations
- Register for events
- Access community dashboard summary API

---

## Architecture: Approach A — Existing `user_type` field

`CommunityUser.user_type` (choices: `guest` | `member`) is already in the database and defaults to `guest`. Both guest and member share:
- The same `User` model and `role = COMMUNITY_USER`
- The same registration and login endpoints
- The same JWT auth flow

Access control gates check `request.user.communityuser.user_type`. Upgrade is a single PATCH call.

---

## Section 1: Backend

### 1.1 `accounts` app

**`RegisterSerializer`**
- Accept optional `user_type` field (`"guest"` | `"member"`, default `"guest"`).
- Pass through to `CommunityUser` creation (already creates the row).

**`MeAPIView` response**
- Add `user_type` field to the serialized output so the frontend can read it post-login.

**New endpoint: `PATCH /api/account/upgrade/`**
- Auth: `IsAuthenticated`
- Sets `request.user.communityuser.user_type = "member"` and saves.
- One-way — cannot downgrade via API.
- Returns updated `user_type`.

**New endpoint: `PATCH /api/account/me/` (profile update)**
- Auth: `IsAuthenticated`
- Accepts: `full_name`, `phone`, `photo` (partial update).
- Returns updated user object.

**New permission helpers** (in `accounts/permissions.py`):
```python
class IsGuestUser(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'communityuser') and \
               request.user.communityuser.user_type == 'guest'

class IsMemberUser(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'communityuser') and \
               request.user.communityuser.user_type == 'member'
```

### 1.2 `communityuser` app — Address model fix

**Migration:** Change `CommunityUserAddress` from `OneToOneField(User)` to `ForeignKey(User, related_name='addresses')`. Adds `label` field (e.g. "Home", "Work") and `is_default` boolean.

**New endpoints:**
- `GET /api/community/addresses/` — list all saved addresses for the current user
- `POST /api/community/addresses/` — save a new address `{ label?, full_name, phone, address, city, postal_code }`
- `DELETE /api/community/addresses/<id>/` — remove a saved address

### 1.3 `orders` app — no model changes

All endpoints already exist and are functional. Frontend just needs to call them:

| Endpoint | Purpose |
|---|---|
| `GET /api/orders/cart/` | Load cart |
| `POST /api/orders/cart/items/` | Add item to cart |
| `PATCH /api/orders/cart/items/<id>/` | Update quantity |
| `DELETE /api/orders/cart/items/<id>/` | Remove item |
| `POST /api/orders/cart/checkout/` | Place order from cart (COD) |
| `POST /api/orders/create/` | Place single-product order |
| `GET /api/orders/` | Order list |
| `GET /api/orders/<id>/` | Order detail / tracking |

Checkout payload:
```json
{
  "full_name": "...",
  "phone": "...",
  "email": "...",
  "city": "...",
  "postal_code": "...",
  "address": "...",
  "instructions": "...",
  "payment_method": "cod"
}
```

### 1.4 Access control additions

Apply `IsMemberUser` permission to:
- `GET /api/community/dashboard/summary/`
- Recipe create/update/delete endpoints
- Blog create/update/delete endpoints
- Consultation booking endpoints
- Event registration endpoints

Guests can still `GET` public-facing lists (products, recipes, blogs, events) — read-only public content is accessible.

---

## Section 2: Frontend Auth Flow

### 2.1 Redux (`userSlice.ts`)

Add `userType: "guest" | "member" | null` to state:
```ts
interface UserState {
  userId: string | null
  role: string | null
  email: string | null
  userType: "guest" | "member" | null  // NEW
}
```
`setCredentials` accepts `userType`. `clearCredentials` resets it to `null`.

### 2.2 Signup (`SignupComponent`)

- Add Guest / Member toggle at top of form — same pill-style toggle as in `LoginComponent.tsx`.
- Send `user_type` in the registration payload based on toggle selection.
- On success → call `GET /api/account/me/` → dispatch `setCredentials` with `userType` → redirect per role/userType.

### 2.3 Login (`LoginComponent.tsx`)

Wire the existing but non-functional Guest/Member toggle:
- Both paths hit the same `POST /api/account/login/` endpoint (no change to API).
- After login, call `GET /api/account/me/` to read `user_type`.
- Store in Redux and redirect:

```
role === "admin"                                   → /admindashboard
role === "consultant"                              → /consultant
role === "community_user" && userType === "guest"  → /shop
role === "community_user" && userType === "member" → /communityDashBorde
```

### 2.4 Route guards (in `layout.tsx` files)

- `app/communityDashBorde/layout.tsx` — if `userType === "guest"`, `router.replace("/shop")`
- `app/admindashboard/layout.tsx` — if `role !== "admin"`, redirect
- `app/consultant/layout.tsx` — if `role !== "consultant"`, redirect

Guards read from Redux store. On hard refresh, re-hydrate from `GET /api/account/me/` before rendering.

---

## Section 3: E-Commerce Flow

### 3.1 Cart page (`/cart`)

Replace hardcoded demo data:
- Mount → `GET /api/orders/cart/`
- Quantity `+/-` → `PATCH /api/orders/cart/items/<id>/`
- Remove → `DELETE /api/orders/cart/items/<id>/`
- Product card "Add to cart" → `POST /api/orders/cart/items/` `{ product_id, quantity: 1 }`
- Display real subtotal, shipping charge, total from API response
- "Proceed to Checkout" → `/payment`

### 3.2 Checkout / Payment page (`/payment`)

**Step 1 — Address**
1. Call `GET /api/community/addresses/` on mount.
2. If addresses exist: show saved address cards (select one) + "Use a different address" option.
3. If none or "Use a different address": show address form (full name, phone, address, city, postal code, instructions).
4. Checkbox: "Save this address to my profile" → if checked, call `POST /api/community/addresses/` before order.

**Step 2 — Payment**
- COD only. Pre-selected, no card form.

**Step 3 — Place Order**
- "Place Order" button → `POST /api/orders/cart/checkout/` with address fields + `payment_method: "cod"`.
- On success → `router.push("/orderplaced?order_id=" + response.order_id)`

### 3.3 Order Placed page (`/orderplaced`)

- Read `order_id` from URL query param.
- `GET /api/orders/<order_id>/` → show: order ID, product(s), total, COD badge, estimated delivery.
- "Continue Shopping" → `/shop`

### 3.4 Order History & Tracking (`/trackorder`)

- `GET /api/orders/` → list all orders, sorted newest first.
- Each order shows: order ID, date, item(s), total, status badge.
- Click → order detail page: status timeline (Pending → Confirmed → Processing → Shipped → Delivered).
- Also accessible from guest profile page (recent orders section).

---

## Section 4: Guest Profile & Upgrade

### 4.1 Guest Profile page (`/guestprofile`)

Replace mock data:
- `GET /api/account/me/` → name, email, phone, photo
- `GET /api/orders/` → recent 3 orders
- `GET /api/community/addresses/` → saved addresses

Profile edit (inline or modal):
- `PATCH /api/account/me/` with `{ full_name, phone, photo }`

### 4.2 Upgrade to Community Member

**Trigger points:**
1. Banner on guest profile page
2. Optional: subtle CTA in top nav ("Upgrade")

**Banner copy:**
> "Unlock recipes, consultations, events and more → Become a Community Member"

**Flow:**
1. User clicks CTA → confirmation modal appears.
2. Modal: "You're upgrading to a full Community Member. This unlocks the community dashboard, recipes, consultations and events. Ready?"
3. Confirm → `PATCH /api/account/upgrade/`
4. On success → update Redux `userType` to `"member"` → `router.replace("/communityDashBorde")`

### 4.3 Community content gating (frontend)

Guest users see community content buttons as either:
- **Hidden** — recipe submit, blog submit, consultation booking, event registration buttons not rendered
- **Upgrade prompt** — if they navigate to a protected URL, they see the upgrade CTA instead of the form

---

## Data Flow Summary

```
Guest Registration
  POST /api/account/register/ { ...fields, user_type: "guest" }
  → creates User (role=COMMUNITY_USER) + CommunityUser (user_type=guest)
  → GET /api/account/me/ → Redux { userType: "guest" }
  → redirect /shop

Guest Login
  POST /api/account/login/
  → GET /api/account/me/ → Redux { userType: "guest" }
  → redirect /shop

Add to Cart
  POST /api/orders/cart/items/ { product_id, quantity }

Checkout (COD)
  [optional] POST /api/community/addresses/ { address fields }
  POST /api/orders/cart/checkout/ { address fields, payment_method: "cod" }
  → redirect /orderplaced?order_id=ZW-2025-XXX

Upgrade to Member
  PATCH /api/account/upgrade/
  → Redux { userType: "member" }
  → redirect /communityDashBorde
```

---

## Out of Scope

- UPI / Card payment gateway (COD only for this implementation)
- Anonymous (no-account) checkout
- Downgrading a member back to guest
- Email verification or password reset (separate backlog item)
- Push notifications for order status changes
