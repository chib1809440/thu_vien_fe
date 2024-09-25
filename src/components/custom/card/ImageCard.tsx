import {
    Avatar,
    Box,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    ListItemIcon,
    Menu,
    MenuItem,
    Modal,
    Pagination,
    PaginationItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import GradientLoading from "../../default/loading/GradientLoading/GradientLoading";
import StyledIconButton from "../../default/button/StyledIconButton";
import { IconBrandRedux, IconVolume, IconZoomReplace } from "@tabler/icons-react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
    isEffect?: boolean,
    objectFit?: "contain" | "fill",
    isBorderRadius?: boolean,
    sound_us?: string,
    sound_uk?: string,
    filterTypeVoiceId?: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ id, filterTypeVoiceId, isBorderRadius, objectFit, photo, isViewPhoto, title, isView, isEffect, href, description, limitDescription, aspectRatio }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [typeVoiceId, setTypeVoiceId] = useState<number>(filterTypeVoiceId);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    const handleImageLoaded = () => {
        if (loading) {
            setLoading(false);

        }
    };
    const open = Boolean(anchorEl);

    const openImageViewer = useCallback((index: number) => {
        if (isView) {
            setCurrentImage(index);
            setIsViewerOpen(true);
        }
    }, [isView]);
    useEffect(() => {
        if (photo && loading === false) {

            setLoading(true);
        }
    }, [photo])

    const closeImageViewer = () => {
        setIsViewerOpen(false);
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        // Kiểm tra nếu scale > 1 thì mới cho phép kéo ảnh
        if (scale > 1) {
            event.preventDefault();
            setIsDragging(true);
            setStartPos({ x: event.clientX - translate.x, y: event.clientY - translate.y });
        }
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDragging || scale <= 1) return; // Chỉ cho phép di chuyển khi đang kéo và scale > 1

        const newX = event.clientX - startPos.x;
        const newY = event.clientY - startPos.y;
        const maxTranslateX = (scale - 1) * (window.innerWidth / 2);
        const maxTranslateY = (scale - 1) * (window.innerHeight / 2);

        setTranslate({
            x: Math.max(Math.min(newX, maxTranslateX), -maxTranslateX),
            y: Math.max(Math.min(newY, maxTranslateY), -maxTranslateY),
        });
    };

    const handleMouseUp = () => {
        console.log(-1);

        if (isDragging) {
            setIsDragging(false);
        }
    };

    const handleMouseLeave = () => {
        console.log(1);

        if (isDragging) {
            setIsDragging(false);
        }
    };

    const handleWheel = (event: React.WheelEvent) => {
        const newScale = scale - event.deltaY * 0.001;
        setScale(Math.min(Math.max(newScale, 0.5), 3));
        setTranslate({ x: 0, y: 0 });
    };
    const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
    const [touchStartScale, setTouchStartScale] = useState<number>(1);
    const handleTouchStart = (event: React.TouchEvent) => {
        event.preventDefault();
        if (event.touches.length === 2) {
            // Calculate the initial distance between touch points
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const initialDistance = Math.sqrt(dx * dx + dy * dy);

            setTouchStartDistance(initialDistance);
            setTouchStartScale(scale);
        }
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        // Ngăn chặn sự kiện mặc định
        event.preventDefault();

        if (event.touches.length === 2 && scale > 1) {
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);

            if (touchStartDistance !== null) {
                const newScale = touchStartScale * (currentDistance / touchStartDistance);
                setScale(Math.min(Math.max(newScale, 0.5), 3));
                setTranslate({ x: 0, y: 0 });
            }
        }
    };

    const handleTouchEnd = () => {
        console.log(5);

        if (isDragging) {
            setIsDragging(false);
        }
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.3, 3));
        setTranslate({ x: 0, y: 0 });
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.4, 0.5));
        setTranslate({ x: 0, y: 0 });
    };

    const handleClickChangeMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);

    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangeVoice = (id: number) => {
        setTypeVoiceId(id);
    };
    const handleClickVoice = (audioUrl: string) => {
        // Stop the currently playing audio if it exists
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Optional: Reset to start
        }

        // Create a new Audio object for the new audio URL
        const newAudio = new Audio(process.env.REACT_APP_BASE_API_URL_FILE + audioUrl);

        // Play the new audio
        newAudio.play();

        // Update the currentAudio state to the new audio
        setCurrentAudio(newAudio);
    };
    return (
        <>
            <Paper
                sx={{
                    aspectRatio: aspectRatio,
                    overflow: 'hidden',
                    position: 'relative',

                    cursor: "pointer",
                    borderRadius: `${!isBorderRadius ? 0 : '8px'}`,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    backgroundColor: "transparent",
                    ':hover': {
                        transform: isEffect ? "scale(1.02)" : "none",
                    }
                }}
            >
                {loading && <div className="placeholder">
                    <GradientLoading />

                </div>}
                <Box sx={{ display: loading ? 'none' : 'block' }}>
                    <img
                        src={photo}
                        alt="Example"
                        onClick={() => openImageViewer(0)}
                        onLoad={handleImageLoaded}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: objectFit,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            borderRadius: `${!isBorderRadius ? 0 : '8px'}`
                        }}
                    />
                </Box>

            </Paper>
            {title && <Typography pt={2} textAlign={description ? "left" : "center"} variant="h6" fontSize={"16px !important"}>{title}</Typography>}
            {description && <Typography py={2} textAlign={"center"} variant="body2">{description.length > limitDescription! ? description.slice(0, limitDescription!) : description}</Typography>}

            <Modal
                open={isViewerOpen}
                onClose={closeImageViewer}
                aria-labelledby="image-modal-title"
                aria-describedby="image-modal-description"
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', // Đặt nền modal thành màu đen
                    border: '5px solid black',
                }}
            >
                <Box
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                    sx={{
                        position: 'relative',
                        width: '90vw',
                        height: '90vh',
                        backgroundColor: 'black',
                        border: '5px solid black',
                        outline: 'none',
                        overflow: 'hidden', // Đảm bảo phần tử không bị kéo ra ngoài
                        cursor: isDragging ? 'grabbing' : 'grab',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        onClick={closeImageViewer}
                        sx={{
                            position: 'fixed',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            zIndex: 1,
                            ':hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <IconButton
                        onClick={zoomIn}
                        sx={{
                            position: 'fixed',
                            top: 16,
                            right: 105,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            zIndex: 1,
                            ':hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <ZoomInIcon />
                    </IconButton>

                    <IconButton
                        onClick={zoomOut}
                        sx={{
                            position: 'fixed',
                            top: 16,
                            right: 60,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            zIndex: 1,
                            ':hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <ZoomOutIcon />
                    </IconButton>
                    <img
                        src={isViewPhoto}
                        alt="Large view"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
                            transition: 'transform 0.1s ease-out',
                            borderRadius: `${!isBorderRadius ? 0 : '8px'}`
                        }}
                    />
                    {
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            //  onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* <MenuItem onClick={handleOpenAddVoiceToDialog}>
                            <ListItemIcon>
                                <IconPlus />
                            </ListItemIcon>
                            Thêm voice
                        </MenuItem> */}

                        </Menu>
                    }
                </Box>
            </Modal>
        </>
    );
}

export default ImageCard;
