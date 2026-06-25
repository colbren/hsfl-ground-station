export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "GroundStationClient" | "GroundStationNetwork" | null;
}

export interface AuthResponse {
    authenticated: boolean;
    user?: User;
}