import { Box, Chip, Paper, Typography, useTheme } from "@mui/material";
import { IconBook } from "@tabler/icons-react";
import useConfig from "../../../hooks/useConfig";
import StyledButton from "../../default/button/StyledButton";
import { StyledHeading } from "../../default/typography";
import ImageCard from "./ImageCard";

const pastelGradients = [
    "linear-gradient(90deg, rgba(144, 238, 144, 1) 0%, rgba(173, 216, 230, 1) 100%)",
    "linear-gradient(90deg, rgba(221, 160, 221, 1) 0%, rgba(255, 192, 203, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 255, 224, 1) 0%, rgba(255, 165, 0, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 192, 203, 1) 0%, rgba(255, 99, 71, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 99, 71, 1) 0%, rgba(255, 255, 224, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 165, 0, 1) 0%, rgba(255, 192, 203, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 192, 203, 1) 0%, rgba(255, 99, 71, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 255, 224, 1) 0%, rgba(255, 165, 0, 1) 100%)",
    "linear-gradient(90deg, rgba(135, 206, 235, 1) 0%, rgba(0, 255, 255, 1) 100%)",
    "linear-gradient(90deg, rgba(221, 160, 221, 1) 0%, rgba(255, 192, 203, 1) 100%)",
];

const getRandomPastelGradient = () => {
    return pastelGradients[Math.floor(Math.random() * pastelGradients.length)];
};

interface CoverCardProps {
    title?: string,
    photo?: string,
    subtitle?: string,
    barcode?: string,
    status?: string,
    materialNames?: any[],
    categoryNames?: any[],
    authorNames?: any[],
    publisherNames?: any[],
    handleOpenView?: () => void;
    numberPage?: number;
}

const CoverCard = ({ title, photo, subtitle, barcode, status, materialNames, categoryNames, authorNames, publisherNames, handleOpenView, numberPage }: CoverCardProps) => {
    const theme = useTheme()
    const { borderRadius } = useConfig();


    return (
        <Paper sx={{ border: `1px solid ${theme.palette.grey[200]}`, height: handleOpenView ? "500px" : "300px", position: "relative" }}>
            <Box sx={{ background: "linear-gradient(11deg, rgba(102, 114, 251, 1) 0%, rgba(251, 86, 207, 1) 100%)", borderRadius: `${borderRadius}px ${borderRadius}px 0 0`, height: "140px" }}>

            </Box>
            <Box sx={{

                position: "absolute",
                height: "255px",
                top: "20%",
                left: "0",
                m: 4,
                transform: "translateY(-20%)",
                display: "flex",
                gap: 2,
                alignItems: "flex-end"
            }}>
                <Paper sx={{
                    aspectRatio: 3 / 4,
                    height: "255px",
                    borderRadius: '16px',
                    // border: `2px solid ${theme.palette.grey[300]}`,
                    // backgroundColor: "transparent",
                }}>
                    <ImageCard id={""} photo={photo} aspectRatio={"3/4"} />

                </Paper>
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: "column",
                }}>
                    <Typography variant="h4" display={"flex"} >
                        Tên ấn phẩm:
                        <StyledHeading ml={1} variant="h4"> {title}</StyledHeading>
                    </Typography>
                    {
                        barcode && (
                            <Typography variant="h4" display={"flex"}>
                                Barcode:
                                <StyledHeading ml={1} variant="h4"> {barcode}</StyledHeading>
                            </Typography>
                        )
                    }
                    {
                        status && (
                            <Typography variant="h4" display={"flex"} >
                                Trạng thái:
                                <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}> {status}</StyledHeading>
                            </Typography>
                        )
                    }

                    <Box sx={{
                        textTransform: "capitalize", mb: handleOpenView ? 0 : 2,
                        display: "flex", flexWrap: "wrap"
                    }}>
                        {subtitle && subtitle.length > 0 && (
                            <Chip variant="filled" label={subtitle} sx={{
                                margin: '0.5rem',
                                color: theme.palette.text.dark,
                                background: "linear-gradient(90deg, rgba(255, 159, 0, 1) 0%, rgba(255, 109, 0, 1) 100%)",
                            }} />
                        )}
                        {materialNames && materialNames.length > 0 && (
                            materialNames.map((name, index) => (
                                <Chip
                                    key={index}
                                    variant="filled"
                                    label={name}
                                    sx={{
                                        color: theme.palette.text.dark,
                                        background: getRandomPastelGradient(),
                                        margin: '0.5rem'
                                    }}
                                />
                            ))
                        )}
                        {categoryNames && categoryNames.length > 0 && (
                            categoryNames.map((name, index) => (
                                <Chip
                                    key={index}
                                    variant="filled"
                                    label={name}
                                    sx={{
                                        color: theme.palette.text.dark,
                                        background: getRandomPastelGradient(),
                                        margin: '0.5rem'
                                    }}
                                />
                            ))
                        )}
                        {authorNames && authorNames.length > 0 && (
                            authorNames.map((name, index) => (
                                <Chip
                                    key={index}
                                    variant="filled"
                                    label={name}
                                    sx={{
                                        color: theme.palette.text.dark,
                                        background: getRandomPastelGradient(),
                                        margin: '0.5rem'
                                    }}
                                />
                            ))
                        )}
                        {publisherNames && publisherNames.length > 0 && (
                            publisherNames.map((name, index) => (
                                <Chip
                                    key={index}
                                    variant="filled"
                                    label={name}
                                    sx={{
                                        color: theme.palette.text.dark,
                                        background: getRandomPastelGradient(),
                                        margin: '0.5rem'
                                    }}
                                />
                            ))
                        )}
                    </Box>
                    {
                        subtitle === 'ấn phẩm mềm' && handleOpenView && numberPage > 0 && (
                            <StyledButton
                                color="primary"
                                size="small"
                                startIcon={<IconBook stroke={2} />}
                                variant="contained"
                                sx={{ marginTop: 1 }}
                                onClick={handleOpenView}
                            >
                                Xem sách
                            </StyledButton>)
                    }
                </Box>
            </Box>

        </Paper>
    );
}

export default CoverCard;