from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ScheduledPassViewSet

router = DefaultRouter()
router.register("scheduled-passes", ScheduledPassViewSet)

urlpatterns = [
    path("", include(router.urls)),
]