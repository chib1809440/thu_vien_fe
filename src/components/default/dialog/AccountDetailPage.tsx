import { LoadingButton } from "@mui/lab";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../helpers/formatDate";
import { useUser } from "../../../hooks/react-query/userData";
import { User } from "../../../interfaces/user";
import PrintAccount from "../../../views/dashboard-admin/SystemPage/AccountPage/PrintAccount";
import ca from "date-fns/esm/locale/ca/index.js";

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
export default function AccountDetailDialog({ title, maxWidth, id, content, action, fullScreen, open, user, handleOpen, roleId }: DialogProps) {

    const { data: userDetail } = useUser(user._id);
    console.log(userDetail);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
        @page {
            margin: 10mm; /* Thiết lập margin */
            size: A4; /* Thiết lập kích thước */
        }
        body {
            margin: 0; /* Đảm bảo không có margin thừa */
        }
    `,
    });


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
                        <Box sx={{ mb: 2 }}>
                            <Box>
                                <div style={{ textAlign: "center" }}>
                                    <Barcode
                                        value={userDetail?.data?.result?.barcode}
                                        width={2} // Kích thước chiều rộng
                                        height={50} // Kích thước chiều cao
                                        fontSize={10}
                                    />
                                </div>
                                <Typography sx={{ mb: 3 }}><strong>Họ và tên:</strong>  {capitalizeFirstLetter(userDetail?.data?.result?.fullname)}</Typography>
                                <Typography sx={{ mb: 3 }}><strong>Email:</strong> {userDetail?.data?.result?.email}</Typography>
                                <Typography sx={{ mb: 3 }}><strong>Số điện thoại:</strong> {userDetail?.data?.result?.phoneNumber}</Typography>
                                <Typography sx={{ mb: 3 }}><strong>Giới tính:</strong> {capitalizeFirstLetter(userDetail?.data?.result?.gender)}</Typography>
                                <Typography sx={{ mb: 3 }}><strong>Ngày sinh:</strong> {formatDate(userDetail?.data?.result?.birthday)}</Typography>
                                <Typography sx={{ mb: 3 }}><strong>Tên đăng nhập:</strong> {userDetail?.data?.result?.username}</Typography>
                                {
                                    userDetail?.data?.result?.passwordFirst === "" ?
                                        <Typography sx={{ mb: 3 }}><strong>Mật khẩu đầu tiên:</strong> <strong style={{ color: "red" }}>Mật khẩu đã thay đổi</strong></Typography>
                                        :
                                        <Typography sx={{ mb: 3 }}><strong>Mật khẩu đầu tiên:</strong> {userDetail?.data?.result?.passwordFirst}</Typography>
                                }
                                {
                                    userDetail?.data?.result?.class && <Typography sx={{ mb: 3 }}><strong>Lớp:</strong> {userDetail?.data?.result?.class}</Typography>
                                }
                                {
                                    userDetail?.data?.result?.school && <Typography sx={{ mb: 3 }}><strong>Trường:</strong> {userDetail?.data?.result?.school}</Typography>
                                }
                            </Box>
                            <Box sx={{ display: 'none' }}>
                                {
                                    userDetail && <PrintAccount ref={componentRef} dataUsers={userDetail?.data?.result} />
                                }
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Box onClick={() => handlePrint()} sx={{ background: '#212121', color: 'white', borderRadius: "6px", p: 2, cursor: "pointer" }}  >
                        In thẻ thư viện
                    </Box>
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
