# Guest User E-Commerce Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire guest user signup/login, cart, checkout (COD), order tracking, profile, and upgrade-to-member flow end-to-end across Django backend and Next.js 16 frontend.

**Architecture:** Use the existing `CommunityUser.user_type` field (`guest` | `member`) — no new roles. Backend adds `user_type` to `/account/me/`, adds `PATCH /account/upgrade/`, and adds address CRUD. Frontend gates `/communityDashBorde` to members only and routes guests to `/shop` after auth.

**Tech Stack:** Python 3 / Django 4 / DRF, Next.js 16 App Router, TypeScript, Redux Toolkit, Axios (`api.js`), Tailwind CSS v4.

---

## File Map

**Create:**
- `backend/zewadi/accounts/permissions.py` — `IsGuestUser`, `IsMemberUser` permission classes

**Modify (backend):**
- `backend/zewadi/accounts/serializers.py` — add `user_type` to `MeSerializer`
- `backend/zewadi/accounts/views.py` — add `UpgradeAPIView`, add `MeAPIView.patch()`
- `backend/zewadi/accounts/urls.py` — add `upgrade/` and PATCH `me/`
- `backend/zewadi/communityuser/models.py` — `CommunityUserAddress`: OneToOne→FK + `label`, `is_default`, `full_name`, `phone` fields
- `backend/zewadi/communityuser/serializers.py` — remove `address` from profile serializer, add `DeliveryAddressSerializer`
- `backend/zewadi/communityuser/views.py` — add `AddressListCreateView`, `AddressDeleteView`, gate dashboard summary
- `backend/zewadi/communityuser/urls.py` — add address routes

**Modify (frontend):**
- `frontend/src/redux/userSlice.ts` — add `userType` to state
- `frontend/src/components/shared/AuthGuard.tsx` — read `user_type`, add `allowedUserTypes` prop
- `frontend/src/components/shared/LoginComponent.tsx` — call `/account/me/` after login, route by `userType`
- `frontend/src/components/signup/SignupComponent.tsx` — add Guest/Member toggle, send `user_type`
- `frontend/src/app/communityDashBorde/layout.tsx` — add `allowedUserTypes={["member"]}`
- `frontend/src/components/cart/cart.tsx` — replace hardcoded data with API
- `frontend/src/components/payment/payment.tsx` — wire address fetch + COD checkout
- `frontend/src/components/orderplaced/orderplaced.tsx` — fetch order by `order_id` param
- `frontend/src/components/trackorder/trackorder.tsx` — fetch `/orders/` list
- `frontend/src/components/guestprofile/guestprofile.tsx` — fetch real data + upgrade CTA

---

## Task 1: Add `user_type` to `MeSerializer` + create permission classes

**Files:**
- Modify: `backend/zewadi/accounts/serializers.py`
- Create: `backend/zewadi/accounts/permissions.py`
- Test: `backend/zewadi/accounts/tests.py`

- [ ] **Step 1: Write failing tests**

```python
# backend/zewadi/accounts/tests.py
from django.test import TestCase
from rest_framework.test import APIClient
from accounts.models import User
from communityuser.models import CommunityUser, UserType


class MeSerializerTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="guest@test.com",
            password="pass1234",
            full_name="Guest User",
            user_name="guestuser",
            phone="1234567890",
            role="COMMUNITY_USER",
        )
        CommunityUser.objects.create(user=self.user, user_type=UserType.GUEST)

    def test_me_returns_user_type(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/account/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user_type"], "guest")

    def test_me_returns_member_user_type(self):
        self.user.communityuser.user_type = UserType.MEMBER
        self.user.communityuser.save()
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/account/me/")
        self.assertEqual(response.data["user_type"], "member")
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend/zewadi
python manage.py test accounts.tests.MeSerializerTest -v 2
```
Expected: `AssertionError: None != 'guest'` (field missing from response)

- [ ] **Step 3: Add `user_type` to `MeSerializer`**

In `backend/zewadi/accounts/serializers.py`, update `MeSerializer`:

```python
class MeSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "user_id",
            "email",
            "role",
            "full_name",
            "user_name",
            "phone",
            "date_of_birth",
            "gender",
            "location",
            "photo",
            "user_type",
        ]

    def get_role(self, obj):
        return str(obj.role).lower()

    def get_user_type(self, obj):
        try:
            return obj.communityuser.user_type
        except Exception:
            return None
```

- [ ] **Step 4: Create `accounts/permissions.py`**

```python
# backend/zewadi/accounts/permissions.py
from rest_framework.permissions import BasePermission


class IsMemberUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "communityuser")
            and request.user.communityuser.user_type == "member"
        )


class IsGuestUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "communityuser")
            and request.user.communityuser.user_type == "guest"
        )
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
python manage.py test accounts.tests.MeSerializerTest -v 2
```
Expected: `OK (2 tests)`

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/accounts/serializers.py backend/zewadi/accounts/permissions.py backend/zewadi/accounts/tests.py
git commit -m "feat(accounts): add user_type to MeSerializer and permission classes"
```

---

## Task 2: Add `UpgradeAPIView` + `MeAPIView.patch()` + wire URLs

**Files:**
- Modify: `backend/zewadi/accounts/views.py`
- Modify: `backend/zewadi/accounts/urls.py`
- Test: `backend/zewadi/accounts/tests.py`

- [ ] **Step 1: Write failing tests**

Add to `backend/zewadi/accounts/tests.py`:

```python
class UpgradeAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="upgrade@test.com",
            password="pass1234",
            full_name="Upgrade User",
            user_name="upgradeuser",
            phone="1234567890",
            role="COMMUNITY_USER",
        )
        CommunityUser.objects.create(user=self.user, user_type=UserType.GUEST)

    def test_guest_can_upgrade_to_member(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch("/api/account/upgrade/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user_type"], "member")
        self.user.communityuser.refresh_from_db()
        self.assertEqual(self.user.communityuser.user_type, "member")

    def test_unauthenticated_cannot_upgrade(self):
        response = self.client.patch("/api/account/upgrade/")
        self.assertEqual(response.status_code, 401)


class MePatchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="patch@test.com",
            password="pass1234",
            full_name="Old Name",
            user_name="patchuser",
            phone="0000000000",
            role="COMMUNITY_USER",
        )

    def test_patch_me_updates_full_name(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            "/api/account/me/",
            {"full_name": "New Name"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.full_name, "New Name")
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
python manage.py test accounts.tests.UpgradeAPIViewTest accounts.tests.MePatchTest -v 2
```
Expected: 404 errors (routes don't exist yet)

- [ ] **Step 3: Add `UpgradeAPIView` and `MeAPIView.patch()` to `views.py`**

In `backend/zewadi/accounts/views.py`, add the import at the top:
```python
from communityuser.models import CommunityUser
```

Then replace the existing `MeAPIView` class and add `UpgradeAPIView` after it:

```python
class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = MeSerializer(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        for field in ("full_name", "phone"):
            if field in request.data:
                setattr(user, field, request.data[field])
        if "photo" in request.FILES:
            user.photo = request.FILES["photo"]
        user.save()
        serializer = MeSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpgradeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            community_user = request.user.communityuser
        except CommunityUser.DoesNotExist:
            return Response(
                {"error": "No community profile found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        community_user.user_type = "member"
        community_user.save(update_fields=["user_type"])
        return Response({"user_type": "member"}, status=status.HTTP_200_OK)
```

Also add `MultiPartParser, FormParser, JSONParser` to the imports at the top of `views.py`:
```python
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
```

- [ ] **Step 4: Wire URLs in `accounts/urls.py`**

```python
from django.urls import path
from .views import (
    RegisterAPIView,
    LoginAPIView,
    RefreshAPIView,
    LogoutAPIView,
    MeAPIView,
    UpgradeAPIView,
    GoogleLoginAPIView,
    GoogleCallbackAPIView,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("refresh/", RefreshAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
    path("upgrade/", UpgradeAPIView.as_view()),
    path("google-login/", GoogleLoginAPIView.as_view()),
    path("google/login/", GoogleLoginAPIView.as_view()),
    path("google/callback/", GoogleCallbackAPIView.as_view()),
]
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
python manage.py test accounts.tests.UpgradeAPIViewTest accounts.tests.MePatchTest -v 2
```
Expected: `OK (3 tests)`

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/accounts/views.py backend/zewadi/accounts/urls.py backend/zewadi/accounts/tests.py
git commit -m "feat(accounts): add PATCH /account/me/ and PATCH /account/upgrade/ endpoints"
```

---

## Task 3: Migrate `CommunityUserAddress` to ForeignKey + new fields

**Files:**
- Modify: `backend/zewadi/communityuser/models.py`
- Modify: `backend/zewadi/communityuser/serializers.py`
- Migration: auto-generated

- [ ] **Step 1: Update `communityuser/models.py`**

Replace the `CommunityUserAddress` class:

```python
class CommunityUserAddress(models.Model):
    user = models.ForeignKey(
        CommunityUser,
        on_delete=models.CASCADE,
        related_name="addresses",
    )
    label = models.CharField(max_length=50, blank=True, default="")
    is_default = models.BooleanField(default=False)
    full_name = models.CharField(max_length=255, blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, default="")
    country = models.CharField(max_length=100, blank=True, default="")
    postal_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.user.email} — {self.label or self.address_line}"
```

- [ ] **Step 2: Generate migration**

```bash
cd backend/zewadi
python manage.py makemigrations communityuser --name "address_fk_and_delivery_fields"
```

Expected output: `Migrations for 'communityuser': communityuser/migrations/0004_address_fk_and_delivery_fields.py`

If Django reports a conflict or cannot auto-detect, run:
```bash
python manage.py makemigrations communityuser --empty --name "address_fk_and_delivery_fields"
```
Then manually write the migration operations.

- [ ] **Step 3: Apply migration**

```bash
python manage.py migrate
```
Expected: `Applying communityuser.0004_address_fk_and_delivery_fields... OK`

- [ ] **Step 4: Update `CommunityProfileSerializer` in `communityuser/serializers.py`**

Remove the `address` field and its handling since addresses are now managed via the dedicated CRUD endpoints. Replace the entire file:

```python
from rest_framework import serializers
from zewadi.validators import validate_image_upload
from .models import CommunityUser, CommunityUserAddress, UserType


class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityUserAddress
        fields = [
            "id",
            "label",
            "is_default",
            "full_name",
            "phone",
            "address_line",
            "city",
            "state",
            "country",
            "postal_code",
        ]


class CommunityProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source="user.user_id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    user_name = serializers.CharField(source="user.user_name", read_only=True)

    full_name = serializers.CharField(source="user.full_name", required=False)
    phone = serializers.CharField(source="user.phone", required=False)
    date_of_birth = serializers.DateField(
        source="user.date_of_birth", required=False, allow_null=True
    )
    gender = serializers.CharField(
        source="user.gender", required=False, allow_blank=True, allow_null=True
    )
    location = serializers.CharField(
        source="user.location", required=False, allow_blank=True, allow_null=True
    )
    photo = serializers.ImageField(
        source="user.photo",
        required=False,
        allow_null=True,
        validators=[validate_image_upload],
    )
    user_type = serializers.CharField(required=False)

    class Meta:
        model = CommunityUser
        fields = [
            "user_id",
            "email",
            "role",
            "user_name",
            "full_name",
            "phone",
            "date_of_birth",
            "gender",
            "location",
            "photo",
            "user_type",
            "wellness_interests",
            "diet_preference",
            "preferred_communication",
            "notification_preferences",
            "activate_immediately",
            "send_welcome_email",
            "send_password_setup",
            "allow_notifications",
            "is_verified_member",
        ]
        read_only_fields = ["is_verified_member"]

    def validate_user_type(self, value):
        normalized = str(value).strip().lower()
        valid_values = {choice[0] for choice in UserType.choices}
        if normalized not in valid_values:
            raise serializers.ValidationError(
                f"Invalid user_type. Choose from: {sorted(valid_values)}."
            )
        return normalized

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        return instance
```

- [ ] **Step 5: Verify app starts cleanly**

```bash
python manage.py check
```
Expected: `System check identified no issues (0 silenced).`

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/communityuser/models.py backend/zewadi/communityuser/serializers.py backend/zewadi/communityuser/migrations/
git commit -m "feat(communityuser): migrate CommunityUserAddress to FK, add delivery fields"
```

---

## Task 4: Address CRUD endpoints

**Files:**
- Modify: `backend/zewadi/communityuser/views.py`
- Modify: `backend/zewadi/communityuser/urls.py`
- Test: `backend/zewadi/communityuser/tests.py` (create if missing)

- [ ] **Step 1: Write failing tests**

Create `backend/zewadi/communityuser/tests.py`:

```python
from django.test import TestCase
from rest_framework.test import APIClient
from accounts.models import User
from communityuser.models import CommunityUser, CommunityUserAddress, UserType


class AddressAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="addr@test.com",
            password="pass1234",
            full_name="Addr User",
            user_name="addruser",
            phone="1234567890",
            role="COMMUNITY_USER",
        )
        self.community_user = CommunityUser.objects.create(
            user=self.user, user_type=UserType.GUEST
        )
        self.client.force_authenticate(user=self.user)

    def test_list_addresses_empty(self):
        response = self.client.get("/api/community/addresses/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_create_address(self):
        payload = {
            "label": "Home",
            "full_name": "Addr User",
            "phone": "9876543210",
            "address_line": "123 Main St",
            "city": "Mumbai",
            "postal_code": "400001",
        }
        response = self.client.post("/api/community/addresses/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CommunityUserAddress.objects.count(), 1)

    def test_delete_address(self):
        addr = CommunityUserAddress.objects.create(
            user=self.community_user,
            address_line="123 Test",
            city="Mumbai",
            postal_code="400001",
        )
        response = self.client.delete(f"/api/community/addresses/{addr.pk}/")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(CommunityUserAddress.objects.count(), 0)
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
python manage.py test communityuser.tests.AddressAPITest -v 2
```
Expected: 404 errors (routes don't exist yet)

- [ ] **Step 3: Add address views to `communityuser/views.py`**

Add at the bottom of `backend/zewadi/communityuser/views.py`:

```python
from .models import CommunityUser, CommunityUserAddress, UserType
from .serializers import CommunityProfileSerializer, DeliveryAddressSerializer


class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            community_user = request.user.communityuser
        except CommunityUser.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
        addresses = community_user.addresses.all().order_by("-is_default", "-id")
        return Response(
            DeliveryAddressSerializer(addresses, many=True).data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        try:
            community_user = request.user.communityuser
        except CommunityUser.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = DeliveryAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=community_user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            community_user = request.user.communityuser
            address = community_user.addresses.get(pk=pk)
        except (CommunityUser.DoesNotExist, CommunityUserAddress.DoesNotExist):
            return Response(
                {"error": "Address not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

Also update the import at the top of `views.py` — change the existing `.models` import line to:
```python
from .models import CommunityUser, CommunityUserAddress, UserType
```
And add the serializer import:
```python
from .serializers import CommunityProfileSerializer, DeliveryAddressSerializer
```

- [ ] **Step 4: Wire URLs in `communityuser/urls.py`**

```python
from django.urls import path
from .views import (
    CommunityDashboardSummaryAPIView,
    CommunityProfileAPIView,
    AddressListCreateView,
    AddressDeleteView,
)

urlpatterns = [
    path("profile/", CommunityProfileAPIView.as_view(), name="community-profile"),
    path(
        "dashboard/summary/",
        CommunityDashboardSummaryAPIView.as_view(),
        name="community-dashboard-summary",
    ),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<int:pk>/", AddressDeleteView.as_view(), name="address-delete"),
]
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
python manage.py test communityuser.tests.AddressAPITest -v 2
```
Expected: `OK (3 tests)`

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/communityuser/views.py backend/zewadi/communityuser/urls.py backend/zewadi/communityuser/tests.py
git commit -m "feat(communityuser): add delivery address CRUD endpoints"
```

---

## Task 5: Gate `CommunityDashboardSummaryAPIView` to members only

**Files:**
- Modify: `backend/zewadi/communityuser/views.py`
- Test: `backend/zewadi/communityuser/tests.py`

- [ ] **Step 1: Write failing test**

Add to `backend/zewadi/communityuser/tests.py`:

```python
class DashboardSummaryPermissionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.guest_user = User.objects.create_user(
            email="guestdash@test.com",
            password="pass1234",
            full_name="Guest Dash",
            user_name="guestdash",
            phone="1111111111",
            role="COMMUNITY_USER",
        )
        CommunityUser.objects.create(user=self.guest_user, user_type=UserType.GUEST)

        self.member_user = User.objects.create_user(
            email="memberdash@test.com",
            password="pass1234",
            full_name="Member Dash",
            user_name="memberdash",
            phone="2222222222",
            role="COMMUNITY_USER",
        )
        CommunityUser.objects.create(user=self.member_user, user_type=UserType.MEMBER)

    def test_guest_cannot_access_dashboard_summary(self):
        self.client.force_authenticate(user=self.guest_user)
        response = self.client.get("/api/community/dashboard/summary/")
        self.assertEqual(response.status_code, 403)

    def test_member_can_access_dashboard_summary(self):
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get("/api/community/dashboard/summary/")
        self.assertEqual(response.status_code, 200)
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
python manage.py test communityuser.tests.DashboardSummaryPermissionTest -v 2
```
Expected: Guest gets 200 but test expects 403

- [ ] **Step 3: Add `IsMemberUser` to `CommunityDashboardSummaryAPIView`**

In `backend/zewadi/communityuser/views.py`, add at the top:
```python
from accounts.permissions import IsMemberUser
```

Then update `CommunityDashboardSummaryAPIView`:
```python
class CommunityDashboardSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCommunityUser, IsMemberUser]
    # rest of the class unchanged ...
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
python manage.py test communityuser.tests.DashboardSummaryPermissionTest -v 2
```
Expected: `OK (2 tests)`

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/communityuser/views.py backend/zewadi/communityuser/tests.py
git commit -m "feat(communityuser): restrict dashboard/summary to member users only"
```

---

## Task 6: Add `userType` to Redux `userSlice.ts`

**Files:**
- Modify: `frontend/src/redux/userSlice.ts`

- [ ] **Step 1: Update `UserState` interface and initial state**

Replace the contents of `frontend/src/redux/userSlice.ts`:

```typescript
import api from "@/services/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
  userType: "guest" | "member" | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userId: null,
  role: null,
  email: null,
  fullName: null,
  userType: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: Record<string, unknown> | FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/account/register/", data);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      return rejectWithValue(error.response?.data ?? "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/account/login/", data);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      return rejectWithValue(error.response?.data ?? "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await api.post("/account/logout/");
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        userId?: string;
        role?: string;
        email?: string;
        fullName?: string;
        userType?: "guest" | "member" | null;
      }>
    ) {
      const { userId, role, email, fullName, userType } = action.payload;
      if (userId !== undefined) state.userId = userId;
      if (role !== undefined) state.role = role;
      if (email !== undefined) state.email = email;
      if (fullName !== undefined) state.fullName = fullName;
      if (userType !== undefined) state.userType = userType;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials(state) {
      state.userId = null;
      state.role = null;
      state.email = null;
      state.fullName = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const d = action.payload?.data ?? action.payload;
        state.userId = d.user_id ?? d.userId ?? null;
        state.role = d.role ?? null;
        state.email = d.email ?? null;
        state.fullName =
          [d.first_name, d.last_name].filter(Boolean).join(" ") || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed";
      });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userId = null;
      state.role = null;
      state.email = null;
      state.fullName = null;
      state.userType = null;
      state.isAuthenticated = false;
    });

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Registration failed";
      });
  },
});

export const { setCredentials, clearCredentials } = userSlice.actions;
export default userSlice.reducer;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend
npm run build 2>&1 | grep -E "error|Error" | head -20
```
Expected: no TypeScript errors related to `userSlice.ts`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/redux/userSlice.ts
git commit -m "feat(redux): add userType field to user slice"
```

---

## Task 7: Update `AuthGuard.tsx` to route guests and support `allowedUserTypes`

**Files:**
- Modify: `frontend/src/components/shared/AuthGuard.tsx`

- [ ] **Step 1: Replace `AuthGuard.tsx`**

```typescript
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { clearCredentials, setCredentials } from "@/redux/userSlice";
import api from "@/services/api";

type GuardRole = "admin" | "consultant" | "community_user";

type MeResponse = {
  user_id?: string;
  email?: string;
  role?: string;
  full_name?: string;
  user_type?: string;
};

const roleHome: Record<GuardRole, string> = {
  admin: "/admindashboard",
  consultant: "/consultant",
  community_user: "/communityDashBorde",
};

function normalizeRole(role?: string | null): GuardRole | null {
  const normalized = String(role ?? "").toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "consultant") return "consultant";
  if (normalized === "community_user") return "community_user";
  return null;
}

export default function AuthGuard({
  allowedRoles,
  allowedUserTypes,
  children,
}: {
  allowedRoles: GuardRole[];
  allowedUserTypes?: ("guest" | "member")[];
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") {
    return <>{children}</>;
  }
  return (
    <BrowserAuthGuard allowedRoles={allowedRoles} allowedUserTypes={allowedUserTypes}>
      {children}
    </BrowserAuthGuard>
  );
}

function BrowserAuthGuard({
  allowedRoles,
  allowedUserTypes,
  children,
}: {
  allowedRoles: GuardRole[];
  allowedUserTypes?: ("guest" | "member")[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  const allowedKey = allowedRoles.join("|");
  const allowed = useMemo(() => new Set(allowedKey.split("|") as GuardRole[]), [allowedKey]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const { data } = await api.get<MeResponse>("/account/me/");
        if (cancelled) return;

        const role = normalizeRole(data.role);
        const userType = (data.user_type as "guest" | "member") ?? null;

        dispatch(
          setCredentials({
            userId: data.user_id,
            role: role ?? data.role,
            email: data.email,
            fullName: data.full_name,
            userType,
          })
        );

        if (!role) {
          dispatch(clearCredentials());
          router.replace("/login");
          return;
        }

        if (!allowed.has(role)) {
          const home =
            role === "community_user" && userType === "guest"
              ? "/shop"
              : roleHome[role];
          router.replace(home);
          return;
        }

        // Role is allowed — now check userType restriction if provided
        if (allowedUserTypes && allowedUserTypes.length > 0) {
          if (!userType || !allowedUserTypes.includes(userType)) {
            router.replace("/shop");
            return;
          }
        }

        setStatus("allowed");
      } catch {
        if (cancelled) return;
        dispatch(clearCredentials());
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [allowed, allowedKey, allowedUserTypes, dispatch, pathname, router]);

  if (status !== "allowed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[#0A4833]">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend && npm run build 2>&1 | grep -E "error TS" | head -10
```
Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/shared/AuthGuard.tsx
git commit -m "feat(auth): AuthGuard reads user_type, supports allowedUserTypes prop"
```

---

## Task 8: Update `LoginComponent.tsx` to route by `userType`

**Files:**
- Modify: `frontend/src/components/shared/LoginComponent.tsx`

- [ ] **Step 1: Update `handleLogin` to call `/account/me/` and dispatch `userType`**

In `frontend/src/components/shared/LoginComponent.tsx`, replace the `handleLogin` function:

```typescript
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await api.post("/account/login/", { email, password });
    const data = res.data.data;
    const role = normalizeRole(data.role);
    const accessToken = res.data.access;

    if (accessToken) {
      document.cookie = `access_token=${encodeURIComponent(accessToken)}; path=/; max-age=${30 * 60}; SameSite=Lax`;
    }

    // Fetch user_type from /me (login response does not include it)
    const meRes = await api.get("/account/me/");
    const userType = (meRes.data.user_type as "guest" | "member") ?? null;

    dispatch(setCredentials({
      userId: data.user_id,
      role,
      email: data.email,
      userType,
    }));

    if (role === "admin") {
      router.push("/admindashboard");
    } else if (role === "consultant") {
      router.push("/consultant");
    } else if (role === "community_user" && userType === "guest") {
      router.push("/shop");
    } else {
      router.push("/communityDashBorde");
    }
  } catch (error: unknown) {
    console.log("Login error:", error);
    toast.error("Login failed. Please check your credentials.");
  }
};
```

- [ ] **Step 2: Manually test login flow**

Start dev servers:
```bash
# Terminal 1
cd backend/zewadi && python manage.py runserver
# Terminal 2
cd frontend && npm run dev
```

1. Register a guest user via `POST /api/account/register/` with `user_type: "guest"` (use curl or Postman)
2. Go to `http://localhost:3000/login`
3. Log in with the guest credentials
4. Confirm redirect goes to `/shop` (not `/communityDashBorde`)
5. Register a member user with `user_type: "member"`, log in, confirm redirect to `/communityDashBorde`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/shared/LoginComponent.tsx
git commit -m "feat(login): route guests to /shop and members to /communityDashBorde after login"
```

---

## Task 9: Add Guest/Member toggle to `SignupComponent.tsx`

**Files:**
- Modify: `frontend/src/components/signup/SignupComponent.tsx`

- [ ] **Step 1: Add `accountType` state and toggle**

In `frontend/src/components/signup/SignupComponent.tsx`:

1. Add the `accountType` state after the existing `useState` declarations:
```typescript
const [accountType, setAccountType] = useState<"guest" | "member">("guest");
```

2. Add the toggle UI directly after the `<div className="text-center">` heading block and before the Google button. Insert:
```tsx
<div className="flex flex-col items-center mt-3 mb-1">
  <p className="text-[10px] text-[#6b7280] mb-2 uppercase font-bold tracking-widest">
    Sign up as
  </p>
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => setAccountType("guest")}
      className={`w-[120px] h-[36px] rounded-lg border-2 text-xs font-semibold transition-all ${
        accountType === "guest"
          ? "border-[#9f8151] bg-[#fdfaf3] text-[#9f8151]"
          : "border-gray-200 bg-white text-gray-400 opacity-60"
      }`}
    >
      Guest
    </button>
    <span className="text-[#0a4833] text-sm font-bold italic">or</span>
    <button
      type="button"
      onClick={() => setAccountType("member")}
      className={`w-[120px] h-[36px] rounded-lg text-xs font-semibold transition-all ${
        accountType === "member"
          ? "bg-[#0a4833] text-white shadow-md"
          : "bg-gray-100 text-gray-400 opacity-60"
      }`}
    >
      Member
    </button>
  </div>
</div>
```

3. In `handleSubmit`, add `user_type: accountType` to the registration payload:
```typescript
await api.post("/account/register/", {
  full_name: form.full_name.trim(),
  user_name: form.user_name.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  date_of_birth: form.date_of_birth,
  gender: form.gender,
  password: form.password,
  user_type: accountType,   // <-- ADD THIS LINE
});
```

- [ ] **Step 2: Manually test signup toggle**

1. Go to `http://localhost:3000/signup`
2. Confirm "Guest" and "Member" toggle renders with correct visual styles (Guest: gold border, Member: green fill — same as login page)
3. Sign up as Guest → log in → confirm redirect to `/shop`
4. Sign up as Member → log in → confirm redirect to `/communityDashBorde`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/signup/SignupComponent.tsx
git commit -m "feat(signup): add Guest/Member toggle, send user_type on registration"
```

---

## Task 10: Block guests from `communityDashBorde`

**Files:**
- Modify: `frontend/src/app/communityDashBorde/layout.tsx`

- [ ] **Step 1: Add `allowedUserTypes` to the `AuthGuard` call**

In `frontend/src/app/communityDashBorde/layout.tsx`, change:
```tsx
<AuthGuard allowedRoles={["community_user"]}>
```
to:
```tsx
<AuthGuard allowedRoles={["community_user"]} allowedUserTypes={["member"]}>
```

- [ ] **Step 2: Manually verify guest redirect**

1. Log in as a guest user
2. Manually navigate to `http://localhost:3000/communityDashBorde`
3. Confirm you are redirected to `/shop` (not shown "Checking session..." forever, and not shown the dashboard)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/communityDashBorde/layout.tsx
git commit -m "feat(guard): block guest users from communityDashBorde"
```

---

## Task 11: Wire `cart.tsx` to API

**Files:**
- Modify: `frontend/src/components/cart/cart.tsx`

- [ ] **Step 1: Replace hardcoded data with API state**

At the top of `frontend/src/components/cart/cart.tsx`, replace the hardcoded `initialCartItems` array and the local `useState` with API-driven state. Replace the entire file content from the first `type CartItem` line through `const [cartItems, setCartItems]` with:

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_subtitle: string;
  image: string;
  unit_price: string;
  line_total: string;
  quantity: number;
  stock_quantity: number;
  currency: string;
};

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  free_shipping_unlocked: boolean;
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    try {
      const res = await api.get("/orders/cart/");
      setItems(res.data.items ?? []);
      setSummary(res.data.summary ?? null);
    } catch {
      toast.error("Could not load cart.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCart(); }, []);

  async function handleQuantityChange(itemId: number, newQty: number) {
    if (newQty < 1) return;
    try {
      const res = await api.patch(`/orders/cart/items/${itemId}/`, { quantity: newQty });
      setItems(res.data.items ?? []);
      setSummary(res.data.summary ?? null);
    } catch {
      toast.error("Could not update quantity.");
    }
  }

  async function handleRemove(itemId: number) {
    try {
      const res = await api.delete(`/orders/cart/items/${itemId}/`);
      setItems(res.data.items ?? []);
      setSummary(res.data.summary ?? null);
      toast.success("Item removed.");
    } catch {
      toast.error("Could not remove item.");
    }
  }
```

Then keep the JSX structure but replace all references to `cartItems` with `items`, `item.name` with `item.product_name`, `item.price` with `parseFloat(item.unit_price)`, and the order summary numbers with `summary?.subtotal`, `summary?.shipping`, `summary?.total`.

Add a loading state at the top of the JSX:
```tsx
if (loading) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
      Loading cart...
    </div>
  );
}

if (items.length === 0) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-semibold text-[#0A4833]">Your cart is empty</p>
      <Link href="/shop" className="rounded-lg bg-[#0A4833] px-6 py-2 text-sm text-white">
        Shop Now
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Manually test cart**

1. Log in as a guest
2. Add a product to cart via the products page (the product card's "Add to cart" button calls `POST /api/orders/cart/items/` — if not yet wired, test directly with the API)
3. Navigate to `/cart`
4. Confirm cart items load from API (not hardcoded)
5. Change quantity — confirm API call fires and totals update
6. Remove an item — confirm item disappears

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/cart/cart.tsx
git commit -m "feat(cart): wire cart to API, replace hardcoded data"
```

---

## Task 12: Wire `payment.tsx` to API (address + COD checkout)

**Files:**
- Modify: `frontend/src/components/payment/payment.tsx`

- [ ] **Step 1: Add address fetch and checkout state at the top of the component**

In `frontend/src/components/payment/payment.tsx`, add these imports after the existing ones:

```typescript
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
```

Replace the existing hardcoded data and local state with:

```typescript
type SavedAddress = {
  id: number;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
};

export default function Payment() {
  const router = useRouter();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    instructions: "",
  });

  useEffect(() => {
    api.get("/community/addresses/").then((res) => {
      setSavedAddresses(res.data ?? []);
      if (res.data?.length > 0) {
        setSelectedAddressId(res.data[0].id);
      } else {
        setShowForm(true);
      }
    }).catch(() => {
      setShowForm(true);
    });
  }, []);

  function getActiveAddress() {
    if (selectedAddressId) {
      return savedAddresses.find((a) => a.id === selectedAddressId);
    }
    return null;
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    try {
      let addressPayload = form;

      if (selectedAddressId && !showForm) {
        const addr = getActiveAddress();
        if (addr) {
          addressPayload = {
            full_name: addr.full_name,
            phone: addr.phone,
            address: addr.address_line,
            city: addr.city,
            postal_code: addr.postal_code,
            instructions: "",
          };
        }
      } else if (saveAddress) {
        await api.post("/community/addresses/", {
          full_name: form.full_name,
          phone: form.phone,
          address_line: form.address,
          city: form.city,
          postal_code: form.postal_code,
        });
      }

      const meRes = await api.get("/account/me/");
      const res = await api.post("/orders/cart/checkout/", {
        full_name: addressPayload.full_name,
        phone: addressPayload.phone,
        email: meRes.data.email,
        city: addressPayload.city,
        postal_code: addressPayload.postal_code,
        address: addressPayload.address,
        instructions: addressPayload.instructions || "",
        payment_method: "cod",
      });

      router.push(`/orderplaced?order_id=${res.data.primary_order_id}`);
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err
          ? JSON.stringify((err as { response?: { data?: unknown } }).response?.data)
          : "Checkout failed.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }
```

- [ ] **Step 2: Wire address section in the JSX**

In the address section of the JSX (where the address form currently lives), add the saved address selector above the form:

```tsx
{/* Saved address selector */}
{savedAddresses.length > 0 && !showForm && (
  <div className="mb-4">
    <p className="text-xs font-bold uppercase text-[#374151] mb-2">Saved Addresses</p>
    <div className="space-y-2">
      {savedAddresses.map((addr) => (
        <label
          key={addr.id}
          className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
            selectedAddressId === addr.id
              ? "border-[#0a4833] bg-[#f0faf5]"
              : "border-gray-200 bg-white"
          }`}
        >
          <input
            type="radio"
            name="saved_address"
            value={addr.id}
            checked={selectedAddressId === addr.id}
            onChange={() => setSelectedAddressId(addr.id)}
            className="mt-0.5 accent-[#0a4833]"
          />
          <div className="text-xs text-[#374151]">
            <p className="font-semibold">{addr.label || "Saved Address"}</p>
            <p>{addr.full_name} · {addr.phone}</p>
            <p>{addr.address_line}, {addr.city} — {addr.postal_code}</p>
          </div>
        </label>
      ))}
    </div>
    <button
      type="button"
      onClick={() => { setShowForm(true); setSelectedAddressId(null); }}
      className="mt-2 text-xs text-[#0a4833] underline"
    >
      Use a different address
    </button>
  </div>
)}

{/* Address form — shown when no saved addresses or user picks new */}
{showForm && (
  <div>
    {/* ... keep existing form fields but bind to `form` state ... */}
    {/* Full Name input → value={form.full_name} onChange={(e) => setForm(p => ({...p, full_name: e.target.value}))} */}
    {/* Phone → form.phone */}
    {/* Address → form.address */}
    {/* City → form.city */}
    {/* Postal Code → form.postal_code */}

    <label className="flex items-center gap-2 mt-3 text-xs text-[#6b7280]">
      <input
        type="checkbox"
        checked={saveAddress}
        onChange={(e) => setSaveAddress(e.target.checked)}
        className="accent-[#0a4833]"
      />
      Save this address to my profile
    </label>
  </div>
)}
```

Replace the "Place Order" / submit button's `onClick` with `handlePlaceOrder`, and set `disabled={submitting}`:
```tsx
<button
  type="button"
  onClick={handlePlaceOrder}
  disabled={submitting}
  className="..."
>
  {submitting ? "Placing Order..." : "Place Order"}
</button>
```

- [ ] **Step 3: Manually test checkout**

1. Add items to cart
2. Navigate to `/payment`
3. If no saved addresses: form appears, fill it, tick "Save address", place order
4. Confirm redirect to `/orderplaced?order_id=ZW-...`
5. On next checkout: saved address appears as a selectable option

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/payment/payment.tsx
git commit -m "feat(payment): wire address fetch, COD checkout, and order redirect"
```

---

## Task 13: Wire `orderplaced.tsx` to API

**Files:**
- Modify: `frontend/src/components/orderplaced/orderplaced.tsx`

- [ ] **Step 1: Add API fetch using `order_id` from URL param**

In `frontend/src/components/orderplaced/orderplaced.tsx`, add imports and state at the top of the component:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";

type OrderDetail = {
  order_id: string;
  product_name: string;
  pack_name: string;
  quantity: number;
  total_amount: string;
  delivery_charge: string;
  status: string;
  payment_method: string;
  created_at: string;
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
};

export default function OrderPlaced() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    api.get(`/orders/${orderId}/`)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#6b7280]">Order not found.</p>
        <Link href="/shop" className="rounded-lg bg-[#0a4833] px-6 py-2 text-sm text-white">
          Back to Shop
        </Link>
      </div>
    );
  }
  // Keep existing JSX structure but replace hardcoded values:
  // order.order_id, order.product_name, order.total_amount, order.status, order.full_name, etc.
}
```

Replace every hardcoded value in the existing JSX with the corresponding field from `order`.

- [ ] **Step 2: Manually test order placed page**

1. Complete a checkout — you are redirected to `/orderplaced?order_id=ZW-2025-XXX`
2. Confirm the real order ID, product name, and total appear
3. Confirm "Continue Shopping" button links to `/shop`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/orderplaced/orderplaced.tsx
git commit -m "feat(orderplaced): fetch order detail from API using order_id param"
```

---

## Task 14: Wire `trackorder.tsx` to API

**Files:**
- Modify: `frontend/src/components/trackorder/trackorder.tsx`

- [ ] **Step 1: Replace hardcoded data with orders list**

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";

type Order = {
  order_id: string;
  product_name: string;
  pack_name: string;
  quantity: number;
  total_amount: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function TrackOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data) ? data : (data.results ?? []));
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-[#0A4833]">No orders yet</p>
        <Link href="/shop" className="rounded-lg bg-[#0a4833] px-6 py-2 text-sm text-white">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#0a4833]">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#111827]">{order.product_name}</p>
                <p className="text-xs text-[#6b7280]">
                  {order.pack_name} · Qty {order.quantity}
                </p>
                <p className="mt-1 text-xs text-[#6b7280]">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#0a4833]">₹{order.total_amount}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>

            {/* Status timeline */}
            <div className="mt-4 flex items-center gap-1">
              {STATUS_STEPS.map((step, i) => {
                const currentIndex = STATUS_STEPS.indexOf(order.status);
                const done = i <= currentIndex && order.status !== "cancelled";
                return (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <div
                      className={`h-2 w-full rounded-full ${done ? "bg-[#0a4833]" : "bg-gray-200"}`}
                    />
                    <span className="mt-1 text-[8px] capitalize text-[#9ca3af]">{step}</span>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-right text-xs font-semibold uppercase text-[#6b7280]">
              Order # {order.order_id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manually verify track order page**

1. Log in as guest with at least one placed order
2. Navigate to `/trackorder`
3. Confirm orders list loads from API with real order IDs, products, amounts, and status badges
4. Confirm status timeline fills correctly for each order status

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/trackorder/trackorder.tsx
git commit -m "feat(trackorder): fetch real orders from API with status timeline"
```

---

## Task 15: Wire `guestprofile.tsx` to API + add Upgrade CTA

**Files:**
- Modify: `frontend/src/components/guestprofile/guestprofile.tsx`

- [ ] **Step 1: Add API fetching and upgrade CTA**

Replace all mock data at the top of `frontend/src/components/guestprofile/guestprofile.tsx` with:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";

type UserProfile = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  photo: string | null;
  user_type: string;
};

type RecentOrder = {
  order_id: string;
  product_name: string;
  total_amount: string;
  status: string;
  created_at: string;
};

type SavedAddress = {
  id: number;
  label: string;
  address_line: string;
  city: string;
  postal_code: string;
};

export default function GuestProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/account/me/"),
      api.get("/orders/"),
      api.get("/community/addresses/"),
    ])
      .then(([meRes, ordersRes, addrRes]) => {
        setProfile(meRes.data);
        const ordersData = ordersRes.data;
        const list = Array.isArray(ordersData) ? ordersData : (ordersData.results ?? []);
        setOrders(list.slice(0, 3));
        setAddresses(addrRes.data ?? []);
      })
      .catch(() => toast.error("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      await api.patch("/account/upgrade/");
      toast.success("Welcome to the community!");
      router.replace("/communityDashBorde");
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setUpgrading(false);
      setShowUpgradeModal(false);
    }
  }
```

- [ ] **Step 2: Add upgrade banner and modal to JSX**

Inside the JSX (after the profile header section), add the upgrade banner:

```tsx
{/* Upgrade Banner */}
<div className="mx-4 mb-4 rounded-xl border border-[#9f8151]/30 bg-[#fdfaf3] p-4 flex items-center justify-between gap-4">
  <div>
    <p className="text-sm font-bold text-[#9f8151]">Unlock full community access</p>
    <p className="text-xs text-[#9f8151]/70 mt-0.5">
      Recipes, consultations, events and more
    </p>
  </div>
  <button
    onClick={() => setShowUpgradeModal(true)}
    className="shrink-0 rounded-lg bg-[#9f8151] px-4 py-2 text-xs font-bold text-white hover:bg-[#8a6e42] transition"
  >
    Become a Member
  </button>
</div>

{/* Upgrade Confirmation Modal */}
{showUpgradeModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-bold text-[#0a4833] mb-2">Become a Community Member</h2>
      <p className="text-sm text-[#6b7280] mb-6">
        This unlocks the community dashboard, recipes, consultations and events. Ready?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-[#374151] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className="flex-1 rounded-lg bg-[#0a4833] py-2 text-sm font-bold text-white hover:bg-[#0c5a40] disabled:opacity-60"
        >
          {upgrading ? "Upgrading..." : "Confirm Upgrade"}
        </button>
      </div>
    </div>
  </div>
)}
```

Replace all mock data references in the rest of the JSX:
- User name / email / phone → `profile?.full_name`, `profile?.email`, `profile?.phone`
- Recent orders section → map over `orders` array
- Saved addresses section → map over `addresses` array
- Add a loading state guard at the top of the JSX:

```tsx
if (loading) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
      Loading profile...
    </div>
  );
}
```

- [ ] **Step 3: Manually test profile + upgrade**

1. Log in as a guest and go to `/guestprofile`
2. Confirm real name, email, phone load from API
3. Confirm recent orders list (last 3) loads from API
4. Confirm saved addresses appear (if any)
5. Click "Become a Member" → confirm modal appears
6. Confirm upgrade → redirects to `/communityDashBorde`
7. After upgrade, confirm `/communityDashBorde` renders (no longer redirected to `/shop`)

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/guestprofile/guestprofile.tsx
git commit -m "feat(guestprofile): wire real API data and add upgrade-to-member flow"
```

---

## Final Verification

- [ ] **Run all backend tests**

```bash
cd backend/zewadi
python manage.py test accounts communityuser -v 2
```
Expected: All tests pass

- [ ] **Run frontend build**

```bash
cd frontend
npm run build
```
Expected: Build succeeds with no TypeScript errors

- [ ] **Full end-to-end smoke test**

1. Register as Guest → log in → lands on `/shop` ✓
2. Register as Member → log in → lands on `/communityDashBorde` ✓
3. Guest navigates to `/communityDashBorde` → redirected to `/shop` ✓
4. Add product to cart → view cart → quantities update → remove item ✓
5. Proceed to checkout → COD → order placed → order ID shown ✓
6. Track order at `/trackorder` → real orders visible with status ✓
7. Guest profile at `/guestprofile` → real data → upgrade modal → redirect to dashboard ✓
8. Member calls `GET /api/community/dashboard/summary/` → 200 ✓
9. Guest calls `GET /api/community/dashboard/summary/` → 403 ✓

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete guest user e-commerce flow end-to-end"
```
