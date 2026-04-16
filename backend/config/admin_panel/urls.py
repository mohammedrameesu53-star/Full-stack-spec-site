from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns=[
    path('login/',AdminLoginView.as_view()),
    path('dashboard/',AdminDashboardView.as_view()),
    path('token/refresh/',TokenRefreshView.as_view()),
    path('users/',AdminUserListView.as_view()),
    path('users/toggle/<int:pk>/',ToggleUserStatusView.as_view()),
    path('products/',AdminProductListView.as_view()),
    path('product/<int:pk>/',AdminProductDetailsView.as_view()),
    path('orders/',AdminOrderListView.as_view())
    
]