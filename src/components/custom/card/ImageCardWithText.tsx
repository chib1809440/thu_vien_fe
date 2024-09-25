import { Paper, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientLoading from "../../default/loading/GradientLoading/GradientLoading";
import useConfig from "../../../hooks/useConfig";

interface ImageCardProps {
    id: number | string,
    photo: string,
    isViewPhoto?: string,
    aspectRatio: string,
    title?: string,
    description?: string,
    limitDescription?: number,
    href?: string,
    isView?: boolean,
    isEffect?: boolean
    objectFit?: "contain" | "fill",
    isBorderRadius?: boolean,
    sound_us?: string,
    sound_uk?: string
}

const ImageCardWithText: React.FC<ImageCardProps> = ({ id, sound_uk, sound_us, isBorderRadius, objectFit, photo, isViewPhoto, title, isView, isEffect, href, description, limitDescription, aspectRatio }) => {

    const { borderRadius } = useConfig();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const handleImageLoaded = () => {
        setLoading(false);
    };

    return (
        <>
            <Paper
                sx={{
                    aspectRatio: aspectRatio,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: "pointer",
                    borderRadius: `${!isBorderRadius ? 0 : borderRadius}px`,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    ':hover': {
                        transform: isEffect ? "scale(1.02)" : "none",
                    }
                }}
            >
                {loading && <div className="placeholder"><GradientLoading /></div>}
                <img
                    src={photo}
                    alt="Example"
                    onLoad={handleImageLoaded}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: objectFit,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        borderRadius: `${!isBorderRadius ? 0 : borderRadius}px`
                    }}
                />
                {title && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            padding: '8px',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Typography sx={{ color: "white" }} variant="h5">{title}</Typography>
                    </Box>
                )}
            </Paper>
            {description && <Typography py={2} textAlign={"center"} variant="body2">{description.length > limitDescription! ? description.slice(0, limitDescription!) : description}</Typography>}
        </>
    );
}

export default ImageCardWithText;
