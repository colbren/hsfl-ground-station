from rest_framework import viewsets
from .models import GroundStation
from .serializers import GroundStationSerializer

class GroundStationViewSet(viewsets.ModelViewSet):
    queryset = GroundStation.objects.all()
    serializer_class = GroundStationSerializer