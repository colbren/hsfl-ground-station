from django.urls import path

from .views import satellite_position

urlpatterns = [
    path(
        "position/",
        satellite_position,
        name="satellite-position",
    ),
]