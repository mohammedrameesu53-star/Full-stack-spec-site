from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from .models import Product,Cart,Wishlist
from .serializers import ProductSerializer,CartSerializer,WishlistSerializer
from django.shortcuts import get_object_or_404


# ************************************* Product ***********************************

class ProductListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all()

        search = request.GET.get('search')
        if search:
            products = products.filter(name__icontains=search)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
    
    
class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        product = Product.objects.get(id=pk)
        product.delete()
        return Response({"message": "Deleted"})    
    
    
# ************************************* Cart ***********************************

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(cart, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CartSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
    
   
class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        item = Cart.objects.get(id=pk, user=request.user)
        item.delete()
        return Response({"message": "Removed"}) 
    
    
    def patch( self, request,pk):
        item = Cart.objects.get(pk=pk) 
        
        serializer = CartSerializer(item,data=request.data,partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors)
            
            
              
    
    
   
# ************************************* Cart ***********************************

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlist, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get("product")

        if Wishlist.objects.filter(user=request.user, product_id=product_id).exists():
            return Response(
                {"error": "Already in wishlist"},
                status=400
            )

        serializer = WishlistSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
    
class WishlistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        item = get_object_or_404(Wishlist, id=pk, user=request.user)
        item.delete()
        return Response({"message": "Removed from wishlist"})    

    