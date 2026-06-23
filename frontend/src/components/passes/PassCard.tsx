import { Card, CardContent, Typography } from "@mui/material";
import type { Pass } from "../../types/pass";

interface Props {
    pass: Pass;
}

export default function PassCard({ pass }: Props) {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    {pass.satelliteName}
                </Typography>

                <Typography variant="body2">
                    Ground Station: {pass.groundStationName}
                </Typography>

                <Typography variant="body2">
                    Start: {new Date(pass.startTime).toLocaleString()}
                </Typography>

                <Typography variant="body2">
                    End: {new Date(pass.endTime).toLocaleString()}
                </Typography>

                <Typography variant="body2">
                    Max Elevation: {pass.maxElevationDeg}°
                </Typography>
            </CardContent>
        </Card>
    );
}