import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Grid,
    LinearProgress,
    Chip,
    Divider,
} from "@mui/material";

import axios from "axios";

export default function ScheduledPassDetail() {

    const { id } = useParams();

    const [pass, setPass] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        axios
            .get(`http://192.168.150.104:8000/api/scheduled-passes/${id}/`)
            .then((res) => setPass(res.data));
    }, [id]);

    useEffect(() => {

        if (!pass) return;

        function updateTimer() {

            const now = new Date();

            const start = new Date(pass.start_time);
            const end = new Date(pass.end_time);

            const total =
                end.getTime() - start.getTime();

            const elapsed =
                now.getTime() - start.getTime();

            const pct =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (elapsed / total) * 100
                    )
                );

            setProgress(pct);

            if (now < start) {

                const diff =
                    start.getTime() - now.getTime();

                setCountdown(
                    formatTime(diff) + " until AOS"
                );

            }
            else if (now > end) {

                setCountdown("Pass Complete");

            }
            else {

                const diff =
                    end.getTime() - now.getTime();

                setCountdown(
                    formatTime(diff) + " remaining"
                );

            }

        }

        updateTimer();

        const interval =
            setInterval(updateTimer, 1000);

        return () => clearInterval(interval);

    }, [pass]);

    function formatTime(ms: number) {

        const totalSeconds =
            Math.floor(ms / 1000);

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor((totalSeconds % 3600) / 60);

        const seconds =
            totalSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (!pass)
        return (
            <Typography p={3}>
                Loading...
            </Typography>
        );

    const durationMinutes =
        (
            (new Date(pass.end_time).getTime() -
                new Date(pass.start_time).getTime()) /
            60000
        ).toFixed(1);

    return (

        <Box p={3}>

            {/* HEADER */}

            <Paper sx={{ p: 3, mb: 3 }}>

                <Typography variant="h4">
                    {pass.satellite_name}
                </Typography>

                <Typography
                    color="text.secondary"
                    gutterBottom
                >
                    {pass.ground_station_name}
                </Typography>

                <Chip
                    label={pass.status}
                    color="primary"
                />

            </Paper>

            <Grid
                container
                spacing={2}
            >

                {/* PASS INFORMATION */}

                <Grid size={{ xs: 12, md: 6 }}>

                    <Paper sx={{ p: 3 }}>

                        <Typography variant="h6">
                            Pass Information
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography>
                            <strong>Start:</strong>
                        </Typography>

                        <Typography mb={2}>
                            {new Date(
                                pass.start_time
                            ).toLocaleString()}
                        </Typography>

                        <Typography>
                            <strong>End:</strong>
                        </Typography>

                        <Typography mb={2}>
                            {new Date(
                                pass.end_time
                            ).toLocaleString()}
                        </Typography>

                        <Typography>
                            <strong>Duration:</strong>
                        </Typography>

                        <Typography>
                            {durationMinutes} minutes
                        </Typography>

                    </Paper>

                </Grid>

                {/* COUNTDOWN */}

                <Grid size={{ xs: 12, md: 6 }}>

                    <Paper sx={{ p: 3 }}>

                        <Typography variant="h6">
                            Pass Status
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="h5"
                            gutterBottom
                        >
                            {countdown}
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 12,
                                borderRadius: 2,
                                mt: 3,
                            }}
                        />

                        <Typography
                            mt={2}
                            align="right"
                        >
                            {progress.toFixed(0)}%
                        </Typography>

                    </Paper>

                </Grid>

                {/* MAP */}

                <Grid size={{ xs: 12 }}>

                    <Paper
                        sx={{
                            p: 3,
                            height: 500,
                        }}
                    >

                        <Typography variant="h6">
                            Orbit Map
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            color="text.secondary"
                        >
                            Orbit map coming next.
                        </Typography>

                    </Paper>

                </Grid>

                {/* LINK */}

                <Grid size={{ xs: 6 }}>

                    <Paper sx={{ p: 3 }}>

                        <Typography variant="h6">
                            Downlink
                        </Typography>

                        <Typography
                            variant="h4"
                            mt={2}
                        >
                            0 B
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Paper sx={{ p: 3 }}>

                        <Typography variant="h6">
                            Uplink
                        </Typography>

                        <Typography
                            variant="h4"
                            mt={2}
                        >
                            0 B
                        </Typography>

                    </Paper>

                </Grid>

                {/* TLE */}

                <Grid size={{ xs: 12 }}>

                    <Paper sx={{ p: 3 }}>

                        <Typography variant="h6">
                            TLE Used
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            fontFamily="monospace"
                            color="text.secondary"
                        >
                            TLE will be added in the next
                            step.
                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

        </Box>

    );

}