from rest_framework import serializers
from .models import Product,Cart,Wishlist
from django.contrib.auth.models import User 


class ProductSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Product
        fields = "__all__"
        
    
class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_id', 'quantity']
        read_only_fields = ['user']
        
# serializers.py
class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id']        

        