import {
    Box,
    Divider,
    Typography
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import SchedulerForm from "../components/scheduler/SchedulerForm";
import PotentialRequestsTable from "../components/scheduler/PotentialRequestsTable";
import RequestedPassesTable from "../components/scheduler/RequestedPassesTable";

import {
    searchPasses,
    getScheduledPasses,
    createScheduledPass
} from "../api/scheduler";

export default function SchedulerPage() {

    const [availablePasses, setAvailablePasses] =
        useState<any[]>([]);

    const [requestedPasses, setRequestedPasses] =
        useState<any[]>([]);

    useEffect(() => {
        getScheduledPasses()
            .then(setRequestedPasses);
    }, []);

    function handleSearch(
        satellite: number,
        groundStation: number,
        start: string,
        end: string
    ) {
        searchPasses(
            satellite,
            groundStation,
            start,
            end
        ).then(setAvailablePasses);
    }

    async function handleSubmitRequests(selectedPasses: any[]) {

        console.log("SELECTED PASSES:", selectedPasses);

        for (const pass of selectedPasses) {
            console.log("🔥 RAW PASS OBJECT:", pass);

            const payload = {
                satellite: pass.satellite_id,
                ground_station: pass.ground_station_id,
                start_time: pass.aos,
                end_time: pass.los,
            };

            console.log("SENDING PAYLOAD:", payload);

            try {
                const res = await createScheduledPass(payload);
                console.log("SUCCESS:", res.data);
            } catch (err: any) {
                console.log("❌ STATUS:", err.response?.status);
                console.log("❌ DATA:", err.response?.data);
                console.log("❌ FULL ERROR:", err);
            }
        }

        setAvailablePasses(
            availablePasses.filter(
                pass =>
                    !selectedPasses.some(
                        selected => selected.id === pass.id
                    )
            )
        );

        getScheduledPasses()
            .then(setRequestedPasses);
    }

    return (
        <Box>

            <Typography variant="h4">
                Scheduler
            </Typography>

            <SchedulerForm
                onSearch={handleSearch}
            />

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5">
                Potential Requests
            </Typography>

            <PotentialRequestsTable
                passes={availablePasses}
                onSubmit={handleSubmitRequests}
            />

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5">
                Requested Passes
            </Typography>

            <RequestedPassesTable
                passes={requestedPasses}
            />

        </Box>
    );
}