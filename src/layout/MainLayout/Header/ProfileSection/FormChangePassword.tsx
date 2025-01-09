import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField, FormHelperText, Typography, Button, InputAdornment } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import { ChangePasswordUserModel } from '../../../../interfaces/user';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: ChangePasswordUserModel, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: ChangePasswordUserModel;
    isEditMode?: boolean;
    isResetPass?: boolean;
};

const schema = yup.object().shape({
    password: yup.string().when('isResetPass', {
        is: false,
        then: yup.string().required("Mật khẩu cũ là bắt buộc."),
        otherwise: yup.string().notRequired(),
    }),
    newPassword: yup.string()
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
        .required("Mật khẩu mới là bắt buộc."),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], "Mật khẩu xác nhận không khớp.")
        .required("Xác nhận mật khẩu là bắt buộc."),
});

const FormChangePassword: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        userId: '',
        password: "",
        newPassword: "",
        confirmPassword: "",
    },
    isResetPass = false
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const formik = useFormik({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                onSubmit(values, resetForm);
            }
        },
    });

    const { errors, touched, values, handleSubmit, getFieldProps } = useMemo(() => formik, [formik]);

    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={open}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        onClose();
                    }
                }}
                disableEscapeKeyDown
            >
                <DialogTitle>
                    {isResetPass ? "Đặt lại mật khẩu" : "Đổi mật khẩu"}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        color='error'
                        sx={{ position: 'absolute', right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        {/* Mật khẩu cũ */}
                        {
                            !isResetPass &&
                            <Box sx={{ width: "100%" }}>
                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                    Mật khẩu cũ <span className="required_text">(*)</span>
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    {...getFieldProps('password')}
                                    error={Boolean(touched.password && errors.password)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText className="required_text">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Box>
                        }

                        {/* Mật khẩu mới */}
                        <Box sx={{ width: "100%", mt: 2 }}>
                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                Mật khẩu mới <span className="required_text">(*)</span>
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type={showNewPassword ? "text" : "password"}
                                {...getFieldProps('newPassword')}
                                error={Boolean(touched.newPassword && errors.newPassword)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowNewPassword} edge="end">
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {touched.newPassword && errors.newPassword && (
                                <FormHelperText className="required_text">
                                    {errors.newPassword}
                                </FormHelperText>
                            )}
                        </Box>

                        {/* Xác nhận mật khẩu mới */}
                        <Box sx={{ width: "100%", mt: 2 }}>
                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                Xác nhận mật khẩu <span className="required_text">(*)</span>
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type={showConfirmPassword ? "text" : "password"}
                                {...getFieldProps('confirmPassword')}
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowConfirmPassword} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <FormHelperText className="required_text">
                                    {errors.confirmPassword}
                                </FormHelperText>
                            )}
                        </Box>

                        {/* Nút gửi form */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {isResetPass ? "Lưu" : "Đổi mật khẩu"}
                            </Button>
                        </Box>
                    </Form>
                </DialogContent>
            </Dialog>
        </FormikProvider>
    );
};

export default FormChangePassword;
