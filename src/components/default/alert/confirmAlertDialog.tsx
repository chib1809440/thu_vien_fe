import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
export interface Props {
    title: string,
    message?: string,
    openConfirm: boolean
    handleOpenConfirmDialog: (e: boolean) => void,
    onHandleConfirm: () => void,
}
export default function AlertConfirmDialog({ title, message, openConfirm, onHandleConfirm, handleOpenConfirmDialog }: Props) {

    const handleClickConfirm = () => {
        onHandleConfirm()
    };

    const handleClose = () => {
        handleOpenConfirmDialog(false)
    };
    return (
        <React.Fragment>

            <Dialog
                open={openConfirm}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography sx={{ color: "black" }}>{message}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClickConfirm}>Xác nhận</Button>
                    <Button onClick={handleClose} sx={{ color: 'black' }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}