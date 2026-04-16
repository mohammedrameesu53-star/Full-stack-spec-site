from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from store.models import User,Product,Order,Cart
from store.serializers import ProductSerializer
# Create your views here.

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username,password=password)
        
        if user and user.is_staff:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access":str(refresh.access_token),
                "refresh":str(refresh),
                "message":"Admin login successful"
            })
            
        return Response({"error":"Invalid credentials"},status=401)    
    
    
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        return Response({
            "products":Product.objects.count(),
            "orders":Order.objects.count(),
            "users":User.objects.count()
        })
       

class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]     
    
    def get(self,request):
        users = User.objects.filter(is_staff=False).order_by('id')
        
        data=[]
        
        for user in users:
            cart_count = Cart.objects.filter(user=user).count()
            order_count = Order.objects.filter(user=user).count()
            wishlist_count = Order.objects.filter(user=user).count()
            
            data.append({
                "id":user.id,
                "name":user.username,
                "email":user.email,
                "cart":cart_count,
                "order":order_count,
                "wishlist":wishlist_count,
                "is_active":user.is_active
            })
        return Response(data)   

class ToggleUserStatusView(APIView):
    permission_classes = [IsAdminUser]
    
    def patch(self,request,pk):
        user = User.objects.get(id=pk)  
        
        user.is_active = not user.is_active
        user.save()
        
        return Response({
            "massage":"User status is updated",
            "is_active":user.is_active
        })
  
class AdminProductListView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self,request):
        try:
            products = Product.objects.all().order_by('id')
        
            serializer = ProductSerializer(products,many=True)
            return Response(serializer.data)
        except:
            return Response({"error":"Somthing went wrong"},status=400)
    def post(self,request):
        serializer = ProductSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=201)
        
        return Response(serializer.errors,status=400) 
        
            
class AdminProductDetailsView(APIView):
    permission_classes = [IsAdminUser]
    
    def delete(self,request,pk):
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({"massage":"Product deleted successfuly"},status=200)
    
    def get(self,request,pk):
        product = Product.objects.get(pk=pk) 
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    def patch(self,request,pk):
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product,data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors,status=400)
    
class AdminOrderListView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self,request):
        orders = Order.objects.select_related('user').all().order_by('-created_at') 
        
        data = []
        
        for order in orders:
            data.append({
                "id":order.id,
                "user":order.user.username,
                "total":order.total,
                "status":order.status,
                "created_at":order.created_at
            })
          
        return Response(data)    
       