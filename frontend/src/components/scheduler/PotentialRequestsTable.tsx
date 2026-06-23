import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Box
} from "@mui/material";

import { useState } from "react";

import type { AvailablePass } from "../../types/scheduler";

interface Props {
    passes: AvailablePass[];
    onSubmit: (
        selectedPasses: AvailablePass[]
    ) => Promise<void>;
}

export default function PotentialRequestsTable({
    passes,
    onSubmit
}: Props) {

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    function handleToggle(id: number) {

        if (selectedIds.includes(id)) {

            setSelectedIds(
                selectedIds.filter(
                    selectedId => selectedId !== id
                )
            );

        } else {

            setSelectedIds(
                [...selectedIds, id]
            );

        }

    }

    async function handleSubmit() {

        console.log("Submit button pressed");

        const selectedPasses =
            passes.filter(
                pass => selectedIds.includes(pass.id)
            );

        console.log(selectedPasses);

        await onSubmit(selectedPasses);

        setSelectedIds([]);
    }

    return (
        <>

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Satellite</TableCell>
                            <TableCell>Ground Station</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Duration</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {passes.map(pass => (

                            <TableRow key={pass.id}>

                                <TableCell>

                                    <Checkbox
                                        checked={
                                            selectedIds.includes(
                                                pass.id
                                            )
                                        }
                                        onChange={() =>
                                            handleToggle(pass.id)
                                        }
                                    />

                                </TableCell>

                                <TableCell>
                                    {pass.satellite_name}
                                </TableCell>

                                <TableCell>
                                    {pass.ground_station_name}
                                </TableCell>

                                <TableCell>
                                    {
                                        new Date(
                                            pass.aos
                                        ).toLocaleString()
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        new Date(
                                            pass.los
                                        ).toLocaleString()
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        Math.round(
                                            pass.duration_seconds / 60
                                        )
                                    }
                                    {" min"}
                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

            <Box mt={2}>

                <Button
                    variant="contained"
                    disabled={
                        selectedIds.length === 0
                    }
                    onClick={handleSubmit}
                >
                    Submit Selected Requests
                </Button>

            </Box>

        </>
    );
}