import api from "./axios";

function getCookie(name: string) {
    let cookieValue: string | null = null;

    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }

    return cookieValue;
}

export async function getSatellites() {
    const res = await api.get("/satellites/");
    return res.data ?? [];
}

export async function createSatellite(payload: {
    name: string;
    norad_id: number;
}) {
    const res = await api.post(
        "/satellites/",
        payload,
        {
            headers: {
                "X-CSRFToken":
                    getCookie("csrftoken") || "",
            },
        }
    );

    return res.data;
}

export async function updateTLE(id: number) {
    const res = await api.post(
        `/satellites/${id}/update_tle/`,
        {},
        {
            headers: {
                "X-CSRFToken":
                    getCookie("csrftoken") || "",
            },
        }
    );

    return res.data;
}

export async function deleteSatellite(id: number) {
    const res = await api.delete(
        `/satellites/${id}/`,
        {
            headers: {
                "X-CSRFToken":
                    getCookie("csrftoken") || "",
            },
        }
    );

    return res.data;
}