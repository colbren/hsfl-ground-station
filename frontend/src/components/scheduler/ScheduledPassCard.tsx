import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import type { ScheduledPass } from "../../types/scheduler";
import StatusBadge from "../common/StatusBadge";

interface Props {
    pass: ScheduledPass;
}

export default function ScheduledPassCard({ pass }: Props) {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">
                        {pass.satelliteName}
                    </Typography>

                    <StatusBadge status={pass.status} />
                </Box>

                <Typography variant="body2">
                    Station: {pass.groundStationName}
                </Typography>

                <Typography variant="body2">
                    Start: {new Date(pass.startTime).toLocaleString()}
                </Typography>

                <Typography variant="body2">
                    End: {new Date(pass.endTime).toLocaleString()}
                </Typography>

                <Box mt={2}>
                    <Button
                        variant="contained"
                        disabled={pass.status === "conflict"}
                    >
                        Schedule
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
}