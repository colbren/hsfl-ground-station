import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { User } from "./types";

type AuthContextType = {
    user: User | null;
    loading: boolean;

    login: (
        username: string,
        password: string
    ) => Promise<boolean>;

    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

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

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://192.168.150.104:8000/api/auth/me/", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function login(
        username: string,
        password: string
    ) {
        const res = await fetch(
            "http://192.168.150.104:8000/api/auth/login/",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken") || "",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );

        if (!res.ok) {
            return false;
        }

        const data = await res.json();

        setUser(data);

        return true;
    }

    async function logout() {
        await fetch(
            "http://192.168.150.104:8000/api/auth/logout/",
            {
                method: "POST",

                credentials: "include",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken") || "",
                },
            }
        );

        setUser(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}