import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField, FormHelperText, Typography, Button } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import { ChangePasswordUserModel } from '../../../../interfaces/user';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: ChangePasswordUserModel, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: ChangePasswordUserModel;
    isEditMode?: boolean;
};

const schema = yup.object().shape({
    password: yup.string().required("Mật khẩu cũ là bắt buộc."),
    newPassword: yup.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.").required("Mật khẩu mới là bắt buộc."),
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
}) => {
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
                    Đổi mật khẩu
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
                        <Box sx={{ width: "100%" }}>
                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                Mật khẩu cũ <span className="required_text">(*)</span>
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="password"
                                {...getFieldProps('password')}
                                error={Boolean(touched.password && errors.password)}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText className="required_text">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </Box>

                        {/* Mật khẩu mới */}
                        <Box sx={{ width: "100%", mt: 2 }}>
                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                Mật khẩu mới <span className="required_text">(*)</span>
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="password"
                                {...getFieldProps('newPassword')}
                                error={Boolean(touched.newPassword && errors.newPassword)}
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
                                type="password"
                                {...getFieldProps('confirmPassword')}
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
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
                                Đổi mật khẩu
                            </Button>
                        </Box>
                    </Form>
                </DialogContent>
            </Dialog>
        </FormikProvider>
    );
};

export default FormChangePassword;
