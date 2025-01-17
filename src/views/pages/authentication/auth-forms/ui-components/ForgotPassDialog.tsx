import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
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
    username: yup
        .string()
        .required("Vui lòng nhập tên tài khoản."),
});

const ForgotPassDialog: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        username: "",
    },
}) => {
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
                <DialogTitle>Quên mật khẩu</DialogTitle>

                <DialogContent>
                    <Typography variant="body2">
                        Nhập tài khoản đăng nhập và kiểm tra email của bạn để nhận hướng dẫn lấy lại mật khẩu.
                    </Typography>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên đăng nhập"
                            placeholder="Nhập tên đăng nhập"
                            required
                            error={touched.username && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                            {...getFieldProps("username")}
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
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3, marginRight: 3, textTransform: "inherit" }}
                    >
                        Gửi yêu cầu
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default ForgotPassDialog;