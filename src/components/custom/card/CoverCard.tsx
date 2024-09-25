import { Box, Chip, Paper, Typography, styled, useTheme } from "@mui/material";
import ImageCard from "./ImageCard";
import { StyledHeading } from "../../default/typography";
import useConfig from "../../../hooks/useConfig";


interface CoverCardProps {
    title: string,
    photo: string,
    subtitle: string
}
function CoverCard({ title, photo, subtitle }: CoverCardProps) {
    const theme = useTheme()
    const { borderRadius } = useConfig()

    return (
        <Paper sx={{ border: `1px solid ${theme.palette.grey[200]}`, height: "300px", position: "relative" }}>
            <Box sx={{ background: "linear-gradient(11deg, rgba(102, 114, 251, 1) 0%, rgba(251, 86, 207, 1) 100%)", borderRadius: `${borderRadius}px ${borderRadius}px 0 0`, height: "140px" }}>

            </Box>
            <Box sx={{

                position: "absolute",
                height: "200px",
                top: "30%",
                left: "0",
                m: 4,
                transform: "translateY(-30%)",
                display: "flex",
                gap: 2,
                alignItems: "flex-end"
            }}>
                <Paper sx={{
                    aspectRatio: 3 / 4,
                    height: "200px",
                    borderRadius: '16px',
                    // border: `2px solid ${theme.palette.grey[300]}`,
                    // backgroundColor: "transparent",
                }}>
                    <ImageCard id={""} photo={photo} aspectRatio={"3/4"} />

                </Paper>
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: "column"
                }}>
                    <StyledHeading variant="h6">{title}</StyledHeading>
                    <Box>
                        <Chip variant="filled" label={subtitle} sx={{
                            color: theme.palette.text.secondary,
                            background: "linear-gradient(90deg, rgba(255, 159, 0, 1) 0%, rgba(255, 109, 0, 1) 100%)"
                        }} />
                    </Box>
                </Box>
            </Box>

        </Paper>
    );
}

export default CoverCard;