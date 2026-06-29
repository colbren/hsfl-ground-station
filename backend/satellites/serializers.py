from rest_framework import serializers
from .models import Satellite


class SatelliteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Satellite
        fields = "__all__"
        read_only_fields = (
            "tle_line1",
            "tle_line2",
            "tle_updated",
            "created",
        )