from django.core.mail import send_mail
from django.conf import settings
import random

def send_test_email():
    send_mail(
        subject="Test Email",
        message="Hello from Django 🚀",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["receiver@gmail.com"],
        fail_silently=False,
    )
    
def generate_otp():
    return str(random.randint(100000, 999999))
    
    