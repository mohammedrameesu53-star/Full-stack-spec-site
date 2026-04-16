from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.URLField(blank=True,null=True)
    qty = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey("Product",on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)   
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
    
    # models.py
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)

    class Meta:
        unique_together = ['user', 'product']  # 🔥 prevent duplicates

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"    
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   
    created_at = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10,decimal_places=2)  
    status =models.CharField(max_length=20,default="Pending")
    
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name="items")
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField()      
    
    