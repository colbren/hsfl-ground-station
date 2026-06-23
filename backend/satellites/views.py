from rest_framework import viewsets
from .models import Satellite
from .serializers import SatelliteSerializer

class SatelliteViewSet(viewsets.ModelViewSet):
    queryset = Satellite.objects.all()
    serializer_class = SatelliteSerializer