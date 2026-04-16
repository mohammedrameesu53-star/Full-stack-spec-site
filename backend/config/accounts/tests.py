from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import OTP


class AccountsTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

    # -----------------------------------
    # ✅ REGISTER TEST
    # -----------------------------------
    def test_register_user(self):
        response = self.client.post("/api/accounts/register/", {
            "username": "testuser",
            "email": "test@example.com",
            "password": "1234",
            "confirm_password": "1234"
        })

        print("REGISTER:", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    # -----------------------------------
    # ✅ OTP VERIFICATION TEST
    # -----------------------------------
    def test_verify_otp(self):
        # create user manually
        user = User.objects.create_user(
            username="otpuser",
            email="otp@test.com",
            password="1234",
            is_active=False
        )

        # create OTP
        otp_obj = OTP.objects.create(user=user, otp="123456")

        response = self.client.post("/api/accounts/verify-otp/", {
            "user_id": user.id,
            "otp": "123456"
        })

        print("OTP VERIFY:", response.data)

        user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(user.is_active)

    # -----------------------------------
    # ❌ INVALID OTP TEST
    # -----------------------------------
    def test_invalid_otp(self):
        user = User.objects.create_user(
            username="wrongotp",
            email="wrong@test.com",
            password="1234",
            is_active=False
        )

        OTP.objects.create(user=user, otp="123456")

        response = self.client.post("/api/accounts/verify-otp/", {
            "user_id": user.id,
            "otp": "000000"
        })

        print("INVALID OTP:", response.data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # -----------------------------------
    # ✅ LOGIN TEST (JWT)
    # -----------------------------------
    def test_login_user(self):
        user = User.objects.create_user(
            username="loginuser",
            password="1234",
            is_active=True
        )

        response = self.client.post("/api/accounts/login/", {
            "username": "loginuser",
            "password": "1234"
        })

        print("LOGIN:", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    # -----------------------------------
    # ❌ LOGIN FAIL (inactive user)
    # -----------------------------------
    def test_login_inactive_user(self):
        user = User.objects.create_user(
            username="inactiveuser",
            password="1234",
            is_active=False
        )

        response = self.client.post("/api/accounts/login/", {
            "username": "inactiveuser",
            "password": "1234"
        })

        print("LOGIN FAIL:", response.data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -----------------------------------
    # ✅ GET USER (AUTH REQUIRED)
    # -----------------------------------
    def test_get_user(self):
        user = User.objects.create_user(
            username="authuser",
            password="1234",
            is_active=True
        )

        # login first
        res = self.client.post("/api/accounts/login/", {
            "username": "authuser",
            "password": "1234"
        })

        token = res.data["access"]

        # attach token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get("/api/accounts/user/")

        print("GET USER:", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "authuser")

    # -----------------------------------
    # ❌ GET USER WITHOUT TOKEN
    # -----------------------------------
    def test_get_user_unauthorized(self):
        response = self.client.get("/api/accounts/user/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)