import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function PassThrough() {
    const [packets, setPackets] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await fetch(
                "http://localhost:8000/api/passthrough/packets/"
            );

            const data = await response.json();

            setPackets(data);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Pass Through
            </Typography>

            <Paper sx={{ p: 2, maxHeight: 600, overflow: "auto" }}>
                {packets.map((packet, index) => (
                    <Typography
                        key={index}
                        sx={{ fontFamily: "monospace" }}
                    >
                        [{packet.timestamp}] {packet.data}
                    </Typography>
                ))}
            </Paper>
        </Box>
    );
}