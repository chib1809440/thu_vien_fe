import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TLibraryCreate } from "../../../../types/models/library.type";
import StyledButton from "../../../../components/default/button/StyledButton";

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
    maxStorageLimit: yup.number().min(1, "Dung lượng bộ nhớ phải lớn hơn hoặc bằng 1").required("Vui lòng nhập dung lượng bộ nhớ"),
    facebook: yup.string(),
    email: yup.string().email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: yup.string().matches(
        /^(\+84|0[3|5|7|8|9])+([0-9]{8})$/,
        "Số điện thoại không hợp lệ, vui lòng nhập số hợp lệ"
    ),
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
        facebook: "",
        maxStorageLimit: 0,
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
                        <Box sx={{ display: "flex", gap: { xs: 1, sm: 1, md: 2 }, flexWrap: "wrap" }}>
                            <InputForm
                                label="Tên thư viện"
                                placeholder="Nhập tên thư viện"
                                required
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                {...getFieldProps("name")}
                            />
                            <InputForm
                                label="Đơn vị quản lý"
                                placeholder="Nhập đơn vị quản lý"
                                error={touched.managementAgency && Boolean(errors.managementAgency)}
                                helperText={touched.managementAgency && errors.managementAgency}
                                {...getFieldProps("managementAgency")}
                            />
                        </Box>
                        <Box sx={{ display: "flex", gap: { xs: 1, sm: 1, md: 2 }, flexWrap: "wrap" }}>
                            <InputForm
                                type="number"
                                required
                                label="Dung lượng bộ nhớ (GB)"
                                placeholder="Dung lượng bộ nhớ"
                                value={values.maxStorageLimit || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFieldValue("maxStorageLimit", value);
                                }}
                                error={touched.maxStorageLimit && Boolean(errors.maxStorageLimit)}
                                helperText={touched.maxStorageLimit && errors.maxStorageLimit}
                                {...getFieldProps("maxStorageLimit")}
                                disabled={isEditMode}
                            />
                            <InputForm
                                label="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                {...getFieldProps("phoneNumber")}
                            />
                        </Box>

                        <InputForm
                            label="Địa chỉ"
                            placeholder="Nhập địa chỉ"
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            {...getFieldProps("address")}
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
                    <Button disabled={isFetching} onClick={onClose} color="error" style={{ fontSize: 14 }}>
                        Huỷ
                    </Button>
                    <StyledButton
                        color="primary"
                        size="small"
                        variant="contained"
                        onClick={handleSubmit as () => void}
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3, marginRight: 3 }}
                    >
                        {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditLibrary;
