from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('register/',views.RegisterView.as_view()),
    path('verify-otp/',views.VerifyOTPView.as_view()),
    path('login/',TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('user/',views.get_user),
    path('password-reset/', views.RequestPasswordResetView.as_view()),
    path('verify-reset-otp/', views.VerifyResetOTPView.as_view()),
    path('password-reset-confirm/', views.ResetPasswordView.as_view()),
    
]
