import { Box, Toolbar } from "@mui/material";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    return (
        <Box sx={{ display: "flex" }}>
            <Navbar />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                {/* pushes content below navbar */}
                <Toolbar />

                {children}
            </Box>
        </Box>
    );
}