# Group 2 — Auth Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add email OTP verification on register, OTP-based password reset, and logout-all-sessions. Users cannot access the app until they verify their email.

**Architecture:** New `OTP` model in `accounts` app stores 6-digit codes with expiry. `RegisterAPIView` creates users as `is_active=False` and sends an OTP. The existing `/otp` page is wired to the new verify endpoint. Password reset uses the same OTP mechanism with a short-lived reset token. All email sending goes through a new `accounts/email.py` service using Django SMTP.

**Tech Stack:** Django 6, DRF, Next.js 16 (TypeScript), existing OtpComponent

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/accounts/models.py` |
| Create | `backend/zewadi/accounts/email.py` |
| Modify | `backend/zewadi/accounts/serializers.py` |
| Modify | `backend/zewadi/accounts/views.py` |
| Modify | `backend/zewadi/accounts/urls.py` |
| Modify | `frontend/src/app/otp/page.tsx` |
| Create | `frontend/src/app/forgot-password/page.tsx` |

---

### Task 1: Add OTP model

**Files:**
- Modify: `backend/zewadi/accounts/models.py`

- [ ] **Step 1: Add OTP model to accounts/models.py**

At the bottom of `backend/zewadi/accounts/models.py`, add:

```python
import uuid as _uuid
from datetime import timedelta


class OTP(models.Model):
    PURPOSE_EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    PURPOSE_PASSWORD_RESET = "PASSWORD_RESET"
    PURPOSE_CHOICES = [
        (PURPOSE_EMAIL_VERIFICATION, "Email Verification"),
        (PURPOSE_PASSWORD_RESET, "Password Reset"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    reset_token = models.UUIDField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["user", "purpose", "is_used"])]

    @classmethod
    def generate(cls, user, purpose):
        import random
        cls.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
        code = f"{random.randint(100000, 999999)}"
        return cls.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

    @classmethod
    def verify(cls, user, code, purpose):
        try:
            otp = cls.objects.get(
                user=user,
                code=code,
                purpose=purpose,
                is_used=False,
                expires_at__gt=timezone.now(),
            )
        except cls.DoesNotExist:
            return None
        otp.is_used = True
        if purpose == cls.PURPOSE_PASSWORD_RESET:
            otp.reset_token = _uuid.uuid4()
        otp.save(update_fields=["is_used", "reset_token"])
        return otp
```

- [ ] **Step 2: Create and run migration**

```bash
cd backend/zewadi
python manage.py makemigrations accounts --name add_otp_model
python manage.py migrate
```

Expected: migration runs without error; `accounts_otp` table created.

- [ ] **Step 3: Write a quick test**

In `backend/zewadi/accounts/tests.py` (create the file if it doesn't exist), add:

```python
from django.test import TestCase
from django.utils import timezone
from accounts.models import User, OTP


class OTPModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="pass1234",
            full_name="Test",
            user_name="test_1",
            phone="",
        )

    def test_generate_creates_otp(self):
        otp = OTP.generate(self.user, OTP.PURPOSE_EMAIL_VERIFICATION)
        self.assertEqual(len(otp.code), 6)
        self.assertFalse(otp.is_used)
        self.assertGreater(otp.expires_at, timezone.now())

    def test_generate_invalidates_previous(self):
        first = OTP.generate(self.user, OTP.PURPOSE_EMAIL_VERIFICATION)
        second = OTP.generate(self.user, OTP.PURPOSE_EMAIL_VERIFICATION)
        first.refresh_from_db()
        self.assertTrue(first.is_used)
        self.assertFalse(second.is_used)

    def test_verify_returns_otp_on_correct_code(self):
        otp = OTP.generate(self.user, OTP.PURPOSE_EMAIL_VERIFICATION)
        result = OTP.verify(self.user, otp.code, OTP.PURPOSE_EMAIL_VERIFICATION)
        self.assertIsNotNone(result)
        self.assertTrue(result.is_used)

    def test_verify_returns_none_on_wrong_code(self):
        OTP.generate(self.user, OTP.PURPOSE_EMAIL_VERIFICATION)
        result = OTP.verify(self.user, "000000", OTP.PURPOSE_EMAIL_VERIFICATION)
        self.assertIsNone(result)

    def test_verify_sets_reset_token_for_password_reset(self):
        otp = OTP.generate(self.user, OTP.PURPOSE_PASSWORD_RESET)
        result = OTP.verify(self.user, otp.code, OTP.PURPOSE_PASSWORD_RESET)
        self.assertIsNotNone(result.reset_token)
```

- [ ] **Step 4: Run the tests**

```bash
cd backend/zewadi
python manage.py test accounts.tests.OTPModelTest -v 2
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/zewadi/accounts/models.py backend/zewadi/accounts/migrations/ backend/zewadi/accounts/tests.py
git commit -m "feat: add OTP model with generate/verify class methods"
```

---

### Task 2: Create email service

**Files:**
- Create: `backend/zewadi/accounts/email.py`

- [ ] **Step 1: Create accounts/email.py**

Create `backend/zewadi/accounts/email.py` with the following content:

```python
from django.core.mail import send_mail
from django.conf import settings


def send_otp_email(user_email: str, code: str, purpose: str) -> None:
    if purpose == "EMAIL_VERIFICATION":
        subject = "Verify your Zawadi account"
        body = (
            f"Your Zawadi verification code is: {code}\n\n"
            f"This code expires in 10 minutes.\n\n"
            f"If you did not create a Zawadi account, you can ignore this email."
        )
    else:
        subject = "Your Zawadi password reset code"
        body = (
            f"Your Zawadi password reset code is: {code}\n\n"
            f"This code expires in 10 minutes.\n\n"
            f"If you did not request a password reset, you can ignore this email."
        )

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception as exc:
        import logging
        logging.getLogger("accounts.email").error(
            "Failed to send OTP email to %s: %s", user_email, exc
        )
```

- [ ] **Step 2: Commit**

```bash
git add backend/zewadi/accounts/email.py
git commit -m "feat: add OTP email service using Django SMTP backend"
```

---

### Task 3: Make registration create inactive users

**Files:**
- Modify: `backend/zewadi/accounts/serializers.py`
- Modify: `backend/zewadi/accounts/views.py`

- [ ] **Step 1: Set is_active=False in RegisterSerializer.create()**

In `backend/zewadi/accounts/serializers.py`, in the `create()` method, find the `User.objects.create_user(...)` call and add `is_active=False`:

```python
        user = User.objects.create_user(
            email=validated_data.get("email"),
            password=password,
            full_name=validated_data.get("full_name"),
            user_name=validated_data.get("user_name"),
            phone=validated_data.get("phone"),
            date_of_birth=validated_data.get("date_of_birth"),
            gender=validated_data.get("gender"),
            location=validated_data.get("location"),
            photo=validated_data.get("photo"),
            role=validated_data.get("role"),
            role_obj=validated_data.get("role_obj"),
            is_active=False,
        )
```

- [ ] **Step 2: Update RegisterAPIView to send OTP after registration**

In `backend/zewadi/accounts/views.py`, replace the `RegisterAPIView.post()` method:

```python
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]

    def post(self, request):
        payload = request.data.copy()
        if not request.user.is_authenticated or request.user.role != "ADMIN":
            payload["role"] = "COMMUNITY_USER"
            payload.pop("role_obj", None)

        serializer = RegisterSerializer(data=payload)
        if serializer.is_valid():
            user = serializer.save()
            otp = OTP.generate(user, OTP.PURPOSE_EMAIL_VERIFICATION)
            send_otp_email(user.email, otp.code, OTP.PURPOSE_EMAIL_VERIFICATION)
            return Response(
                {
                    "message": "Registration successful. Check your email for a verification code.",
                    "user_id": user.user_id,
                    "email": user.email,
                    "requires_otp": True,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

- [ ] **Step 3: Update CreateNutritionistAPIView to activate immediately**

Admin-created consultants should be active immediately. In `CreateNutritionistAPIView.post()`, after `user = serializer.save()`, add:

```python
            user = serializer.save()
            # Admin-created users are active immediately — no OTP needed
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response(
```

- [ ] **Step 4: Add imports to views.py**

At the top of `backend/zewadi/accounts/views.py`, add these two imports after the existing imports:

```python
from .models import OTP, User
from .email import send_otp_email
```

Replace the existing `from .models import User` line with the above (it already exists, just add `OTP`).

- [ ] **Step 5: Update LoginSerializer to handle inactive users clearly**

In `backend/zewadi/accounts/serializers.py`, replace `LoginSerializer.validate()`:

```python
    def validate(self, data):
        try:
            user_obj = User.objects.get(email__iexact=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user_obj.is_active:
            raise serializers.ValidationError(
                "Please verify your email before logging in. Check your inbox for a verification code."
            )

        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)
        return {
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role.lower(),
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
```

- [ ] **Step 6: Run tests**

```bash
cd backend/zewadi
python manage.py test accounts -v 2
```

Expected: all existing tests still pass.

- [ ] **Step 7: Commit**

```bash
git add backend/zewadi/accounts/serializers.py backend/zewadi/accounts/views.py
git commit -m "feat: register users as inactive, send OTP verification email on signup"
```

---

### Task 4: Add OTP verify and resend endpoints

**Files:**
- Modify: `backend/zewadi/accounts/views.py`
- Modify: `backend/zewadi/accounts/urls.py`

- [ ] **Step 1: Add OTPVerifyAPIView to views.py**

In `backend/zewadi/accounts/views.py`, add this class after `UpgradeAPIView`:

```python
class OTPVerifyAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()
        purpose = request.data.get("purpose", "")

        if not email or not code or not purpose:
            return Response(
                {"error": "email, code, and purpose are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)

        otp = OTP.verify(user, code, purpose)
        if otp is None:
            return Response(
                {"error": "Invalid or expired code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if purpose == OTP.PURPOSE_EMAIL_VERIFICATION:
            user.is_active = True
            user.save(update_fields=["is_active"])
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            response = Response(
                {
                    "message": "Email verified. You are now logged in.",
                    "data": {
                        "user_id": user.user_id,
                        "email": user.email,
                        "role": user.role.lower(),
                    },
                    "access": access,
                },
                status=status.HTTP_200_OK,
            )
            set_auth_cookies(response, refresh, access)
            return response

        # PURPOSE_PASSWORD_RESET — return the reset token for step 3
        return Response(
            {
                "message": "Code verified.",
                "reset_token": str(otp.reset_token),
            },
            status=status.HTTP_200_OK,
        )
```

- [ ] **Step 2: Add OTPResendAPIView to views.py**

Add this class immediately after `OTPVerifyAPIView`:

```python
class OTPResendAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        purpose = request.data.get("purpose", "")

        if not email or not purpose:
            return Response(
                {"error": "email and purpose are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Don't reveal whether the email exists
            return Response({"message": "If that email is registered, a new code has been sent."}, status=status.HTTP_200_OK)

        otp = OTP.generate(user, purpose)
        send_otp_email(user.email, otp.code, purpose)
        return Response({"message": "A new code has been sent to your email."}, status=status.HTTP_200_OK)
```

- [ ] **Step 3: Update accounts/urls.py to add OTP routes**

Replace the full contents of `backend/zewadi/accounts/urls.py`:

```python
from django.urls import path

from .views import (
    CreateNutritionistAPIView,
    GoogleCallbackAPIView,
    GoogleLoginAPIView,
    LoginAPIView,
    LogoutAPIView,
    LogoutAllAPIView,
    MeAPIView,
    OTPResendAPIView,
    OTPVerifyAPIView,
    PasswordResetConfirmAPIView,
    PasswordResetRequestAPIView,
    PasswordResetVerifyAPIView,
    RefreshAPIView,
    RegisterAPIView,
    UpgradeAPIView,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("nutritionists/create/", CreateNutritionistAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("refresh/", RefreshAPIView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("logout-all/", LogoutAllAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
    path("upgrade/", UpgradeAPIView.as_view()),
    path("otp/verify/", OTPVerifyAPIView.as_view()),
    path("otp/resend/", OTPResendAPIView.as_view()),
    path("password-reset/request/", PasswordResetRequestAPIView.as_view()),
    path("password-reset/verify/", PasswordResetVerifyAPIView.as_view()),
    path("password-reset/confirm/", PasswordResetConfirmAPIView.as_view()),
    path("google-login/", GoogleLoginAPIView.as_view()),
    path("google/login/", GoogleLoginAPIView.as_view()),
    path("google/callback/", GoogleCallbackAPIView.as_view()),
]
```

- [ ] **Step 4: Commit (partial — views for remaining tasks still pending)**

```bash
git add backend/zewadi/accounts/views.py backend/zewadi/accounts/urls.py
git commit -m "feat: add OTP verify and resend endpoints"
```

---

### Task 5: Add password reset endpoints

**Files:**
- Modify: `backend/zewadi/accounts/views.py`

- [ ] **Step 1: Add PasswordResetRequestAPIView**

In `backend/zewadi/accounts/views.py`, add after `OTPResendAPIView`:

```python
class PasswordResetRequestAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"error": "email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If that email is registered, a reset code has been sent."},
                status=status.HTTP_200_OK,
            )

        otp = OTP.generate(user, OTP.PURPOSE_PASSWORD_RESET)
        send_otp_email(user.email, otp.code, OTP.PURPOSE_PASSWORD_RESET)
        return Response(
            {"message": "A reset code has been sent to your email."},
            status=status.HTTP_200_OK,
        )
```

- [ ] **Step 2: Add PasswordResetVerifyAPIView**

Add after `PasswordResetRequestAPIView`:

```python
class PasswordResetVerifyAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()

        if not email or not code:
            return Response({"error": "email and code are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)

        otp = OTP.verify(user, code, OTP.PURPOSE_PASSWORD_RESET)
        if otp is None:
            return Response({"error": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "Code verified.", "reset_token": str(otp.reset_token)},
            status=status.HTTP_200_OK,
        )
```

- [ ] **Step 3: Add PasswordResetConfirmAPIView**

Add after `PasswordResetVerifyAPIView`:

```python
class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        import uuid as _uuid
        from datetime import timedelta

        reset_token = request.data.get("reset_token", "").strip()
        new_password = request.data.get("new_password", "")

        if not reset_token or not new_password:
            return Response(
                {"error": "reset_token and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token_uuid = _uuid.UUID(reset_token)
        except ValueError:
            return Response({"error": "Invalid reset token."}, status=status.HTTP_400_BAD_REQUEST)

        # Reset token is valid for 15 minutes from OTP verification time
        cutoff = timezone.now() - timedelta(minutes=15)
        try:
            otp = OTP.objects.get(
                reset_token=token_uuid,
                purpose=OTP.PURPOSE_PASSWORD_RESET,
                is_used=True,
                created_at__gte=cutoff,
            )
        except OTP.DoesNotExist:
            return Response({"error": "Reset token is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

        user = otp.user
        user.set_password(new_password)
        user.save(update_fields=["password"])
        # Invalidate the token by clearing it
        otp.reset_token = None
        otp.save(update_fields=["reset_token"])

        return Response({"message": "Password reset successful. You can now log in."}, status=status.HTTP_200_OK)
```

- [ ] **Step 4: Add timezone import to views.py**

At the top of `backend/zewadi/accounts/views.py`, add:
```python
from django.utils import timezone
```

- [ ] **Step 5: Run tests**

```bash
cd backend/zewadi
python manage.py test accounts -v 2
```

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/accounts/views.py
git commit -m "feat: add password reset request/verify/confirm endpoints using OTP"
```

---

### Task 6: Add LogoutAllAPIView

**Files:**
- Modify: `backend/zewadi/accounts/views.py`

- [ ] **Step 1: Add LogoutAllAPIView**

In `backend/zewadi/accounts/views.py`, after `LogoutAPIView`, add:

```python
class LogoutAllAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
        tokens = OutstandingToken.objects.filter(user=request.user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        response = Response({"message": "All sessions logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
```

- [ ] **Step 2: Commit**

```bash
git add backend/zewadi/accounts/views.py
git commit -m "feat: add logout-all-sessions endpoint"
```

---

### Task 7: Wire OTP page on the frontend

The OTP component already exists. This task connects it to the backend.

**Files:**
- Modify: `frontend/src/app/otp/page.tsx`

- [ ] **Step 1: Replace otp/page.tsx with wired version**

Replace the full contents of `frontend/src/app/otp/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import OtpComponent from "@/components/shared/OtpComponent";
import api from "@/services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/userSlice";
import type { AppDispatch } from "@/redux/store";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const email = searchParams.get("email") ?? "";
  const purpose = searchParams.get("purpose") ?? "EMAIL_VERIFICATION";

  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  const handleVerify = async (code: string) => {
    setError("");
    try {
      const { data } = await api.post("/account/otp/verify/", { email, code, purpose });

      if (purpose === "EMAIL_VERIFICATION") {
        dispatch(setCredentials({
          userId: data.data.user_id,
          role: data.data.role,
          email: data.data.email,
        }));
        router.replace("/communityDashBoard");
      } else {
        // PASSWORD_RESET — pass reset_token to confirm step
        router.replace(`/forgot-password?step=confirm&reset_token=${data.reset_token}&email=${encodeURIComponent(email)}`);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? "Invalid or expired code. Please try again.");
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await api.post("/account/otp/resend/", { email, purpose });
    } catch {
      setError("Could not resend code. Please wait a moment and try again.");
    }
  };

  return (
    <div>
      <Navbar />
      {error && (
        <p className="text-center text-red-600 text-sm mt-4">{error}</p>
      )}
      <OtpComponent
        destination={maskEmail(email)}
        onVerify={handleVerify}
        onResend={handleResend}
        onBackToLogin={() => router.replace("/login")}
        onUseAnotherMethod={() => router.replace("/register")}
        onContactSupport={() => window.open("mailto:support@zawadi.com")}
      />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Update RegisterAPIView frontend call site**

Find wherever the frontend calls `POST /api/account/register/` and update the success handler to redirect to the OTP page instead of the dashboard. Search for the registration call:

```bash
grep -r "account/register" frontend/src/ --include="*.tsx" --include="*.ts" -l
```

For each file found, update the success handler. The response now returns `{ requires_otp: true, email: "..." }`. Replace any post-register redirect with:

```ts
// After successful register:
if (data.requires_otp) {
  router.push(`/otp?email=${encodeURIComponent(data.email)}&purpose=EMAIL_VERIFICATION`);
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/otp/page.tsx
git commit -m "feat: wire OTP page to backend verify/resend endpoints"
```

---

### Task 8: Create forgot-password page

**Files:**
- Create: `frontend/src/app/forgot-password/page.tsx`

- [ ] **Step 1: Create forgot-password/page.tsx**

Create `frontend/src/app/forgot-password/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import api from "@/services/api";

type Step = "request" | "otp" | "confirm";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = (searchParams.get("step") as Step) ?? "request";
  const initialEmail = searchParams.get("email") ?? "";
  const initialResetToken = searchParams.get("reset_token") ?? "";

  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/account/password-reset/request/", { email });
      setStep("otp");
    } catch {
      setError("Could not send reset code. Check the email address and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/account/password-reset/verify/", { email, code });
      setResetToken(data.reset_token);
      setStep("confirm");
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/account/password-reset/confirm/", { reset_token: resetToken, new_password: newPassword });
      router.replace("/login?reset=success");
    } catch {
      setError("Could not reset password. The reset link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6">
          {step === "request" && (
            <form onSubmit={handleRequest} className="space-y-4">
              <h1 className="text-2xl font-semibold">Forgot password</h1>
              <p className="text-sm text-gray-600">Enter your email and we will send you a reset code.</p>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-800 text-white rounded py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Sending..." : "Send reset code"}
              </button>
              <p className="text-center text-sm">
                <a href="/login" className="text-green-800 hover:underline">Back to login</a>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h1 className="text-2xl font-semibold">Enter reset code</h1>
              <p className="text-sm text-gray-600">A 6-digit code was sent to {email}.</p>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <input
                type="text"
                required
                maxLength={6}
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full border rounded px-3 py-2 text-sm text-center tracking-widest text-lg"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-800 text-white rounded py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Verifying..." : "Verify code"}
              </button>
              <button type="button" onClick={() => setStep("request")} className="w-full text-sm text-gray-500 hover:underline">
                Use a different email
              </button>
            </form>
          )}

          {step === "confirm" && (
            <form onSubmit={handleConfirm} className="space-y-4">
              <h1 className="text-2xl font-semibold">Set new password</h1>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <input
                type="password"
                required
                minLength={8}
                placeholder="New password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-800 text-white rounded py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Saving..." : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Add "Forgot password?" link to login component**

Search for the login form component:
```bash
grep -r "password" frontend/src/components/shared/LoginComponent.tsx | head -5
```

Find where the password field ends or the submit button is. Add a "Forgot password?" link just below the password input or above the submit button:

```tsx
<a href="/forgot-password" className="text-sm text-green-800 hover:underline block text-right">
  Forgot password?
</a>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/forgot-password/ frontend/src/components/shared/LoginComponent.tsx
git commit -m "feat: add forgot-password page with 3-step OTP reset flow"
```

---

## Full Verification

```bash
# Backend
cd backend/zewadi
python manage.py test accounts -v 2

# Manual flow test:
# 1. POST /api/account/register/ → check email inbox for OTP
# 2. POST /api/account/otp/verify/ with code → should return JWT + log in
# 3. POST /api/account/password-reset/request/ → check inbox
# 4. POST /api/account/password-reset/verify/ → returns reset_token
# 5. POST /api/account/password-reset/confirm/ → returns success

# Frontend
cd frontend
npm run build
npm run dev
# Visit http://localhost:3000/register → complete signup → redirects to /otp
# Visit http://localhost:3000/forgot-password → complete flow → redirects to /login
```
