import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import StatusBadge from "../common/StatusBadge";
import type { ScheduledPass } from "../../types/scheduler";

interface Props {
    passes: ScheduledPass[];
}

export default function RequestedPassesTable({
    passes
}: Props) {

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>
                    <TableRow>
                        <TableCell>Satellite</TableCell>
                        <TableCell>Ground Station</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {passes.map(pass => (

                        <TableRow key={pass.id}>

                            <TableCell>
                                {pass.satellite_name}
                            </TableCell>

                            <TableCell>
                                {pass.ground_station_name}
                            </TableCell>

                            <TableCell>
                                {new Date(
                                    pass.start_time
                                ).toLocaleString()}
                            </TableCell>

                            <TableCell>
                                {new Date(
                                    pass.end_time
                                ).toLocaleString()}
                            </TableCell>

                            <TableCell>
                                <StatusBadge
                                    status={pass.status}
                                />
                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );
}