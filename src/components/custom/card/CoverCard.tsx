import { Box, Chip, Paper, Typography, useTheme } from "@mui/material";
import {
    IconFileWord,
    IconPdf,
    IconPhoto,
    IconPresentation,
    IconVideo
} from "@tabler/icons-react";
import useConfig from "../../../hooks/useConfig";
import { statusOptions, typeOptions } from "../../../utils/constants.utils";
import { getLabelFromOptions } from "../../../utils/object";
import StyledButton from "../../default/button/StyledButton";
import { StyledHeading } from "../../default/typography";
import ImageCard from "./ImageCard";
import Barcode from 'react-barcode';
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";

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
    title?: string;
    photo?: string;
    subtitle?: string;
    barcode?: string;
    status?: string;
    materialNames?: any[];
    categoryNames?: any[];
    authorNames?: any[];
    publisherNames?: any[];
    handleOpenView?: () => void;
    numberPage?: number;
    quantityShelves?: number;
    nameShelves?: string;
    mimetype?: string;
    handleOpenVideo?: () => void;
    handleOpenImage?: () => void;
    handleOpenWord?: () => void;
    path?: string;
    openLT?: boolean
}

const CoverCard = ({
    title,
    photo,
    subtitle,
    barcode,
    status,
    materialNames,
    categoryNames,
    authorNames,
    publisherNames,
    handleOpenView,
    quantityShelves,
    nameShelves,
    mimetype,
    handleOpenVideo,
    handleOpenImage,
    handleOpenWord,
    path,
    openLT = false
}: CoverCardProps) => {
    const theme = useTheme();
    const { borderRadius } = useConfig();

    return (
        <Paper
            sx={{
                border: `1px solid ${theme.palette.grey[200]}`,
                height: handleOpenView ? "500px" : "450px",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    background:
                        "linear-gradient(11deg, rgba(102, 114, 251, 1) 0%, rgba(251, 86, 207, 1) 100%)",
                    borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                    height: "140px",
                }}
            ></Box>
            <Box
                sx={{
                    position: "absolute",
                    height: "255px",
                    top: "20%",
                    left: "0",
                    m: 4,
                    transform: "translateY(-20%)",
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-end",
                }}
            >
                <Paper
                    sx={{
                        aspectRatio: 3 / 4,
                        height: "255px",
                        borderRadius: "16px",
                        // border: `2px solid ${theme.palette.grey[300]}`,
                        // backgroundColor: "transparent",
                        boxShadow: 3,
                        transition: "box-shadow 0.3s ease",
                    }}
                >
                    {/* <ImageCard id={""} isBorderRadius photo={photo} aspectRatio={"3/4"} objectFit={subtitle === "ấn phẩm mềm" ? "contain" : "fill"} /> */}
                    <ImageCard id={""} isBorderRadius photo={photo} aspectRatio={"3/4"} objectFit={"contain"} />
                
                </Paper>
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    pt: handleOpenView ? 2 : 1,
                    top: { xs: "50%", sm: handleOpenView ? "30%" : "35%" },
                    left: { xs: "0", sm: handleOpenView ? "20%" : "20%" },
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    flexDirection: "column",
                    ml: handleOpenView ? 5 : 3,
                }}
            >
                <Typography variant="h4" display={"flex"} alignItems={"center"}>
                    Tên ấn phẩm:
                    <StyledHeading ml={1} variant="h4">
                        {" "}
                        {title}
                    </StyledHeading>

                    {barcode && (
                        <div style={{ textAlign: "center", marginLeft: 35 }}>
                            <Typography variant="h4" display={"flex"} alignItems={"center"}>
                                Barcode:
                                <Barcode
                                    value={barcode}
                                    width={1}
                                    height={30}
                                    fontSize={10}
                                />
                            </Typography>
                        </div>
                    )}
                </Typography>

                {status && (
                    <Typography variant="h4" display={"flex"} mb={1}>
                        Trạng thái:
                        <StyledHeading ml={1} variant="h4">
                            {" "}
                            {getLabelFromOptions(statusOptions, status)}
                        </StyledHeading>
                        {nameShelves && (
                            <Typography variant="h4" display={"flex"} ml={2}>
                                Tên kệ - tủ:
                                <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}>
                                    {" "}
                                    {nameShelves}
                                </StyledHeading>
                            </Typography>
                        )}
                        {quantityShelves > 0 && (
                            <Typography variant="h4" display={"flex"} ml={2}>
                                Số lượng ấn phẩm trên kệ:
                                <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}>
                                    {" "}
                                    {quantityShelves}
                                </StyledHeading>
                            </Typography>
                        )}
                    </Typography>
                )}

                {subtitle && subtitle.length > 0 && (
                    <Typography variant="h4" display={"flex"} alignItems={"center"}>
                        Loại:
                        <Chip
                            variant="filled"
                            label={getLabelFromOptions(typeOptions, subtitle)}
                            sx={{
                                ml: 2,
                                color: theme.palette.text.dark,
                                background:
                                    "linear-gradient(90deg, rgba(255, 159, 0, 1) 0%, rgba(255, 109, 0, 1) 100%)",
                            }}
                        />
                    </Typography>
                )}

                {materialNames && materialNames.length > 0 && (
                    <Typography variant="h4" display={"flex"} alignItems={"center"}>
                        Dạng học liệu:
                        {materialNames.map((name, index) => (
                            <Chip
                                key={index}
                                variant="filled"
                                label={capitalizeFirstLetter(name)}
                                sx={{
                                    color: theme.palette.text.dark,
                                    background: getRandomPastelGradient(),
                                    ml: 2,
                                }}
                            />
                        ))}
                    </Typography>
                )}

                {categoryNames && categoryNames.length > 0 && (
                    <Typography variant="h4" display={"flex"} alignItems={"center"}>
                        Lĩnh vực:
                        {categoryNames.map((name, index) => (
                            <Chip
                                key={index}
                                variant="filled"
                                label={capitalizeFirstLetter(name)}
                                sx={{
                                    color: theme.palette.text.dark,
                                    background: getRandomPastelGradient(),
                                    ml: 2,
                                    textTransform: "capitalize",
                                }}
                            />
                        ))}
                    </Typography>
                )}

                {authorNames && authorNames.length > 0 && (
                    <Typography variant="h4" display={"flex"} alignItems={"center"}>
                        Tác giả:
                        {authorNames.map((name, index) => (
                            <Chip
                                key={index}
                                variant="filled"
                                label={name}
                                sx={{
                                    color: theme.palette.text.dark,
                                    background: getRandomPastelGradient(),
                                    ml: 2,
                                    textTransform: "capitalize",
                                }}
                            />
                        ))}
                    </Typography>
                )}

                {publisherNames && publisherNames.length > 0 && (
                    <Typography variant="h4" display={"flex"} alignItems={"center"}>
                        Nhà xuất bản:
                        {publisherNames.map((name, index) => (
                            <Chip
                                key={index}
                                variant="filled"
                                label={name}
                                sx={{
                                    color: theme.palette.text.dark,
                                    background: getRandomPastelGradient(),
                                    ml: 2,
                                    textTransform: "capitalize",
                                }}
                            />
                        ))}
                    </Typography>
                )}

                {subtitle === "ấn phẩm mềm" && (
                    <Box>
                        {mimetype === "application/pdf" && (
                            <Box sx={{ gap: 2 }}>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPdf stroke={2} />}
                                    variant="contained"
                                    sx={{ marginTop: 1, width: "150px" }}
                                    onClick={handleOpenView}
                                >
                                    Xem sách
                                </StyledButton>
                                {/* <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPdf stroke={2} />}
                                    variant="contained"
                                    sx={{ marginTop: 1, width: "150px", marginLeft: 2 }}
                                >
                                    <a href={path} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                                        Xem dạng pdf
                                    </a>

                                </StyledButton> */}
                            </Box>
                        )}
                        {[
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        ].includes(mimetype) && (
                                <>
                                    {
                                        openLT === false ?
                                            <StyledButton
                                                color="primary"
                                                size="small"
                                                startIcon={<IconFileWord stroke={2} />}
                                                variant="contained"
                                                sx={{ marginTop: 1, width: "150px" }}
                                            >
                                                <a href={path} download style={{ color: "white" }}>
                                                    Tải xuống
                                                </a>
                                            </StyledButton>

                                            : ""
                                    }
                                    {/* <StyledButton
                                        color="primary"
                                        size="small"
                                        startIcon={<IconFileWord stroke={2} />}
                                        variant="contained"
                                        sx={{ marginTop: 1, width: "150px" }}
                                        onClick={handleOpenWord}
                                    >
                                        Xem word
                                    </StyledButton> */}
                                </>
                            )}
                        {[
                            "video/mp4",
                            "video/x-matroska",
                            "video/webm",
                            "video/x-msvideo",
                        ].includes(mimetype) && (
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconVideo stroke={2} />}
                                    variant="contained"
                                    sx={{ marginTop: 1, width: "150px" }}
                                    onClick={handleOpenVideo}
                                >
                                    Xem video
                                </StyledButton>
                            )}
                        {[
                            "application/vnd.ms-powerpoint",
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        ].includes(mimetype) && (
                                <>
                                    {
                                        openLT === false ? <StyledButton
                                            color="primary"
                                            size="small"
                                            startIcon={<IconPresentation stroke={2} />}
                                            variant="contained"
                                            sx={{ marginTop: 1, width: "150px" }}
                                        >
                                            <a href={path} download style={{ color: "white" }}>
                                                Tải xuống
                                            </a>
                                        </StyledButton>
                                            : ""
                                    }
                                </>
                            )}
                        {[
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/bmp",
                            "image/webp",
                        ].includes(mimetype) && (
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPhoto stroke={2} />}
                                    variant="contained"
                                    sx={{ marginTop: 1, width: "150px" }}
                                    onClick={handleOpenImage}
                                >
                                    Xem hình ảnh
                                </StyledButton>
                            )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CoverCard;
