import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Dialog, DialogContent, Grid, IconButton, Paper, useTheme } from "@mui/material";
import { IconVolume } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import ImageCard from "../../../components/custom/card/ImageCard";
import StyledIconButton from "../../../components/default/button/StyledIconButton";
import { useFetchVoice } from "../../../hooks/services/voice/voice-query";
import { TPublications } from "../../../types/models/publications.type";
import MenuAddVoice from "./ui-components/MenuAddVoice";
import { useFetchTypeVoice } from "../../../hooks/services/type-voice/type-voice-query";
import { useAuth } from "../../../contexts/JWTContext";

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

    const userId = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?._id;
    }, [user]);    

    const handleClickChangeMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason === "backdropClick") {
                        return;
                    }
                    onClose();
                }}
                maxWidth="xl"
                fullWidth
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    color="error"
                    sx={{ position: "absolute", right: 8, top: 2 }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Grid item xs={12} sm={6} md={4} xl={3}>
                        <Paper
                            sx={{
                                position: "relative",
                                p: 1,
                                height: "100%",
                                border: `1px solid ${theme.palette.grey[300]}`,
                            }}
                            elevation={0}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "relative",
                                    height: "100%",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Paper sx={{ width: "100%", position: "relative" }}>
                                    <Box>
                                        <ImageCard
                                            id={publications?._id}
                                            photo={
                                                publications?.priviewImage
                                                    ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}`
                                                    : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`
                                            }
                                            isViewPhoto={
                                                publications?.priviewImage
                                                    ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}`
                                                    : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`
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
                                </Paper>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    height: "100%",
                                    px: 2,
                                    pb: 2,
                                }}
                            >
                                <StyledIconButton
                                    disableHoverEffect
                                    onClick={handleClickChangeMenu}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        margin: "8px",
                                        background: "none",
                                    }}
                                >
                                    <IconVolume
                                        fontSize="small"
                                        style={{ color: theme.palette.text.primary }}
                                    />
                                    <MoreVertIcon sx={{ color: theme.palette.text.primary }} />
                                </StyledIconButton>
                                {anchorEl && (
                                    <MenuAddVoice
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
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ImageDetailPage;