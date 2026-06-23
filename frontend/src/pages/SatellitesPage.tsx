import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import SatelliteCard from "../components/satellites/SatelliteCard";
import { getSatellites } from "../api/satellites";

export default function SatellitesPage() {
    const [satellites, setSatellites] = useState<any[]>([]);

    useEffect(() => {
        async function loadSatellites() {
            const data = await getSatellites();
            setSatellites(data);
        }

        loadSatellites();
    }, []);

    return (
        <Box>
            {satellites.map((sat) => (
                <SatelliteCard
                    key={sat.id}
                    satellite={sat}
                />
            ))}
        </Box>
    );
}