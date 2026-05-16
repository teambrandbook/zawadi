from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch, MagicMock
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, OTP
from communityuser.models import CommunityUser, UserType
from consultant.models import Consultant
from supperadmin.models import Role, RolePermission


class AccountMeAPITests(APITestCase):
    def test_me_requires_authentication(self):
        response = self.client.get("/api/account/me/")
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_me_returns_authenticated_user(self):
        user = User.objects.create_user(
            email="community@example.com",
            password="Pass@1234",
            user_name="community",
            full_name="Community User",
            phone="+10000000001",
            role="COMMUNITY_USER",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/account/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "community@example.com")
        self.assertEqual(response.data["role"], "community_user")
        self.assertEqual(response.data["full_name"], "Community User")

    def test_me_accepts_access_token_cookie(self):
        user = User.objects.create_user(
            email="cookie-auth@example.com",
            password="Pass@1234",
            user_name="cookieauth",
            full_name="Cookie Auth",
            phone="+10000000007",
            role="COMMUNITY_USER",
        )
        refresh = RefreshToken.for_user(user)
        self.client.cookies["access_token"] = str(refresh.access_token)

        response = self.client.get("/api/account/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "cookie-auth@example.com")


class RegisterSecurityTests(APITestCase):
    def test_public_register_forces_community_user_role(self):
        payload = {
            "email": "new-user@example.com",
            "password": "Pass@1234",
            "full_name": "New User",
            "user_name": "newuser",
            "phone": "+10000000002",
            "date_of_birth": "1998-01-01",
            "gender": "MALE",
            "role": "ADMIN",
        }

        with patch("accounts.views.send_otp_email"):
            response = self.client.post("/api/account/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["requires_otp"])
        # Confirm the DB user has the forced community_user role
        from accounts.models import User as UserModel
        user = UserModel.objects.get(email="new-user@example.com")
        self.assertEqual(user.role, "COMMUNITY_USER")

    def test_admin_register_creates_active_user_without_otp(self):
        admin = User.objects.create_user(
            email="admin@example.com",
            password="Pass@1234",
            user_name="admin",
            full_name="Admin User",
            phone="+10000000000",
            role="ADMIN",
            is_staff=True,
        )
        self.client.force_authenticate(user=admin)

        payload = {
            "email": "admin-created@example.com",
            "password": "Pass@1234",
            "full_name": "Admin Created",
            "user_name": "admincreated",
            "phone": "+10000000005",
            "date_of_birth": "1998-01-01",
            "gender": "MALE",
            "role": "COMMUNITY_USER",
            "user_type": UserType.MEMBER,
            "is_active": True,
        }

        with patch("accounts.views.send_otp_email") as send_otp_email:
            response = self.client.post("/api/account/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["requires_otp"])
        send_otp_email.assert_not_called()
        user = User.objects.get(email="admin-created@example.com")
        self.assertTrue(user.is_active)
        self.assertEqual(user.communityuser.user_type, UserType.MEMBER)

    def test_internal_staff_with_user_create_permission_registers_managed_user(self):
        role = Role.objects.create(role_name="User Manager")
        RolePermission.objects.create(role=role, module="users", can_create=True)
        staff = User.objects.create_user(
            email="staff-user-manager@example.com",
            password="Pass@1234",
            user_name="staffmanager",
            full_name="Staff Manager",
            phone="+10000000008",
            role="INTERNAL_STAFF",
            role_obj=role,
        )
        self.client.force_authenticate(user=staff)

        payload = {
            "email": "staff-created-consultant@example.com",
            "password": "Pass@1234",
            "full_name": "Staff Created Consultant",
            "user_name": "staffcreatedconsultant",
            "phone": "+10000000009",
            "date_of_birth": "1990-01-01",
            "gender": "FEMALE",
            "role": "CONSULTANT",
            "years_of_experience": 3,
            "qualification": "Nutrition Diploma",
            "languages_spoken": "English",
            "experience_areas": "Wellness",
            "session_type": "video",
            "consultation_fee": 50,
            "session_duration": 30,
            "is_active": True,
        }

        with patch("accounts.views.send_otp_email") as send_otp_email:
            response = self.client.post("/api/account/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["requires_otp"])
        send_otp_email.assert_not_called()
        user = User.objects.get(email="staff-created-consultant@example.com")
        self.assertEqual(user.role, "CONSULTANT")
        self.assertTrue(user.is_active)


class LoginAPITests(APITestCase):
    def test_login_accepts_email_with_different_case_after_verification(self):
        User.objects.create_user(
            email="MixedCase@Example.com",
            password="Pass@1234",
            full_name="Mixed Case",
            user_name="mixedcase",
            phone="+10000000006",
            role="COMMUNITY_USER",
            is_active=True,
        )

        response = self.client.post(
            "/api/account/login/",
            {"email": "mixedcase@example.com", "password": "Pass@1234"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["email"], "MixedCase@example.com")


class MeSerializerTest(APITestCase):
    def setUp(self):
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

    def test_me_returns_null_user_type_for_non_community_user(self):
        admin = User.objects.create_user(
            email="admin@test.com",
            password="pass1234",
            full_name="Admin",
            user_name="adminuser",
            phone="9876543210",
            role="ADMIN",
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get("/api/account/me/")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.data["user_type"])


class UpgradeAPIViewTest(APITestCase):
    def setUp(self):
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

    def test_already_member_cannot_upgrade_again(self):
        self.user.communityuser.user_type = UserType.MEMBER
        self.user.communityuser.save()
        self.client.force_authenticate(user=self.user)
        response = self.client.patch("/api/account/upgrade/")
        self.assertEqual(response.status_code, 400)


class MePatchTest(APITestCase):
    def setUp(self):
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


class CreateNutritionistAPITests(APITestCase):
    def test_internal_staff_with_nutritionist_create_permission_can_create_nutritionist(self):
        role = Role.objects.create(role_name="Nutritionist Manager")
        RolePermission.objects.create(
            role=role,
            module="nutritionists",
            can_create=True,
        )
        staff = User.objects.create_user(
            email="staff@example.com",
            password="Pass@1234",
            user_name="staff",
            full_name="Staff User",
            phone="+10000000003",
            role="INTERNAL_STAFF",
            role_obj=role,
        )
        self.client.force_authenticate(user=staff)

        payload = {
            "email": "nutritionist@example.com",
            "password": "Pass@1234",
            "full_name": "Nutritionist User",
            "user_name": "nutritionist",
            "phone": "+10000000004",
            "date_of_birth": "1990-01-01",
            "gender": "FEMALE",
            "years_of_experience": 5,
            "qualification": "MSc Nutrition",
            "certifications": "CNS",
            "short_bio": "Experienced nutritionist",
            "languages_spoken": "English",
            "experience_areas": "Wellness",
            "session_type": "video",
            "consultation_fee": 75,
            "session_duration": 30,
        }

        response = self.client.post("/api/account/nutritionists/create/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_user = User.objects.get(email="nutritionist@example.com")
        self.assertEqual(created_user.role, "CONSULTANT")
        self.assertTrue(Consultant.objects.filter(user=created_user).exists())


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


class GoogleCallbackRedirectTest(TestCase):
    def _make_user(self, role, user_type=None):
        email = f"test_{role.lower()}@test.com"
        user = User.objects.create_user(
            email=email, password="pw", role=role, is_active=True
        )
        if role == "COMMUNITY_USER":
            from communityuser.models import CommunityUser, UserType
            CommunityUser.objects.create(
                user=user,
                user_type=user_type or UserType.GUEST,
            )
        return user

    def _mock_google_exchange(self, mock_post, mock_get, email, name="Test User"):
        mock_token_resp = MagicMock()
        mock_token_resp.json.return_value = {"access_token": "fake-token"}
        mock_post.return_value = mock_token_resp

        mock_user_resp = MagicMock()
        mock_user_resp.json.return_value = {"email": email, "name": name}
        mock_get.return_value = mock_user_resp

    @patch("accounts.views.google_credentials_configured", return_value=True)
    @patch("accounts.views.requests.get")
    @patch("accounts.views.requests.post")
    def test_admin_redirects_to_admindashboard(self, mock_post, mock_get, mock_creds):
        self._make_user("ADMIN")
        self._mock_google_exchange(mock_post, mock_get, "test_admin@test.com")
        res = self.client.get(
            reverse("google-callback"),
            {"code": "fake-code"},
            HTTP_HOST="localhost",
        )
        self.assertIn("/admindashboard", res["Location"])

    @patch("accounts.views.google_credentials_configured", return_value=True)
    @patch("accounts.views.requests.get")
    @patch("accounts.views.requests.post")
    def test_guest_redirects_to_products(self, mock_post, mock_get, mock_creds):
        from communityuser.models import UserType
        self._make_user("COMMUNITY_USER", UserType.GUEST)
        self._mock_google_exchange(mock_post, mock_get, "test_community_user@test.com")
        res = self.client.get(
            reverse("google-callback"),
            {"code": "fake-code"},
            HTTP_HOST="localhost",
        )
        self.assertIn("/products", res["Location"])

    @patch("accounts.views.google_credentials_configured", return_value=True)
    @patch("accounts.views.requests.get")
    @patch("accounts.views.requests.post")
    def test_member_redirects_to_communityDashBoard(self, mock_post, mock_get, mock_creds):
        from communityuser.models import UserType
        self._make_user("COMMUNITY_USER", UserType.MEMBER)
        self._mock_google_exchange(mock_post, mock_get, "test_community_user@test.com")
        res = self.client.get(
            reverse("google-callback"),
            {"code": "fake-code"},
            HTTP_HOST="localhost",
        )
        self.assertIn("/communityDashBoard", res["Location"])
