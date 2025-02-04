import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../../components/custom/form/InputForm";
import StyledButton from "../../../../../components/default/button/StyledButton";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: any, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: any;
    isEditMode?: boolean;
};

const schema = yup.object().shape({
    password: yup.string()
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
        .required("Mật khẩu mới là bắt buộc."),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], "Mật khẩu xác nhận không khớp.")
        .required("Xác nhận mật khẩu là bắt buộc."),
});

const ChangePassDialog: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        password: "",
        confirmPassword: "",
    },
}) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const formik = useFormik<any>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                onSubmit(values, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );

    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="sm"
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
                <DialogTitle>Đặt lại mật khẩu</DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    >
                        <InputForm
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu"
                            required
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            {...getFieldProps("password")}
                            type={showNewPassword ? "text" : "password"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowNewPassword} edge="end">
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <InputForm
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập mật khẩu"
                            required
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                            {...getFieldProps("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowConfirmPassword} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="error" style={{ fontSize: 14 }}>
                        Huỷ
                    </Button>
                    <StyledButton
                        disableHoverEffect
                        color="primary"
                        type="submit"
                        size="small"
                        variant="contained"
                        onClick={handleSubmit as () => void}
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3, marginRight: 3 }}
                    >
                        Lưu
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default ChangePassDialog;