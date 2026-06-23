import { Card, CardContent, Typography } from "@mui/material";
import type { Satellite } from "../../types/satellite";

interface Props {
    satellite: Satellite;
}

export default function SatelliteCard({ satellite }: Props) {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    {satellite.name}
                </Typography>

                <Typography variant="body2">
                    NORAD: {satellite.noradId}
                </Typography>

                {satellite.downlinkFreq && (
                    <Typography variant="body2">
                        Downlink: {satellite.downlinkFreq} MHz
                    </Typography>
                )}

                {satellite.uplinkFreq && (
                    <Typography variant="body2">
                        Uplink: {satellite.uplinkFreq} MHz
                    </Typography>
                )}

                {satellite.mode && (
                    <Typography variant="body2">
                        Mode: {satellite.mode}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}