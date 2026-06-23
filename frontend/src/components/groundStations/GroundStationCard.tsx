import { Card, CardContent, Typography } from "@mui/material";
import type { GroundStation } from "../../types/groundStation";
import StatusBadge from "../common/StatusBadge";

interface Props {
    station: GroundStation;
}

export default function GroundStationCard({ station }: Props) {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    {station.name}
                </Typography>

                <StatusBadge status={station.status} />

                {station.latitude && station.longitude && (
                    <Typography variant="body2">
                        Lat: {station.latitude}, Lon: {station.longitude}
                    </Typography>
                )}

                {station.altitudeM && (
                    <Typography variant="body2">
                        Altitude: {station.altitudeM} m
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}