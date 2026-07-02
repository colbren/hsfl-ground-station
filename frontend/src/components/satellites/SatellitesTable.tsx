import {
    Box,
    Button,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import {
    useState,
} from "react";

import ExploreIcon from "@mui/icons-material/Explore";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";

import {
    deleteSatellite,
    updateTLE,
    getSatellites,
} from "../../api/satellites";

type Props = {
    satellites: any[];
    reload: () => void;
};

export default function SatellitesTable({
    satellites,
    reload,
}: Props) {

    const navigate = useNavigate();

    const list = Array.isArray(satellites)
        ? satellites
        : [];

    const [expandedId, setExpandedId] =
        useState<number | null>(null);

    const [loadingId, setLoadingId] =
        useState<number | null>(null);

    const [editOpen, setEditOpen] =
        useState(false);

    const [editingSat, setEditingSat] =
        useState<any | null>(null);

    const [tle1, setTle1] =
        useState("");

    const [tle2, setTle2] =
        useState("");

    function toggleRow(id: number) {
        setExpandedId(prev =>
            prev === id ? null : id
        );
    }

    async function handleUpdate(id: number) {
        try {
            setLoadingId(id);
            await updateTLE(id);
            reload();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Delete satellite?"))
            return;

        try {
            await deleteSatellite(id);
            reload();
        } catch (err) {
            console.error(err);
        }
    }

    function openEdit(sat: any) {
        setEditingSat(sat);
        setTle1(sat.tle_line1 || "");
        setTle2(sat.tle_line2 || "");
        setEditOpen(true);
    }

    async function saveTLE() {
        if (!editingSat) return;

        try {
            await fetch(
                `http://192.168.150.104:8000/api/satellites/${editingSat.id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        "X-CSRFToken":
                            getCookie("csrftoken") ||
                            "",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        tle_line1: tle1,
                        tle_line2: tle2,
                    }),
                }
            );

            setEditOpen(false);
            reload();
        } catch (err) {
            console.error(
                "Failed to update TLE manually",
                err
            );
        }
    }

    function getCookie(name: string) {
        let cookieValue: string | null = null;

        if (
            document.cookie &&
            document.cookie !== ""
        ) {
            const cookies =
                document.cookie.split(";");

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();

                if (
                    cookie.startsWith(name + "=")
                ) {
                    cookieValue =
                        decodeURIComponent(
                            cookie.substring(
                                name.length + 1
                            )
                        );
                    break;
                }
            }
        }

        return cookieValue;
    }

    return (
        <>

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                NORAD ID
                            </TableCell>

                            <TableCell>
                                TLE Updated
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell align="right">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {list.map((sat: any) => (

                            <>
                                {/* MAIN ROW */}
                                <TableRow
                                    key={sat.id}
                                    hover
                                    onClick={() =>
                                        toggleRow(
                                            sat.id
                                        )
                                    }
                                    style={{
                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <TableCell>
                                        {sat.name}
                                    </TableCell>

                                    <TableCell>
                                        {
                                            sat.norad_id
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {sat.tle_updated
                                            ? new Date(
                                                  sat.tle_updated
                                              ).toLocaleString()
                                            : "Never"}
                                    </TableCell>

                                    <TableCell>
                                        {sat.enabled
                                            ? "Enabled"
                                            : "Disabled"}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Tooltip title="Track">

                                            <IconButton
                                                onClick={(
                                                    e
                                                ) => {
                                                    e.stopPropagation();
                                                    navigate(
                                                        `/satellites/${sat.id}`
                                                    );
                                                }}
                                            >
                                                <ExploreIcon />
                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Update TLE">

                                            <IconButton
                                                onClick={(
                                                    e
                                                ) => {
                                                    e.stopPropagation();
                                                    handleUpdate(
                                                        sat.id
                                                    );
                                                }}
                                                disabled={
                                                    loadingId ===
                                                    sat.id
                                                }
                                            >
                                                <RefreshIcon />
                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Edit TLE">

                                            <IconButton
                                                onClick={(
                                                    e
                                                ) => {
                                                    e.stopPropagation();
                                                    openEdit(
                                                        sat
                                                    );
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={(
                                                    e
                                                ) => {
                                                    e.stopPropagation();
                                                    handleDelete(
                                                        sat.id
                                                    );
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                        </Tooltip>

                                    </TableCell>

                                </TableRow>

                                {/* EXPANDABLE TLE ROW */}
                                <TableRow>

                                    <TableCell
                                        colSpan={5}
                                        style={{
                                            padding: 0,
                                        }}
                                    >

                                        <Collapse
                                            in={
                                                expandedId ===
                                                sat.id
                                            }
                                        >

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    background:
                                                        "#0f172a10",
                                                    fontFamily:
                                                        "monospace",
                                                }}
                                            >

                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    TLE Line 1
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mb: 1,
                                                    }}
                                                >
                                                    {
                                                        sat.tle_line1
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    TLE Line 2
                                                </Typography>

                                                <Typography>
                                                    {
                                                        sat.tle_line2
                                                    }
                                                </Typography>

                                            </Box>

                                        </Collapse>

                                    </TableCell>

                                </TableRow>

                            </>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

            {/* EDIT TLE DIALOG */}
            <Dialog
                open={editOpen}
                onClose={() =>
                    setEditOpen(false)
                }
                fullWidth
                maxWidth="md"
            >

                <DialogTitle>
                    Edit TLE
                </DialogTitle>

                <DialogContent>

                    <TextField
                        fullWidth
                        label="TLE Line 1"
                        value={tle1}
                        onChange={(e) =>
                            setTle1(e.target.value)
                        }
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="TLE Line 2"
                        value={tle2}
                        onChange={(e) =>
                            setTle2(e.target.value)
                        }
                    />

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setEditOpen(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={saveTLE}
                    >
                        Save
                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
}