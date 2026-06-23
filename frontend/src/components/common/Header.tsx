import {
    AppBar,
    Toolbar,
    Typography,
    Box,
} from "@mui/material";

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box
                    component="img"
                    src="/hsfl.png"
                    alt="Logo"
                    sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                    }}
                />

                <Typography
                    variant="h6"
                    component="div"
                >
                    HTS Ground Station Network
                </Typography>
            </Toolbar>
        </AppBar>
    );
}