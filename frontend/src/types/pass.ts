export interface ScheduledPass {
    id: number;

    satellite: number;
    satellite_name: string;

    ground_station: number;
    ground_station_name: string;

    start_time: string;
    end_time: string;

    status: string;
}

export interface AvailablePass {
    id: number;

    satellite_id: number;
    ground_station_id: number;

    satellite_name: string;
    ground_station_name: string;

    aos: string;
    los: string;

    duration_seconds: number;
}