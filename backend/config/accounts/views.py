from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view,permission_classes
from django.db import IntegrityError

# Create your views here.

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"message": "User created"}, status=201)
            except IntegrityError:
                return Response({"error":"User already exists"},status=400)
        return Response(serializer.errors, status=400)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username
    })       