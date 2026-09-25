from django.urls import path
from .views import NameLoginView

urlpatterns = [
    path('login/', NameLoginView.as_view())
]