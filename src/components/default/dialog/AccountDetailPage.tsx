import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { Entity } from "draft-js";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { IconHttpDelete, IconSquareXFilled } from "@tabler/icons-react";
import { useUser } from "../../../hooks/react-query/userData";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../helpers/formatDate";
import { User } from "../../../interfaces/user";
import Barcode from "react-barcode";


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
                            <div style={{ textAlign: "center" }}>
                                <Barcode
                                    value={userDetail?.data?.result?.barcode}
                                    width={2} // Kích thước chiều rộng
                                    height={50} // Kích thước chiều cao
                                    fontSize={10}
                                />
                            </div>
                            <Typography sx={{ mb: 3 }}><strong>Họ và tên:</strong>  {userDetail?.data?.result?.fullname}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Email:</strong> {userDetail?.data?.result?.email}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Số điện thoại:</strong> {userDetail?.data?.result?.phoneNumber}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Giới tính:</strong> {capitalizeFirstLetter(userDetail?.data?.result?.gender)}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Ngày sinh:</strong> {formatDate(userDetail?.data?.result?.birthday)}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Tên đăng nhập:</strong> {userDetail?.data?.result?.username}</Typography>
                            <Typography sx={{ mb: 3 }}><strong>Mật khẩu đầu tiên:</strong> {userDetail?.data?.result?.passwordFirst}</Typography>
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
