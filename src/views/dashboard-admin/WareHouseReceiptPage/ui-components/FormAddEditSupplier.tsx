import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TSupplierCreate } from "../../../../types/models/supplier.type";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TSupplierCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TSupplierCreate;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên nhà cung cấp"),
    email: yup.string().email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(
            /^(\+84|0[3|5|7|8|9])+([0-9]{8})$/,
            "Số điện thoại không hợp lệ, vui lòng nhập số hợp lệ"
        ),
    address: yup
        .string()
        .required("Vui lòng nhập địa chỉ"),
});

const FormAddEditSupplier: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        note: "",
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TSupplierCreate>({
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
    console.log(errors);

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
                <DialogTitle>
                    {isEditMode ? "Sửa thông tin nhà cung cấp" : "Thêm thông tin nhà cung cấp mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên nhà cung cấp"
                            placeholder="Nhập tên nhà cung cấp"
                            required
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                        />
                        <InputForm
                            label="Email"
                            placeholder="email"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.name && errors.email}
                            {...getFieldProps("email")}
                        />
                        <InputForm
                            label="Số điện thoại"
                            placeholder="Số điện thoại"
                            required
                            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                            helperText={touched.phoneNumber && errors.phoneNumber}
                            {...getFieldProps("phoneNumber")}
                        />
                        <InputForm
                            label="Địa chỉ"
                            placeholder="Địa chỉ"
                            required
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            {...getFieldProps("address")}
                        />
                        <InputForm
                            label="Ghi chú"
                            placeholder="Ghi chú"
                            required
                            error={touched.note && Boolean(errors.note)}
                            helperText={touched.note && errors.note}
                            {...getFieldProps("note")}
                        />
                    </Form>

                </DialogContent>

                <DialogActions>
                    <Button disabled={isFetching} onClick={onClose} color="error">
                        Huỷ
                    </Button>
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang thêm..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditSupplier;