import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TPublisherCreate } from "../../../../types/models/publisher";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublisherCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TPublisherCreate;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên")
});

const FormAddEditPublisher: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        description: "",
        note: "",
        isPublic: false,
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TPublisherCreate>({
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
                    {isEditMode ? "Sửa thông tin nhà sản xuất" : "Thêm thông tin nhà sản xuất mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên nhà sản xuất"
                            placeholder="Nhập tên nhà sản xuất"
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
                        <SwitchForm
                            value={values?.isPublic ?? false}
                            onChange={(checked) => setFieldValue("isPublic", checked)}
                            label="Hiển thị"
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

export default FormAddEditPublisher;