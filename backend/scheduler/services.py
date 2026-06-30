from datetime import timedelta
from .predictor import propagate_tle, get_az_el


def compute_passes(
    tle1,
    tle2,
    observer_lat,
    observer_lon,
    start_time,
    end_time,
    step_seconds=20
):
    t = start_time

    passes = []
    current = None

    while t <= end_time:

        state = propagate_tle(tle1, tle2, t)
        if not state:
            t += timedelta(seconds=step_seconds)
            continue

        az, el = get_az_el(
            observer_lat,
            observer_lon,
            state["lat"],
            state["lon"],
            state["alt_km"]
        )

        # ---------------- AOS ----------------
        if el > 0 and current is None:
            current = {
                "aos_time": t,
                "aos_az": az,
                "max_el": el,
                "max_time": t,
            }

        # ---------------- TRACK MAX ----------------
        if current:
            if el > current["max_el"]:
                current["max_el"] = el
                current["max_time"] = t

        # ---------------- LOS ----------------
        if current and el <= 0:
            current["los_time"] = t
            current["los_az"] = az

            current["duration"] = (
                current["los_time"] - current["aos_time"]
            )

            passes.append(current)
            current = None

        t += timedelta(seconds=step_seconds)

    return passes