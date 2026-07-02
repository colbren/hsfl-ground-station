// groundStations.ts

import axios from "axios";

export interface GroundStation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
}

export async function getGroundStations() {
    const response = await axios.get(
        "http://192.168.150.104:8000/api/groundstations/"
    );

    return response.data;
}