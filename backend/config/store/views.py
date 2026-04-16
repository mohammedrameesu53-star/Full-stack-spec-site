from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from .models import Product,Cart,Wishlist,Order,OrderItem
from .serializers import ProductSerializer,CartSerializer,WishlistSerializer
from django.shortcuts import get_object_or_404
import razorpay
from django.conf import settings

client = razorpay.Client(auth=(settings.RAZORPAY_KEY,settings.RAZORPAY_SECRET))    

# ************************************* Product ***********************************

class ProductListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            products = Product.objects.all()

            search = request.GET.get('search')
            if search:
                products = products.filter(name__icontains=search)

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
    
    
class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try: 
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

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
        try:
            cart = Cart.objects.filter(user=request.user)
            serializer = CartSerializer(cart, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def post(self, request):
        serializer = CartSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)
    
    
   
class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        item = Cart.objects.get(id=pk, user=request.user)
        item.delete()
        return Response({"message": "Removed"}) 
    
    
    def patch( self, request,pk):
        item = Cart.objects.get(pk=pk, user=request.user) 
        
        serializer = CartSerializer(item,data=request.data,partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors)
    
    

   
# ************************************* Wishlist ***********************************

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wishlist = Wishlist.objects.filter(user=request.user)
            serializer = WishlistSerializer(wishlist, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
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
        print(serializer.errors)
        return Response(serializer.errors, status=400)
    
    
class WishlistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        item = get_object_or_404(Wishlist, id=pk, user=request.user)
        item.delete()
        return Response({"message": "Removed from wishlist"})    


# ************************************* Order ***********************************

class PaymentSuccessView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        
        payment_id = request.data.get("razorpay_payment_id")
        order_id = request.data.get("razorpay_order_id")
        signature = request.data.get("razorpay_signature")
        
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id':payment_id,
                'razorpay_signature':signature
            })
        except:
            return Response({"error":"Payment verification failed"},status=400)    
        
        cart_items = Cart.objects.filter(user=request.user)
        
        if not cart_items.exists():
            return Response({"error":"Cart is empty"},status=400)
        
        total = 0
        
        for item in cart_items:
            total += item.product.price * item.quantity
            
        order = Order.objects.create(
            user=request.user,
            total=total,
            razorpay_order_id = order_id,
            razorpay_payment_id = payment_id,
            status = "Paid"
        )   
        
        for item in cart_items:
            OrderItem.objects.create(
                order = order,
                product = item.product,
                quantity = item.quantity
            )
        
        cart_items.delete() 
        
        return Response({
                    "message": "Payment successful",
                    "order_id": order.id
                    }, status=200)  
    
    
    
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        cart_items = Cart.objects.filter(user=request.user)
        
        if not cart_items.exists():
            return Response({"error":"Cart is empty"},status=400)
        
        total = 0 
        for item in cart_items:
            total += item.product.price * item.quantity
            
        razorpay_order = client.order.create({
            "amount":int(total * 100),
            "currency":"INR",
            "payment_capture":1
        })    
        
        return Response({
            "order_id": razorpay_order['id'],
            "amount": razorpay_order['amount'],
            "currency":"INR",
            "key":settings.RAZORPAY_KEY
        })