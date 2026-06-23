import { Box, Card, CardContent, Typography } from "@mui/material";
import { mockDashboard } from "../data/mockDashboard";

export default function DashboardPage() {
    return (
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Satellites
                    </Typography>
                    <Typography variant="h4">
                        {mockDashboard.satellites}
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Ground Stations
                    </Typography>
                    <Typography variant="h4">
                        {mockDashboard.groundStations}
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Upcoming Passes
                    </Typography>
                    <Typography variant="h4">
                        {mockDashboard.upcomingPasses}
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6">
                        System Status
                    </Typography>
                    <Typography variant="h4">
                        {mockDashboard.systemStatus}
                    </Typography>
                </CardContent>
            </Card>

        </Box>
    );
}