# scheduler/services/passes.py

from skyfield.api import load, EarthSatellite, wgs84
from datetime import timedelta
from ..models import ScheduledPass


def compute_passes_from_tle(tle, lat, lon, min_elevation=10.0):
    ts = load.timescale()

    satellite = EarthSatellite(
        tle.line1,
        tle.line2,
        tle.name,
        ts
    )

    observer = wgs84.latlon(lat, lon)

    t0 = ts.now()
    t1 = ts.utc(t0.utc_datetime() + timedelta(days=1))

    times, events = satellite.find_events(
        observer,
        t0,
        t1,
        altitude_degrees=min_elevation
    )

    passes = []
    current = {}

    for t, event in zip(times, events):
        if event == 0:  # AOS
            current["aos"] = t.utc_datetime()

        elif event == 1:  # MAX elevation
            current["tca"] = t.utc_datetime()

        elif event == 2:  # LOS
            current["los"] = t.utc_datetime()
            passes.append(current)
            current = {}

    return passes