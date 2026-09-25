from django.urls import path
from .views import ProductListView, CartView, CartItemRemoveView, OrderView

urlpatterns = [
    path('products/', ProductListView.as_view()),
    path('cart/', CartView.as_view()),
    path('cart/<int:item_id>/', CartItemRemoveView.as_view()),
    path('orders/', OrderView.as_view()),
]