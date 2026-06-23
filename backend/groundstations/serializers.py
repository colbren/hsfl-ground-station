from rest_framework import serializers
from .models import GroundStation

class GroundStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroundStation
        fields = "__all__"