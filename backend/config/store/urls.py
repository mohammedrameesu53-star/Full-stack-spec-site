from django.urls import path
from .views import *

urlpatterns = [
    path('products/', ProductListCreateView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),

    path('cart/', CartView.as_view()),
    path('cart/<int:pk>/', CartDetailView.as_view()),
    
    path('wishlist/', WishlistView.as_view()),
    path('wishlist/<int:pk>/', WishlistDetailView.as_view()),
]
