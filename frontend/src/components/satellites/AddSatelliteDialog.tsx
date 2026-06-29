import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";

import { useState } from "react";

import { createSatellite } from "../../api/satellites";

type Props = {
    open: boolean;
    onClose: () => void;
    onAdded: () => void;
};

export default function AddSatelliteDialog({
    open,
    onClose,
    onAdded,
}: Props) {

    const [name, setName] =
        useState("");

    const [noradId, setNoradId] =
        useState("");

    async function handleSubmit() {

        try {

            await createSatellite({

                name,

                norad_id: Number(
                    noradId
                ),

            });

            setName("");
            setNoradId("");

            onAdded();

        } catch (err) {

            console.error(err);

        }
    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Add Satellite
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    mt={1}
                >

                    <TextField
                        label="Satellite Name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        label="NORAD ID"
                        value={noradId}
                        onChange={(e) =>
                            setNoradId(
                                e.target.value
                            )
                        }
                        type="number"
                        fullWidth
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Add
                </Button>

            </DialogActions>

        </Dialog>

    );
}