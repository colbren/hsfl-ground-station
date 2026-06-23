from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from satellites.models import Satellite
from groundstations.models import GroundStation

from .pass_generator import generate_passes


@api_view(["GET"])
def search_passes(request):

    satellite_id = request.GET.get("satellite")
    ground_station_id = request.GET.get("ground_station")

    start = request.GET.get("start")
    end = request.GET.get("end")

    satellite = Satellite.objects.get(id=satellite_id)
    ground_station = GroundStation.objects.get(id=ground_station_id)

    start_time = datetime.fromisoformat(start)
    end_time = datetime.fromisoformat(end)

    passes = generate_passes(
        satellite.name,
        ground_station.name,
        start_time,
        end_time,
    )

    # 🔥 IMPORTANT FIX: attach IDs to each generated pass
    enriched_passes = []

    for p in passes:
        enriched_passes.append({
            # optional internal id if you have one
            "id": p.get("id"),

            # ✅ REQUIRED FOR FRONTEND SUBMIT
            "satellite_id": satellite.id,
            "ground_station_id": ground_station.id,

            # UI display fields
            "satellite_name": satellite.name,
            "ground_station_name": ground_station.name,

            # timing fields
            "aos": p["aos"],
            "los": p["los"],
            "duration_seconds": p.get("duration_seconds"),
        })

    return Response(enriched_passes)