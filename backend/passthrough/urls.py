from django.urls import path
from .views import PacketView

urlpatterns = [
    path("packets/", PacketView.as_view()),
]