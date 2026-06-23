from datetime import datetime, timedelta

def generate_passes(
    satellite_name,
    ground_station_name,
    start_time,
    end_time,
):
    return [
        {
            "id": 1,
            "satellite_name": satellite_name,
            "ground_station_name": ground_station_name,
            "aos": (
                start_time + timedelta(minutes=10)
            ).isoformat(),
            "los": (
                start_time + timedelta(minutes=22)
            ).isoformat(),
            "duration_seconds": 720,
        },
        {
            "id": 2,
            "satellite_name": satellite_name,
            "ground_station_name": ground_station_name,
            "aos": (
                start_time + timedelta(hours=2)
            ).isoformat(),
            "los": (
                start_time + timedelta(hours=2, minutes=11)
            ).isoformat(),
            "duration_seconds": 660,
        },
        {
            "id": 3,
            "satellite_name": satellite_name,
            "ground_station_name": ground_station_name,
            "aos": (
                start_time + timedelta(hours=4)
            ).isoformat(),
            "los": (
                start_time + timedelta(hours=4, minutes=13)
            ).isoformat(),
            "duration_seconds": 780,
        },
    ]