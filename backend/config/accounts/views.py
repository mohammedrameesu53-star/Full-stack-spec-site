from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view,permission_classes
from django.db import IntegrityError
from django.core.mail import send_mail
from django.conf import settings
from .utils import generate_otp
from .models import OTP
from django.contrib.auth.models import User
import random

# Create your views here.

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            
            otp_code = generate_otp()
            
            OTP.objects.update_or_create(
                user=user,
                defaults={"otp": otp_code}
            )
            
            try:
                send_mail(
                    subject="Verify your account 🔐",
                    message=f"Your OTP is: {otp_code}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=False,
                )   
            except Exception as e:
                print("Email error:", e)
                
            return Response({
                "massage":"User created. Please verify OTP",
                "user_id": user.id
            },status=201)    
            
        return Response(serializer.errors, status=400)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username
    })       
    
    
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        otp = request.data.get("otp")

        try:
            user = User.objects.get(id=user_id)
            otp_obj = OTP.objects.get(user=user)

            if otp_obj.otp == otp:
                user.is_active = True
                user.save()

                otp_obj.delete()  # cleanup

                return Response({"message": "Account verified ✅"})

            return Response({"error": "Invalid OTP"}, status=400)

        except OTP.DoesNotExist:
            return Response({"error": "OTP not found"}, status=400) 
        
           
        
# store OTP temporarily (simple version)
RESET_OTP = {}

class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        otp = str(random.randint(100000, 999999))
        RESET_OTP[email] = otp

        send_mail(
            "Password Reset OTP",
            f"Your OTP is {otp}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=True,
        )

        return Response({"message": "OTP sent to email"})              
    
    
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("password")

        if RESET_OTP.get(email) != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()

        RESET_OTP.pop(email)

        return Response({"message": "Password reset successful"})    
    
class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if RESET_OTP.get(email) != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        return Response({"message": "OTP verified"})    