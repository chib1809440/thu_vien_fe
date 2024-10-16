import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Dialog, DialogContent, Grid, IconButton, Paper, useTheme } from "@mui/material";
import { IconVolume } from '@tabler/icons-react';
import { useState } from 'react';
import ImageCard from '../../../components/custom/card/ImageCard';
import StyledIconButton from '../../../components/default/button/StyledIconButton';
import { TPublications } from "../../../types/models/publications.type";
import MenuAddVoice from './ui-components/MenuAddVoice';

const ImageDetailPage = ({ open, onClose, publications }: { open: boolean; onClose: () => void; publications: TPublications | null }) => {
    const theme = useTheme();
    const [openAddVoice, setOpenAddVoice] = useState(false)

    const handleClickChangeMenu = (event) => {
        console.log(event);
        setOpenAddVoice(true)
    };

    return (
        <>
            {openAddVoice && (<MenuAddVoice />)}

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
                                    <Box >
                                        <ImageCard
                                            id={publications?._id}
                                            photo={
                                                publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`
                                            }
                                            isViewPhoto={
                                                publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`
                                            }
                                            aspectRatio={"16/9"}
                                            objectFit="contain"
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
                                    <IconVolume fontSize="small" style={{ color: theme.palette.text.primary }} />     <MoreVertIcon sx={{ color: theme.palette.text.primary }} />
                                </StyledIconButton>


                            </Box>
                        </Paper>
                    </Grid>

                </DialogContent>
            </Dialog>
        </>
    );
}

export default ImageDetailPage;
