import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TTypeVoice, TTypeVoiceCreate } from "../../../../types/models/type-voice";
import { TPublications } from "../../../../types/models/publications.type";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TTypeVoiceCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TTypeVoiceCreate;
    isEditMode?: boolean;
    typeVoiceOptions?: TTypeVoice[];
    publicationOptions?: TPublications[];
};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên")
});

const FormAddEditTypeVoice: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: ""
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TTypeVoiceCreate>({
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
                    {isEditMode ? "Sửa thông tin loại voice" : "Thêm thông tin loại voice mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên loại voice"
                            placeholder="Nhập tên loại voice"
                            required
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
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
                        {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditTypeVoice;