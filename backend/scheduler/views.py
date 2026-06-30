from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from datetime import datetime

from satellites.models import Satellite
from groundstations.models import GroundStation

from .models import ScheduledPass
from .serializers import ScheduledPassSerializer
from .services import compute_passes

class ScheduledPassViewSet(viewsets.ModelViewSet):
    queryset = ScheduledPass.objects.all()
    serializer_class = ScheduledPassSerializer
class ComputePassesView(APIView):

    def get(self, request):

        satellite_id = request.query_params.get("satellite_id")
        groundstation_id = request.query_params.get("groundstation_id")

        start = datetime.fromisoformat(request.query_params.get("start"))
        end = datetime.fromisoformat(request.query_params.get("end"))

        sat_obj = Satellite.objects.get(id=satellite_id)
        gs = GroundStation.objects.get(id=groundstation_id)

        passes = compute_passes(
            sat_obj.tle_line1,
            sat_obj.tle_line2,
            gs.latitude,
            gs.longitude,
            start,
            end
        )

        return Response([
            {
                "start_time": p["aos_time"].isoformat(),
                "start_azimuth": round(p["aos_az"], 1),
                "max_elevation": round(p["max_el"], 1),
                "max_time": p["max_time"].isoformat(),
                "end_time": p["los_time"].isoformat(),
                "end_azimuth": round(p["los_az"], 1),
                "duration_sec": p["duration"].total_seconds(),
            }
            for p in passes
        ])