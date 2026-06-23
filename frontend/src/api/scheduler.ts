import axios from "axios";

export async function getScheduledPasses() {
    const response = await axios.get(
        "http://localhost:8000/api/scheduled-passes/"
    );

    return response.data;
}

export async function searchPasses(
    satellite: number,
    groundStation: number,
    start: string,
    end: string
) {

    const response = await axios.get(
        "http://localhost:8000/api/passes/search/",
        {
            params: {
                satellite,
                ground_station: groundStation,
                start,
                end,
            },
        }
    );

    return response.data;
}

export async function createScheduledPass(pass: any) {

    const payload = {
        satellite: pass.satellite,
        ground_station: pass.ground_station,
        start_time: pass.start_time,
        end_time: pass.end_time,
        status: "Pending"
    };

    return axios.post(
        "http://localhost:8000/api/scheduled-passes/",
        payload,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}