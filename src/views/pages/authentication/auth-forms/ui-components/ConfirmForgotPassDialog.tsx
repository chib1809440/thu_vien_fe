import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useRef } from "react";
import * as yup from "yup";
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
    code: yup
        .string()
        .required("Vui lòng nhập mã xác thực.")
        .length(6, "Mã xác thực phải gồm 6 ký tự."),
});

const ConfirmForgotPassDialog: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        code: "",
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

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handlePinChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newCode = values.code.split("");
        newCode[index] = event.target.value;
        setFieldValue("code", newCode.join(""));

        if (event.target.value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const pinInputs = Array.from({ length: 6 }, (_, index) => (
        <Grid item xs={1.5} key={index} sx={{ marginTop: 3 }}>
            <TextField
                type="text"
                inputMode="numeric"
                value={values.code[index] || ""}
                onChange={(event) => handlePinChange(event, index)}
                error={touched.code && Boolean(errors.code)}
                helperText={touched.code && errors.code}
                fullWidth
                variant="outlined"
                inputProps={{
                    maxLength: 1,
                }}
                inputRef={(el) => inputRefs.current[index] = el}
            />
        </Grid>
    ));

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
                <DialogTitle>Nhập mã xác thực</DialogTitle>

                <DialogContent>
                    <Typography variant="body2">
                        Nhập mã xác thực được gửi đến email của bạn để tiếp tục quá trình lấy lại mật khẩu.
                    </Typography>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            {pinInputs}
                        </Grid>
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
                        Gửi
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default ConfirmForgotPassDialog;
