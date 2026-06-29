from datetime import datetime, timezone

from .models import Satellite
from .services import update_tle


def refresh_all_tles():
    now = datetime.now(timezone.utc)

    for satellite in Satellite.objects.all():

        if (
            satellite.tle_updated is None
            or (now - satellite.tle_updated).days >= 1
        ):
            update_tle(satellite)