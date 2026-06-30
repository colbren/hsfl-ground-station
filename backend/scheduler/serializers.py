from django.utils import timezone
from rest_framework import serializers
from .models import ScheduledPass

class ScheduledPassSerializer(serializers.ModelSerializer):

    satellite_name = serializers.CharField(
        source="satellite.name",
        read_only=True
    )

    ground_station_name = serializers.CharField(
        source="ground_station.name",
        read_only=True
    )

    status = serializers.SerializerMethodField()

    def get_status(self, obj):

        now = timezone.now()

        if now < obj.start_time:
            return "Pending"

        if obj.start_time <= now <= obj.end_time:
            return "Running"

        return "Complete"

    class Meta:
        model = ScheduledPass
        fields = [
            "id",
            "satellite",
            "satellite_name",
            "ground_station",
            "ground_station_name",
            "start_time",
            "end_time",
            "status",
        ]