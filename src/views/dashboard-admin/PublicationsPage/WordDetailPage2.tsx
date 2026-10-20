import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TPublications } from '../../../types/models/publications.type';
import publicationsService from '../../../_apis/services/publications.service';
import Word from './ui-components/Word';

const WordDetailPage2 = ({
    open,
    onClose,
    publications,
}: {
    open: boolean;
    onClose: () => void;
    publications: TPublications | null;
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };

    const handleSave = async (documentData: ArrayBuffer) => {
        console.log(new Blob([documentData]));


        if (documentData && publications?._id) {
            try {
                const formData = new FormData();
                formData.append('file', new Blob([documentData]), 'document.docx');

                const response = await publicationsService.updateFilePublications(publications?._id, formData);
                if (response.statusCode === 200) {
                    toast.success("Đã lưu file word");
                } else {
                    throw new Error('Failed to upload file');
                }
            } catch (error) {
                console.error("Error updating file:", error);
                toast.error("Có lỗi xảy ra khi lưu tài liệu");
            }
        }
    };

    return (
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
            PaperProps={{
                style: {
                    height: '100vh',
                    maxHeight: '100vh',
                    margin: 0,
                },
            }}
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
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "#2150a9",
                                padding: theme.spacing(2),
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#fff',
                                mb: 2
                            }}
                        >
                            <Typography variant="h6" sx={{ color: '#fff' }}>Chỉnh sửa</Typography>
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{ color: '#fff' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: '1500px',
                                    display: 'flex',
                                }}
                            >
                                {publications?.path && (
                                    <Word
                                        path={`${import.meta.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                        onSave={handleSave}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default WordDetailPage2;
