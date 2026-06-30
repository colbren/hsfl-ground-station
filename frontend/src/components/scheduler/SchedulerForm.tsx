import {
    Box,
    Button,
    MenuItem,
    TextField
} from "@mui/material";

import { useEffect, useState } from "react";

import { getSatellites } from "../../api/satellites";
import { getGroundStations } from "../../api/groundStations";

interface Props {
    onSearch: (
        satellite: number,
        groundStation: number,
        start: string,
        end: string
    ) => void;
}

export default function SchedulerForm({
    onSearch,
}: Props) {

    const [satellites, setSatellites] = useState<any[]>([]);
    const [groundStations, setGroundStations] =
        useState<any[]>([]);

    const [startDate, setStartDate] =
        useState("");

    const [startTime, setStartTime] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [endTime, setEndTime] =
        useState("");

    const [selectedSatellite, setSelectedSatellite] =
        useState<number | "">("");

    const [selectedGroundStation, setSelectedGroundStation] =
        useState<number | "">("");

    useEffect(() => {

        getSatellites()
            .then(setSatellites);

        getGroundStations()
            .then(setGroundStations);

    }, []);

    function handleSearch() {

        if (
            selectedSatellite === "" ||
            selectedGroundStation === ""
        ) {
            return;
        }

        const start = new Date(
            `${startDate}T${startTime}:00`
        ).toISOString();

        const end = new Date(
            `${endDate}T${endTime}:00`
        ).toISOString();

        onSearch(
            selectedSatellite,
            selectedGroundStation,
            start,
            end
        );
    }

    return (

        <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
        >

            <TextField
                type="date"
                value={startDate}
                onChange={(e) =>
                    setStartDate(
                        e.target.value
                    )
                }
            />

            <TextField
                type="time"
                value={startTime}
                onChange={(e) =>
                    setStartTime(
                        e.target.value
                    )
                }
            />

            <TextField
                type="date"
                value={endDate}
                onChange={(e) =>
                    setEndDate(
                        e.target.value
                    )
                }
            />

            <TextField
                type="time"
                value={endTime}
                onChange={(e) =>
                    setEndTime(
                        e.target.value
                    )
                }
            />

            <TextField
                select
                label="Satellite"
                sx={{ minWidth: 200 }}
                value={selectedSatellite}
                onChange={(e) =>
                    setSelectedSatellite(
                        Number(
                            e.target.value
                        )
                    )
                }
            >
                {satellites.map(
                    (satellite) => (

                        <MenuItem
                            key={
                                satellite.id
                            }
                            value={
                                satellite.id
                            }
                        >
                            {
                                satellite.name
                            }
                        </MenuItem>

                    )
                )}
            </TextField>

            <TextField
                select
                label="Ground Station"
                sx={{ minWidth: 200 }}
                value={
                    selectedGroundStation
                }
                onChange={(e) =>
                    setSelectedGroundStation(
                        Number(
                            e.target.value
                        )
                    )
                }
            >
                {groundStations.map(
                    (station) => (

                        <MenuItem
                            key={station.id}
                            value={station.id}
                        >
                            {station.name}
                        </MenuItem>

                    )
                )}
            </TextField>

            <Button
                variant="contained"
                onClick={handleSearch}
            >
                Search Passes
            </Button>

        </Box>

    );
}