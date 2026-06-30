from datetime import timedelta

from .predictor import propagate_tle, get_az_el


def get_elevation(
    tle1,
    tle2,
    observer_lat,
    observer_lon,
    t,
):
    state = propagate_tle(tle1, tle2, t)

    if not state:
        return None, None

    az, el = get_az_el(
        observer_lat,
        observer_lon,
        state["lat"],
        state["lon"],
        state["alt_km"],
    )

    return az, el


def refine_crossing(
    tle1,
    tle2,
    observer_lat,
    observer_lon,
    t1,
    t2,
):
    """
    Binary search the horizon crossing to ~1 second.
    """

    while (t2 - t1).total_seconds() > 1:

        mid = t1 + (t2 - t1) / 2

        _, el = get_elevation(
            tle1,
            tle2,
            observer_lat,
            observer_lon,
            mid,
        )

        if el is None:
            break

        if el > 0:
            t2 = mid
        else:
            t1 = mid

    az, _ = get_elevation(
        tle1,
        tle2,
        observer_lat,
        observer_lon,
        t2,
    )

    return t2, az


def compute_passes(
    tle1,
    tle2,
    observer_lat,
    observer_lon,
    start_time,
    end_time,
    step_seconds=20,
):

    passes = []

    current = None

    previous_time = start_time
    previous_az, previous_el = get_elevation(
        tle1,
        tle2,
        observer_lat,
        observer_lon,
        previous_time,
    )

    t = start_time + timedelta(seconds=step_seconds)

    while t <= end_time:

        az, el = get_elevation(
            tle1,
            tle2,
            observer_lat,
            observer_lon,
            t,
        )

        if el is None:
            t += timedelta(seconds=step_seconds)
            continue

        # --------------------
        # AOS crossing
        # --------------------

        if (
            current is None
            and previous_el is not None
            and previous_el <= 0
            and el > 0
        ):

            aos_time, aos_az = refine_crossing(
                tle1,
                tle2,
                observer_lat,
                observer_lon,
                previous_time,
                t,
            )

            current = {
                "aos_time": aos_time,
                "aos_az": aos_az,
                "max_el": el,
                "max_time": t,
            }

        # --------------------
        # Track maximum elevation
        # --------------------

        if current and el > current["max_el"]:

            current["max_el"] = el
            current["max_time"] = t

        # --------------------
        # LOS crossing
        # --------------------

        if (
            current is not None
            and previous_el > 0
            and el <= 0
        ):

            los_time, los_az = refine_crossing(
                tle1,
                tle2,
                observer_lat,
                observer_lon,
                previous_time,
                t,
            )

            current["los_time"] = los_time
            current["los_az"] = los_az
            current["duration"] = (
                los_time - current["aos_time"]
            )

            passes.append(current)

            current = None

        previous_time = t
        previous_el = el
        previous_az = az

        t += timedelta(seconds=step_seconds)

    return passes