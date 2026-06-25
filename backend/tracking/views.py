from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import get_satellite_position


@api_view(["GET"])
def satellite_position(request):

    return Response(
        get_satellite_position()
    )