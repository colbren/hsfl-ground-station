import math
from sgp4.api import Satrec, jday


def normalize_lon(lon):
    return ((lon + 180) % 360) - 180


def propagate_tle(tle1, tle2, dt):
    satrec = Satrec.twoline2rv(tle1, tle2)

    jd, fr = jday(
        dt.year,
        dt.month,
        dt.day,
        dt.hour,
        dt.minute,
        dt.second + dt.microsecond * 1e-6
    )

    error, position, velocity = satrec.sgp4(jd, fr)

    if error != 0:
        return None

    x, y, z = position  # km (ECI)

    # crude conversion to lat/lon (good enough for scheduler MVP)
    r = math.sqrt(x*x + y*y + z*z)

    lat = math.degrees(math.asin(z / r))
    lon = math.degrees(math.atan2(y, x))

    return {
        "lat": lat,
        "lon": normalize_lon(lon),
        "alt_km": r - 6371.0,
    }


def get_az_el(observer_lat, observer_lon, sat_lat, sat_lon, sat_alt_km):
    """
    Simplified az/el (scheduler-grade, not aerospace-grade)
    """

    lat1 = math.radians(observer_lat)
    lon1 = math.radians(observer_lon)
    lat2 = math.radians(sat_lat)
    lon2 = math.radians(sat_lon)

    dlon = lon2 - lon1

    az = math.atan2(
        math.sin(dlon) * math.cos(lat2),
        math.cos(lat1)*math.sin(lat2) - math.sin(lat1)*math.cos(lat2)*math.cos(dlon)
    )

    elevation = math.atan2(sat_alt_km, 6371.0)

    return (
        math.degrees(az) % 360,
        math.degrees(elevation)
    )