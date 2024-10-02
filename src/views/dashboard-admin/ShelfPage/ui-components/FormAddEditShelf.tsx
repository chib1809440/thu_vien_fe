import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TShelvesCreate } from "../../../../types/models/shelves";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TShelvesCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TShelvesCreate;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên")
});

const FormAddEditShelf: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        description: "",
        note: "",
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TShelvesCreate>({
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
                    {isEditMode ? "Sửa thông tin tủ kệ" : "Thêm thông tin tủ kệ mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên tủ kệ"
                            placeholder="Nhập tên tủ kệ"
                            required
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                        />
                        <InputForm
                            label="Mô tả"
                            placeholder="Nhập mô tả"
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                            {...getFieldProps("description")}
                        />
                        <InputForm
                            label="Ghi chú"
                            placeholder="Nhập ghi chú"
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

export default FormAddEditShelf;