import { Box, Typography, useTheme } from "@mui/material";
interface Props{
    title:string
}
function TypographyBorderLeft({title}:Props) {
    const theme = useTheme()
    return (
        <Box sx={{ borderLeft: `6px solid ${theme.palette.primary.dark}`, px: 1 }}>
            <Typography variant="h6" textTransform={"uppercase"}>{title}</Typography>
        </Box>
    );
}

export default TypographyBorderLeft;