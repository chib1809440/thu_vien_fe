import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, Dialog, DialogContent, IconButton, Paper, useMediaQuery, useTheme } from "@mui/material";
import { IconVolume } from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import ImageCard from "../../../components/custom/card/ImageCard";
import { useAuth } from "../../../contexts/JWTContext";
import { useFetchTypeVoice } from "../../../hooks/services/type-voice/type-voice-query";
import { useFetchVoice } from "../../../hooks/services/voice/voice-query";
import { TPublications } from "../../../types/models/publications.type";
import MenuAddVoice, { MenuAddVoiceRef } from "./ui-components/MenuAddVoice";

const ImageDetailPage = ({
    open,
    onClose,
    publications,
}: {
    open: boolean;
    onClose: () => void;
    publications: TPublications | null;
}) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: voiceData } = useFetchVoice();
    const { data: typeVoiceData } = useFetchTypeVoice();
    const { user } = useAuth();
    const menuAddVoiceRef = useRef<MenuAddVoiceRef | null>(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const userId = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?._id;
    }, [user]);
    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);

    const handleClickChangeMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    const handleCloseDialog = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }

        menuAddVoiceRef.current?.muteAudio();
        onClose();

    };

    const handleCloseDialogIcon = () => {
        menuAddVoiceRef.current?.muteAudio();
        onClose();
    }

    return (
        <>
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialogIcon}
                    color="error"
                    sx={{ position: "absolute", right: 8, top: 2 }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Paper
                        sx={{
                            position: "relative",
                            p: 1,
                            border: `1px solid ${theme.palette.grey[300]}`,
                        }}
                        elevation={0}
                    >
                        <Box>
                            <ImageCard
                                id={publications?._id}
                                photo={
                                    publications?.path
                                        ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`
                                        : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}`
                                }
                                isViewPhoto={
                                    publications?.path
                                        ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`
                                        : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}`
                                }
                                aspectRatio={"16/9"}
                                objectFit="contain"
                                isView={true}
                                voices={
                                    voiceData?.data?.result.filter(
                                        (voice) =>
                                            (voice?.publicationId as TPublications)
                                                ?._id === publications._id &&
                                            voice?.isPublic
                                    ) || []
                                }
                                publications={publications}
                                handleClickChangeMenu={handleClickChangeMenu}
                            />
                        </Box>
                        <Box >
                            <Button
                                onClick={handleClickChangeMenu}
                                sx={{
                                    position: "absolute",
                                    top: { xs: -4, sm: -4, md: 10 },
                                    right: { xs: -12, sm: -12, md: 10 },
                                }}
                            >
                                <IconVolume
                                    style={{
                                        color: theme.palette.text.primary,
                                        width: isSmallScreen ? 18 : 24,
                                        height: isSmallScreen ? 18 : 24,
                                    }}
                                />
                                <MoreVertIcon sx={{ color: theme.palette.text.primary, width: isSmallScreen ? 18 : 24 }} />
                            </Button>
                        </Box>
                        <MenuAddVoice
                            ref={menuAddVoiceRef}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            voiceData={
                                voiceData?.data?.result.filter(
                                    (voice) =>
                                        (voice?.publicationId as TPublications)?._id ===
                                        publications._id && voice?.isPublic
                                ) || []
                            }
                            publicationsData={publications}
                            typeVoiceData={typeVoiceData?.data?.result}
                            currentUserId={userId}
                            userRole={userRole}
                        />
                    </Paper>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ImageDetailPage;