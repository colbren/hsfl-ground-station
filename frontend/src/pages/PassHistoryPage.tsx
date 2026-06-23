import { Box } from "@mui/material";
import { mockPasses } from "../data/mockPasses";
import PassCard from "../components/passes/PassCard";

export default function PassHistoryPage() {
    return (
        <Box>
            {mockPasses.map((pass) => (
                <PassCard key={pass.id} pass={pass} />
            ))}
        </Box>
    );
}