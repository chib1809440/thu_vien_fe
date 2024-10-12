import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import { useCallback, useRef, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (file: File) => void;
    isFetching?: boolean;
};

const DialogImportFile = ({ open, onClose, onSubmit }) => {
    const [file, setFile] = useState<File | null>(null);
    const imageRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = () => {
        if (!file) {
            toast.error("Vui lòng chọn file");
            return;
        }

        if (!onSubmit) return;

        onSubmit(file);
    };

    const handleClickUpload = useCallback(() => {
        if (!imageRef.current) return;
        imageRef.current.click();
    }, [imageRef.current]);

    const handleChangeImage = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;

        if (!files || !files?.length) return;
        setFile(files[0]);
    }, []);

    return (
        <Dialog
            maxWidth="xs"
            fullWidth
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                    // Ngăn tắt khi bấm ra ngoài
                    onClose();
                }
            }}
            disableEscapeKeyDown
        >
            <DialogTitle>
                Thêm mới thông tin ấn phẩm bằng excel
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    color="error"
                    sx={{ position: "absolute", right: 8, top: 2 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        width: "100%",
                        mt: 2,
                    }}
                >
                    <Box sx={{ width: "100%" }}>
                        <Box
                            sx={{
                                height: { xs: "80px", md: "220px" },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                borderRadius: 2,
                            }}
                            onClick={handleClickUpload}
                        >
                            <IconButton aria-label="upload file">
                                <CloudUploadIcon color="inherit" />
                            </IconButton>

                            <input
                                accept={".xlsx, .xls"}
                                multiple={false}
                                type="file"
                                tabIndex={-1}
                                style={{ display: "none" }}
                                ref={imageRef}
                                onChange={handleChangeImage}
                            />

                            {!file && <Typography color={"inherit"}>Chọn file</Typography>}

                            {file && (
                                <Typography variant="body2" color="inherit" mt={1} px={1}>
                                    {file.name}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Gửi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogImportFile;
