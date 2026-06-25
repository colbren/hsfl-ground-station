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

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetch(
            "http://localhost:8000/api/auth/me/",
            {
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) {
                    setUser(data.user);
                }

                setLoading(false);
            });
    }, []);

    async function login(
        username: string,
        password: string
    ) {
        const res = await fetch(
            "http://localhost:8000/api/auth/login/",
            {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type":
                        "application/json",
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

        const user = await res.json();

        setUser(user);

        return true;
    }

    async function logout() {
        await fetch(
            "http://localhost:8000/api/auth/logout/",
            {
                method: "POST",

                credentials: "include",
            }
        );

        setUser(null);
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