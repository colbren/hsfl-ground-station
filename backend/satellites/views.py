from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Satellite
from .serializers import SatelliteSerializer
from .services import update_tle


class SatelliteViewSet(viewsets.ModelViewSet):
    queryset = Satellite.objects.all()
    serializer_class = SatelliteSerializer

    @action(detail=True, methods=["post"])
    def update_tle(self, request, pk=None):
        satellite = self.get_object()

        try:
            update_tle(satellite)
            return Response({"status": "ok"})
        except Exception as e:
            print("TLE UPDATE FAILED:", e)
            raise