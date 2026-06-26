import {
    Button,
    Paper,
    TextField,
    Typography,
    Box,
} from "@mui/material";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    async function handleLogin() {
        const success = await login(
            username,
            password
        );

        if (!success) {
            setError(
                "Invalid username or password."
            );

            return;
        }

        navigate("/");
    }

    return (
        <div
            style={{
                height: "100vh",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",
            }}
        >
            <Paper
                sx={{
                    p: 5,

                    width: 350,
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="img"
                        src="/hsfl.png"
                        alt="Logo"
                        sx={{
                            width: 50,
                            height: 50,
                            mr: 2,
                        }}
                    />
                    HSFL Ground Station
                </Typography>

                <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) =>
                        setUsername(
                            e.target.value
                        )
                    }
                />

                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    margin="normal"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <Typography color="error">
                    {error}
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Sign In
                </Button>
            </Paper>
        </div>
    );
}