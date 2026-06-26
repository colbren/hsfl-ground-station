import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [time, setTime] = useState(
        new Date().toUTCString().split(" ")[4] + " UTC"
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(
                new Date().toUTCString().split(" ")[4] + " UTC"
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    async function handleLogout() {
        await logout();

        navigate("/login");
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) =>
                    theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <Box
                    component="img"
                    src="/hsfl.png"
                    alt="Logo"
                    sx={{
                        width: 45,
                        height: 45,
                        mr: 2,
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    HSFL Ground Station Network
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Stack
                    spacing={0}
                    alignItems="flex-end"
                    sx={{ mr: 3 }}
                >
                    <Typography variant="body1">
                        {time}
                    </Typography>

                    <Typography variant="body2">
                        {user?.username}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="inherit"
                    >
                        {user?.role}
                    </Typography>
                </Stack>

                <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                        borderColor:
                            "rgba(255,255,255,0.5)",
                        color: "white",
                    }}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}