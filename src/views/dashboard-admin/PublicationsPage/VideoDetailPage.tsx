import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, Grid, IconButton, Paper, Typography, useTheme } from "@mui/material";
import TypographyBorderLeft from "../../../components/custom/typography/TypographyBorderLeft";
import VideoJS from '../../../components/custom/videojs';
import { StyledHeading } from "../../../components/default/typography";
import { TPublications } from "../../../types/models/publications.type";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VideoDetailPage = ({ open, onClose, publications }: { open: boolean; onClose: () => void; publications: TPublications | null }) => {
    const theme = useTheme();
    const [reloadKey, setReloadKey] = useState(0);
    const [duration, setDuration] = useState(0);
    const { id } = useParams()

    useEffect(() => {
        setReloadKey(prevKey => prevKey + 1)
    }, [id]);

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason === 'backdropClick') {
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
                color='error'
                sx={{ position: 'absolute', right: 8, top: 2 }}
            >

                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Grid container spacing={2} sx={{ px: { xs: 0, sm: 0, md: 4 } }}>
                    <Grid item xs={12} sm={8}>
                        <StyledHeading variant="h5" textTransform={"uppercase"}>VIDEO: {publications?.name}</StyledHeading>
                    </Grid>

                    <Grid item xs={12} >
                        <Grid container spacing={3} >
                            <Grid item xs={12} sm={12} >
                                <Box sx={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                                    <Paper sx={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "transparent" }}>
                                        {
                                            publications?.path && <VideoJS src={`${import.meta.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`} key={reloadKey} handleDuration={setDuration} />
                                        }

                                    </Paper>
                                    <TypographyBorderLeft title="Giới thiệu" />
                                    <Paper sx={{ width: "100%", border: `1px solid ${theme.palette.grey[300]}`, p: 2 }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4} sm={4} md={2}>
                                                    <Typography variant="h4" ><span className="bold-text">Dạng học liệu</span></Typography>
                                                </Grid>
                                                <Grid item xs={8} sm={8} md={10}>
                                                    <Typography variant="body1">Video</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4} sm={4} md={2}>
                                                    <Typography variant="h4" ><span className="bold-text">Phát hành</span></Typography>
                                                </Grid>
                                                <Grid item xs={8} sm={8} md={10}>
                                                    <Typography variant="body1">Công ty Cổ phần Giải pháp Công nghệ GD Việt Nam</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog >

    );
}

export default VideoDetailPage;
