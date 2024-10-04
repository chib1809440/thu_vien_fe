import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { FC } from "react";

interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title = "Xác nhận xóa?",
    description = "Bạn có chắc chắn muốn xóa?"
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: "black" }} id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
               
                <Button onClick={onConfirm} color="error" autoFocus>
                    Xác nhận
                </Button>
                <Button onClick={onClose} sx={{ color: 'black' }}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
