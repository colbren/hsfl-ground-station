import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import GroundStationCard from "../components/groundStations/GroundStationCard";
import { getGroundStations } from "../api/groundStations";
import type { GroundStation } from "../types/groundStation";

export default function GroundStationsPage() {
    const [stations, setStations] = useState<GroundStation[]>([]);

    useEffect(() => {
        getGroundStations()
            .then(setStations)
            .catch(console.error);
    }, []);

    return (
        <Box>
            {stations.map((station) => (
                <GroundStationCard
                    key={station.id}
                    station={station}
                />
            ))}
        </Box>
    );
}