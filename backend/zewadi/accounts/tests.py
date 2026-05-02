from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


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

        response = self.client.post("/api/account/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["role"], "COMMUNITY_USER")
