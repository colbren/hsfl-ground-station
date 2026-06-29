import os
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

from skyfield.api import load, EarthSatellite

from .models import Satellite

load_dotenv()

BASE_URL = "https://api.n2yo.com/rest/v1/satellite"
API_KEY = os.getenv("N2YO_API_KEY")

ts = load.timescale()


# -----------------------------
# TLE DOWNLOAD
# -----------------------------
def download_tle(norad_id: int):
    url = f"{BASE_URL}/tle/{norad_id}&apiKey={API_KEY}"

    res = requests.get(url, timeout=10)

    try:
        data = res.json()
    except Exception:
        raise Exception(f"Invalid JSON response: {res.text}")

    # DEBUG OUTPUT (important for now)
    print("TLE API RESPONSE:", data)

    if "tle" not in data:
        raise Exception(f"TLE API error: {data}")

    tle = data["tle"].splitlines()

    if len(tle) < 2:
        raise Exception(f"Incomplete TLE data: {data}")

    return tle[0], tle[1]


def update_tle(satellite: Satellite):
    line1, line2 = download_tle(satellite.norad_id)

    satellite.tle_line1 = line1
    satellite.tle_line2 = line2
    satellite.tle_updated = datetime.now(timezone.utc)
    satellite.save()

    return satellite


# -----------------------------
# SKYFIELD SAT OBJECT
# -----------------------------
def get_satellite(satellite: Satellite):
    if not satellite.tle_line1 or not satellite.tle_line2:
        update_tle(satellite)

    return EarthSatellite(
        satellite.tle_line1,
        satellite.tle_line2,
        satellite.name,
        ts,
    )


# -----------------------------
# CURRENT POSITION
# -----------------------------
def current_position(satellite: Satellite):
    sat = get_satellite(satellite)

    t = ts.now()
    geocentric = sat.at(t)
    subpoint = geocentric.subpoint()

    return {
        "lat": subpoint.latitude.degrees,
        "lon": subpoint.longitude.degrees,
        "alt_km": subpoint.elevation.km,
    }


# -----------------------------
# TRAJECTORY (for map line)
# -----------------------------
from datetime import timedelta

def trajectory(satellite: Satellite, minutes=90, step=1):
    sat = get_satellite(satellite)

    now = datetime.now(timezone.utc)
    result = []

    for i in range(0, minutes + 1, step):
        dt = now + timedelta(minutes=i)
        t = ts.from_datetime(dt)

        subpoint = sat.at(t).subpoint()

        result.append({
            "lat": subpoint.latitude.degrees,
            "lon": subpoint.longitude.degrees,
            "alt": subpoint.elevation.km,
            "time": dt.isoformat(),
        })

    return result


# -----------------------------
# AUTO UPDATE (call from startup / cron later)
# -----------------------------
def refresh_all_tles():
    for sat in Satellite.objects.all():
        if not sat.tle_updated:
            update_tle(sat)
            continue

        age = datetime.now(timezone.utc) - sat.tle_updated
        if age.days >= 1:
            update_tle(sat)