import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TLibraryCreate } from "../../../../types/models/library.type";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TLibraryCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TLibraryCreate;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
});

const FormAddEditLibrary: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        address: "",
        managementAgency: "",
        phoneNumber: "",
        email: "",
        facebook: ""
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TLibraryCreate>({
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
                <DialogTitle>
                    {isEditMode ? "Sửa thông tin thư viện" : "Thêm thông tin thư viện mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên thư viện"
                            placeholder="Nhập tên thư viện"
                            required
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                        />
                        <InputForm
                            label="Địa chỉ"
                            placeholder="Nhập địa chỉ"
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            {...getFieldProps("address")}
                        />
                        <InputForm
                            label="Đơn vị quản lý"
                            placeholder="Nhập đơn vị quản lý"
                            error={touched.managementAgency && Boolean(errors.managementAgency)}
                            helperText={touched.managementAgency && errors.managementAgency}
                            {...getFieldProps("managementAgency")}
                        />
                        <InputForm
                            label="Số điện thoại"
                            placeholder="Nhập số điện thoại"
                            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                            helperText={touched.phoneNumber && errors.phoneNumber}
                            {...getFieldProps("phoneNumber")}
                        />
                        <InputForm
                            label="Email"
                            placeholder="Nhập Email"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            {...getFieldProps("email")}
                        />
                        <InputForm
                            label="Facebook"
                            placeholder="Nhập Facebook"
                            error={touched.facebook && Boolean(errors.facebook)}
                            helperText={touched.facebook && errors.facebook}
                            {...getFieldProps("facebook")}
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

export default FormAddEditLibrary;