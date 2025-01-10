import { LoadingButton } from "@mui/lab";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../../helpers/formatDate";
import { useUser } from "../../../../hooks/react-query/userData";
import { User } from "../../../../interfaces/user";

interface DialogProps {
    id?: string,
    open: boolean,
    handleOpen: (e) => void,
    fullScreen?: boolean,
    content?: React.ReactNode,
    action?: React.ReactNode,
    title: string,
    roleId?: string,
    user?: User,
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}
export default function AdminDetailDialog({ title, maxWidth, id, content, action, fullScreen, open, user, handleOpen, roleId }: DialogProps) {

    const { data: userDetail } = useUser(user._id);

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, pb: 2 }} id="customized-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleOpen(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 4, py: 0 }}>
                    {userDetail && (
                        <Box>
                            <Typography sx={{ mb: 3 }}><strong>Barcode:</strong> {userDetail?.data?.result?.barcode}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Họ và tên:</strong>  {userDetail?.data?.result?.fullname}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Email:</strong> {userDetail?.data?.result?.email}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Số điện thoại:</strong> {userDetail?.data?.result?.phoneNumber}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Giới tính:</strong> {capitalizeFirstLetter(userDetail?.data?.result?.email)}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Ngày sinh:</strong> {formatDate(userDetail?.data?.result?.birthday)}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Username:</strong> {userDetail?.data?.result?.username}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Mật khẩu đầu tiên:</strong> {capitalizeFirstLetter(userDetail?.data?.result?.passwordFirst)}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        onClick={() => handleOpen(false)}
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        Đóng
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
