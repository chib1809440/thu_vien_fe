import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TCategoryCreate } from "../../../../types/models/category";
import StyledButton from "../../../../components/default/button/StyledButton";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TCategoryCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TCategoryCreate;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
});

const FormAddEditCategory: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        description: "",
        isLink: false,
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TCategoryCreate>({
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
                    {isEditMode ? "Sửa thông tin lĩnh vực" : "Thêm thông tin lĩnh vực mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên lĩnh vực"
                            placeholder="Nhập tên lĩnh vực"
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
                         <SwitchForm
                            value={values?.isLink ?? false}
                            onChange={(checked) => setFieldValue("isLink", checked)}
                            label="Chia sẻ liên thông"
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
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                    >
                        {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditCategory;