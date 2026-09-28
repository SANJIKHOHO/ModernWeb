from django.core.cache import cache
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import AddToCartSerializer, ProductSerializer, CartItemSerializer, OrderSerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        data = cache.get('products_list')
        if data is None:
            print("CACHE MISS: querying database")
            serializer = self.get_serializer(self.get_queryset(), many=True)
            data = list(serializer.data)
            cache.set('products_list', data, 60)
        else:
            print("CACHE HIT: served from Redis")
        return Response(data)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartItemSerializer(cart.items.all(), many=True).data)

    @swagger_auto_schema(request_body=AddToCartSerializer)
    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response({'error': 'product_id is required'}, status=400)

        item, created = CartItem.objects.get_or_create(
            cart=cart, product_id=product_id,
            defaults={'quantity': quantity}
        )
        if not created:
            item.quantity += int(quantity)
            item.save()

        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


class CartItemRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        deleted, _ = CartItem.objects.filter(id=item_id, cart__user=request.user).delete()
        if not deleted:
            return Response({'error': 'not found'}, status=404)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        return Response(OrderSerializer(orders, many=True).data)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = cart.items.all()

        if not items:
            return Response({'error': 'cart is empty'}, status=400)

        order = Order.objects.create(user=request.user)
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )
        items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)