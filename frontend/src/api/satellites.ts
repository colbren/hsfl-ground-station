import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/satellites/";

export async function getSatellites() {
    const response = await axios.get(API_URL);

    return response.data;
}