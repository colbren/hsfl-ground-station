import {
    Box,
    Button,
    Divider,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import { getSatellites } from "../api/satellites";

import SatellitesTable from "../components/satellites/SatellitesTable";
import AddSatelliteDialog from "../components/satellites/AddSatelliteDialog";

export default function SatellitesPage() {

    const [satellites, setSatellites] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    async function loadSatellites() {
        try {
            const data = await getSatellites();

            // Handles both paginated and non-paginated APIs
            const list = Array.isArray(data)
                ? data
                : data?.results ?? [];

            setSatellites(list);
        } catch (err) {
            console.error(err);
            setSatellites([]);
        }
    }

    useEffect(() => {
        loadSatellites();
    }, []);

    return (
        <Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4">
                    Satellites
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    Add Satellite
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <SatellitesTable
                satellites={satellites}
                reload={loadSatellites}
            />

            <AddSatelliteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onAdded={() => {
                    setDialogOpen(false);
                    loadSatellites();
                }}
            />

        </Box>
    );
}