from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GroundStationViewSet

router = DefaultRouter()
router.register("groundstations", GroundStationViewSet)

urlpatterns = [
    path("", include(router.urls)),
]