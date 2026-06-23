import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            {/* spacer equal to navbar height */}
            <Toolbar />

            <List>
                <ListItemButton onClick={() => navigate("/")}>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/satellites")}>
                    <ListItemText primary="Satellites" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/groundstations")}>
                    <ListItemText primary="Ground Stations" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/scheduler")}>
                    <ListItemText primary="Scheduler" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/history")}>
                    <ListItemText primary="Pass History" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/passthrough")}>
                    <ListItemText primary="Pass Through" />
                </ListItemButton>
            </List>
        </Drawer>
    );
}