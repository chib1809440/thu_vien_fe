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
                flexDirection: { xs: "column", sm: "column", md: "row" },
                mt: { xs: 2, sm: 4, md: 0 }
            }}>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} textTransform={"uppercase"}>CTY CP Giải pháp Công nghệ GD Việt Nam</Typography>
                </Box>


                <Box justifyContent={"flex-end"} alignItems={"center"} >
                    {/* <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="body2" textTransform={"uppercase"}>Điều khoản</Typography>
                        <Typography variant="body2">|</Typography>
                        <Typography variant="body2" textTransform={"uppercase"}>Hướng dẫn</Typography>
                    </Box> */}
                    <Typography variant="body2" textTransform={"uppercase"}>HotLine: <strong>0939919639</strong></Typography>
                </Box>
            </Toolbar>
        </Paper >
    )
}