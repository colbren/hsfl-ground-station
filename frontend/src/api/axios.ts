import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.150.104:8000/api",
    withCredentials: true,
});

export default api;