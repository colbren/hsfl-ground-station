import requests

from skyfield.api import EarthSatellite, load

NORAD_ID = 25544

BASE_URL = "https://api.n2yo.com/rest/v1/satellite"
API_KEY = "YOUR-API-KEY-HERE"

ts = load.timescale()


def get_satellite_position():

    response = requests.get(
        f"{BASE_URL}/tle/{NORAD_ID}&apiKey={API_KEY}"
    )

    tle = response.json()["tle"]

    lines = tle.strip().splitlines()

    satellite = EarthSatellite(
        lines[0],
        lines[1],
        f"NORAD {NORAD_ID}",
        ts,
    )

    t = ts.now()

    geocentric = satellite.at(t)

    subpoint = geocentric.subpoint()

    return {
        "name": f"NORAD {NORAD_ID}",
        "lat": subpoint.latitude.degrees,
        "lon": subpoint.longitude.degrees,
        "alt_km": subpoint.elevation.km,
    }