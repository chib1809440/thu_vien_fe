import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { Role } from "../../../../interfaces/role";
import { CreateUserModel } from "../../../../interfaces/user";
import { TLibrary } from "../../../../types/models/library.type";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: CreateUserModel, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: CreateUserModel;
    isEditMode?: boolean;
    roleOptions?: Role[];
    libraryOptions?: TLibrary[];
};

const schema = yup.object().shape({
    fullname: yup.string().required("Vui lòng nhập tên"),
    address: yup.string().url("Vui lòng nhập địa chỉ"),
    email: yup.string().email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: yup.string().matches(/^[0-9]+$/, "Vui lòng nhập đúng định dạng số điện thoại"),
    roleId: yup.string().required("Vui lòng chọn vai trò"),
    libraryId: yup.string().required("Vui lòng chọn thư viện"),
});

const FormProfile: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    roleOptions,
    libraryOptions,
    initialValues = {
        email: "",
        fullname: "",
        phoneNumber: "",
        address: "",
        birthday: "",
        gender: "",
        roleId: "",
        libraryId: "",
    },
}) => {
    const formik = useFormik<CreateUserModel>({
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
                    Thông tin cá nhân
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
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Họ tên"
                            error={touched.fullname && Boolean(errors.fullname)}
                            helperText={touched.fullname && errors.fullname}
                            {...getFieldProps("fullname")}
                            disabled
                        />
                        <InputForm
                            label="Địa chỉ"
                            placeholder="Nhập địa chỉ"
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            {...getFieldProps("address")}
                            disabled
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Email"
                                placeholder="Nhập email"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                {...getFieldProps("email")}
                                disabled
                            />
                            <InputForm
                                label="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                {...getFieldProps("phoneNumber")}
                                disabled
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Giới tính"
                                placeholder="Nhập giới tính"
                                error={touched.gender && Boolean(errors.gender)}
                                helperText={touched.gender && errors.gender}
                                {...getFieldProps("gender")}
                                disabled
                            />
                            <InputForm
                                label="Ngày sinh"
                                placeholder="Nhập ngày"
                                error={touched.birthday && Boolean(errors.birthday)}
                                helperText={touched.birthday && errors.birthday}
                                {...getFieldProps("birthday")}
                                disabled
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <SelectForm
                                label="Vai trò"
                                options={
                                    roleOptions?.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    })) || []
                                }
                                {...getFieldProps("roleId")}
                                error={touched.roleId && Boolean(errors.roleId)}
                                helperText={touched.roleId && errors.roleId}
                                disabled
                            />
                            <SelectForm
                                label="Thư viện"
                                options={
                                    libraryOptions?.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    })) || []
                                }
                                {...getFieldProps("libraryId")}
                                error={touched.libraryId && Boolean(errors.libraryId)}
                                helperText={touched.libraryId && errors.libraryId}
                                disabled
                            />
                        </Box>
                    </Form>
                </DialogContent>
            </Dialog>
        </FormikProvider>
    );
};

export default FormProfile;
