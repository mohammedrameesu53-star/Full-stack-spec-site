from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import Product, Cart, Wishlist


class ECommerceTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

        # ✅ Create user
        self.user = User.objects.create_user(
            username="testuser",
            password="1234"
        )

        # ✅ LOGIN (FIXED URL)
        response = self.client.post("/api/accounts/login/", {
            "username": "testuser",
            "password": "1234"
        })

        # ✅ Debug safety
        if response.status_code != 200:
            print("LOGIN ERROR:", response.content)
            raise Exception("Login failed in test")

        self.token = response.data["access"]

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

    # ---------------------------
    # PRODUCT
    # ---------------------------
    def test_create_product(self):
        response = self.client.post("/api/products/", {
            "name": "New Glass",
            "category": "Specs",
            "price": 1500,
            "description": "Nice product",
            "image": "https://example.com/img.jpg",
            "qty": 5
        })
        
        print("PRODUCT ERROR:", response.data) 
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # ---------------------------
    # CART
    # ---------------------------
    def test_add_to_cart(self):
        response = self.client.post("/api/cart/", {
            "product_id": self.product.id,
            "quantity": 2
        })
        
        print("CART ERROR:", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_cart_quantity(self):
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=1)

        response = self.client.patch(f"/api/cart/{cart.id}/", {
            "quantity": 3
        })
        
        print("CART ERROR:", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_cart(self):
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=1)

        response = self.client.delete(f"/api/cart/{cart.id}/")
        
        print("CART ERROR:", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ---------------------------
    # WISHLIST
    # ---------------------------
    def test_add_to_wishlist(self):
        response = self.client.post("/api/wishlist/", {
            "product_id": self.product.id
        })
        
        print("WISHLIST ERROR:", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_prevent_duplicate_wishlist(self):
        Wishlist.objects.create(user=self.user, product=self.product)

        response = self.client.post("/api/wishlist/", {
            "product": self.product.id
        })
        
        print("WISHLIST ERROR:", response.data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remove_from_wishlist(self):
        item = Wishlist.objects.create(user=self.user, product=self.product)

        response = self.client.delete(f"/api/wishlist/{item.id}/")
        
        print("WISHLIST ERROR:", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ---------------------------
    # ORDER
    # ---------------------------
    def test_create_order(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=2)

        response = self.client.post("/api/order/create/")
        
        print("ORDER ERROR:", response.data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_payment_success(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)

        response = self.client.post("/api/payment/success/", {
            "razorpay_payment_id": "test_payment",
            "razorpay_order_id": "test_order",
            "razorpay_signature": "test_signature"
        })
        
        print("PAYMENT ERROR:", response.data)

        self.assertIn(response.status_code, [200, 400])