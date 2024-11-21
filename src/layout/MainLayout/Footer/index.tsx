import { Box, Button, Paper, Toolbar, Typography, useTheme } from "@mui/material";

export default function Footer() {

    return (
        <Paper
            // position="fixed"
            // elevation={0}
            sx={{
                backgroundColor: "transparent",
                p: 0,
                m: 0,
                height: `8vh`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

            }}>
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
            }}>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} textTransform={"uppercase"}>CTY CP Giải pháp Công nghệ GD Việt Nam</Typography>
                </Box>


                <Box justifyContent={"flex-end"} alignItems={"center"} sx={{ display: "flex", gap: 1 }}>
                    <Button variant="text">
                        <Typography variant="body2" textTransform={"uppercase"}>Điều khoản</Typography>
                    </Button>
                    <Typography variant="body2">|</Typography>
                    <Button variant="text">
                        <Typography variant="body2" textTransform={"uppercase"}>Hướng dẫn</Typography>
                    </Button>
                </Box>
            </Toolbar>
        </Paper >
    )
}