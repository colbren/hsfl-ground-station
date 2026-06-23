import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [time, setTime] = useState(
        // Local time string
        // new Date().toLocaleTimeString()

        // UTC time string
        new Date().toUTCString().split(" ")[4] + " UTC"
    );

    useEffect(() => {
        const interval = setInterval(() => {
            // Local time string
            // setTime(new Date().toLocaleTimeString());

            // UTC time string
            setTime(new Date().toUTCString().split(" ")[4] + " UTC");
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
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

                <Typography variant="h6">
                    HSFL Ground Station
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Typography variant="h6">
                    {time}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}