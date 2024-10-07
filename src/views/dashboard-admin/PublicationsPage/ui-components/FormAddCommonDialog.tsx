import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TAuthorCreate } from "../../../../types/models/author";
import { TCategoryCreate } from "../../../../types/models/category";
import { TMaterialCreate } from "../../../../types/models/material";
import { TPublisherCreate } from "../../../../types/models/publisher";

type TCommonCreate = TPublisherCreate | TMaterialCreate | TCategoryCreate | TAuthorCreate;

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TCommonCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TCommonCreate;
    typeToAdd: string;
};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên")
});

const FormAddCommonDialog: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        description: "",
    },
    isFetching = false,
    typeToAdd,
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
                    {typeToAdd === "publisher" && "Thêm nhà xuất bản mới"}
                    {typeToAdd === "author" && "Thêm tác giả mới"}
                    {typeToAdd === "category" && "Thêm lĩnh vực mới"}
                    {typeToAdd === "material" && "Thêm dạng học liệu mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên"
                            placeholder="Nhập tên"
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
                        {isFetching ? "Đang thêm..." : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddCommonDialog;