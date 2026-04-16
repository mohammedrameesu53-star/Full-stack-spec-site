from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from store.models import Product, Order


class AdminPanelTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

        # ✅ Create admin user
        self.admin = User.objects.create_user(
            username="admin",
            password="admin123",
            is_staff=True,
            is_active=True
        )

        # ✅ Create normal user
        self.user = User.objects.create_user(
            username="user",
            password="1234",
            is_active=True
        )

        # ✅ Login as admin
        res = self.client.post("/api/admin/login/", {
            "username": "admin",
            "password": "admin123"
        })

        if res.status_code != 200:
            print("ADMIN LOGIN ERROR:", res.content)
            raise Exception("Admin login failed")

        self.token = res.data["access"]

        # ✅ Attach token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        # ✅ Create product
        self.product = Product.objects.create(
            name="Test Glass",
            category="Specs",
            price=1000,
            description="Test product",
            image="https://example.com/image.jpg",
            qty=10
        )

        # ✅ Create order
        self.order = Order.objects.create(
            user=self.user,
            total=2000,
            status="Pending"
        )

    # -----------------------------------
    # ✅ ADMIN LOGIN
    # -----------------------------------
    def test_admin_login(self):
        res = self.client.post("/api/admin/login/", {
            "username": "admin",
            "password": "admin123"
        })

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)

    # -----------------------------------
    # ❌ NON-ADMIN LOGIN
    # -----------------------------------
    def test_non_admin_login(self):
        res = self.client.post("/api/admin/login/", {
            "username": "user",
            "password": "1234"
        })

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    # -----------------------------------
    # ✅ DASHBOARD
    # -----------------------------------
    def test_admin_dashboard(self):
        res = self.client.get("/api/admin/dashboard/")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("products", res.data)
        self.assertIn("orders", res.data)
        self.assertIn("users", res.data)

    # -----------------------------------
    # ✅ USER LIST
    # -----------------------------------
    def test_admin_user_list(self):
        res = self.client.get("/api/admin/users/")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 1)

    # -----------------------------------
    # ✅ TOGGLE USER STATUS
    # -----------------------------------
    def test_toggle_user_status(self):
        res = self.client.patch(f"/api/admin/users/toggle/{self.user.id}/")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

    # -----------------------------------
    # ✅ GET PRODUCTS
    # -----------------------------------
    def test_admin_get_products(self):
        res = self.client.get("/api/admin/products/")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 1)

    # -----------------------------------
    # ✅ CREATE PRODUCT
    # -----------------------------------
    def test_admin_create_product(self):
        res = self.client.post("/api/admin/products/", {
            "name": "New Glass",
            "category": "Specs",
            "price": 1500,
            "description": "Nice product",
            "image": "https://example.com/img.jpg",
            "qty": 5
        })

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    # -----------------------------------
    # ✅ DELETE PRODUCT
    # -----------------------------------
    def test_admin_delete_product(self):
        res = self.client.delete(f"/api/admin/product/{self.product.id}/")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    # -----------------------------------
    # ✅ UPDATE PRODUCT
    # -----------------------------------
    def test_admin_update_product(self):
        res = self.client.patch(f"/api/admin/product/{self.product.id}/", {
            "name": "Updated Glass",
            "category": "Specs",
            "price": 1200,
            "description": "Updated",
            "image": "https://example.com/img.jpg",
            "qty": 8
        })

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    # -----------------------------------
    # ✅ GET ORDERS
    # -----------------------------------
    def test_admin_order_list(self):
        res = self.client.get("/api/admin/orders/")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 1)

    # -----------------------------------
    # ❌ UNAUTHORIZED ACCESS
    # -----------------------------------
    def test_unauthorized_access(self):
        client = APIClient()

        res = client.get("/api/admin/dashboard/")

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)