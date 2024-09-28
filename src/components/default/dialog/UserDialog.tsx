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
    TextareaAutosize,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorResponse } from "../../../interfaces/errorResponse";
import { Entity } from "draft-js";
import { EntityResponse } from "../../../interfaces/entityResponse";
import { CreateUserModel, User } from "../../../interfaces/user";
import { useCreateUser, useUpdateUser } from "../../../hooks/react-query/userData";
export const validationUtilizedObjectSchema = yup.object({
    fullname: yup.string().required("Vui lòng nhập họ và tên"),
    email: yup.string().email("Vui lòng nhập đúng định dạng email"),
    username: yup.string().required("Vui lòng nhập tên đăng nhập"),
    phoneNumber: yup.string().required("Vui lòng nhập tên đăng nhập"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    avatar: yup.string().required("Vui lòng nhập ảnh"),
    birthday: yup.string().required("Vui lòng nhập ngày sinh"),
    gender: yup.string().required("Vui lòng nhập giới tính"),
});
interface DialogProps {
    id?: string,
    open: boolean,
    handleOpen: (e) => void,
    fullScreen?: boolean,
    content?: React.ReactNode,
    action?: React.ReactNode,
    title: string,
    user?: User,
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}
export default function UserDialog({ title, maxWidth, id, content, action, fullScreen, open, user, handleOpen }: DialogProps) {
    const [formData, setFormData] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState<string | string[]>(null);
    const onSuccess = (data: EntityResponse<User>) => {
        if (data.statusCode) {
            const { statusCode, message } = data;
            if (statusCode === 200 || statusCode === 201) {
                handleOpen(false);
                if (!id) {
                    formik.resetForm();
                    toast.success("Thêm dữ liệu thành công", {});
                    return;
                }
                toast.success("Cập nhật dữ liệu thành công", {});
            } else {
                console.log('dsds', message);

                setEntityError(message);
            }
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const OnError = (data: ErrorResponse) => {
        console.log('toi day', data);
        if (data.statusCode) {
            const { statusCode, message } = data;

            setEntityError(message);
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const { mutate: createUser, isPending: isPendingInsert, isSuccess } = useCreateUser(onSuccess, OnError);
    const { mutate: updateUser, isPending: isPendingUpdate } = useUpdateUser(onSuccess, OnError);
    const formik = useFormik({
        initialValues: {
            fullname: user?.fullname ?? "",
            email: user?.email ?? "",
            password: "",
            username: user?.username ?? "",
            phoneNumber: user?.phoneNumber ?? "",
            address: user?.address ?? "",
            birthday: user?.birthday ?? "",
            gender: user?.gender ?? "",
            avatar: user?.avatar ?? "",

        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {
                setLoading(true);
                if (!user) {
                    const data: CreateUserModel = {
                        ...values,

                    };
                    createUser(data);

                } else {
                    const data: User = {
                        ...user,
                        ...values,
                    };
                    updateUser(data)
                }
            } catch (error: any) {
                setLoading(false);
                let errorResponse: ErrorResponse = error.response.data;
                setEntityError(errorResponse.message);
            }
        },
    });

    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (user) {
            formik.setValues({
                fullname: user?.fullname ?? "",
                email: user?.email ?? "",
                password: "",
                username: user?.username ?? "",
                phoneNumber: user?.phoneNumber ?? "",
                address: user?.address ?? "",
                birthday: user?.birthday ?? "",
                gender: user?.gender ?? "",
                avatar: user?.avatar ?? "",
            });
        }
    }, [user]);

    const onHandleClose = () => {
        handleOpen(false);
        if (id) {
            formik.resetForm();
            setEntityError(null);
        }
    };

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
                <DialogTitle sx={{ m: 0, pt: 3, pb: 0 }} id="customized-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 4, py: 0 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap="12px"
                        >
                            {Array.isArray(entityError) ? (
                                entityError.map((error, index) => (
                                    <Typography
                                        key={index}
                                        sx={{ mb: 1.5, fontWeight: "bold" }}
                                        className="required_text"
                                    >
                                        {error}
                                    </Typography>
                                ))
                            ) : (
                                <Typography
                                    sx={{ mb: 1.5, fontWeight: "bold" }}
                                    className="required_text"
                                >
                                    {entityError}
                                </Typography>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Họ và tên <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="fullname"
                                                    name="fullname"
                                                    value={formik.values.fullname}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.fullname &&
                                                        Boolean(formik.errors.fullname)
                                                    }
                                                />
                                                {formik.touched.fullname &&
                                                    Boolean(formik.errors.fullname) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.fullname
                                                                ? formik.errors.fullname.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Tên đăng nhập <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="username"
                                                    name="username"
                                                    value={formik.values.username}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.username &&
                                                        Boolean(formik.errors.username)
                                                    }
                                                />
                                                {formik.touched.username &&
                                                    Boolean(formik.errors.username) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.username
                                                                ? formik.errors.username.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Số điện thoại <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={formik.values.phoneNumber}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.phoneNumber &&
                                                        Boolean(formik.errors.phoneNumber)
                                                    }
                                                />
                                                {formik.touched.phoneNumber &&
                                                    Boolean(formik.errors.phoneNumber) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.phoneNumber
                                                                ? formik.errors.phoneNumber.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Mật khẩu <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="password"
                                                    name="password"
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.password &&
                                                        Boolean(formik.errors.password)
                                                    }
                                                />
                                                {formik.touched.password &&
                                                    Boolean(formik.errors.password) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.password
                                                                ? formik.errors.password.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        onClick={() => formik.handleSubmit()}
                        type="submit"
                        loading={id ? isPendingUpdate : isPendingInsert}
                        variant="contained"
                        size="large"
                    >
                        Lưu
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
