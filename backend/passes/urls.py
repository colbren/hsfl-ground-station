from django.urls import path
from .views import search_passes

urlpatterns = [
    path(
        "passes/search/",
        search_passes
    ),
]