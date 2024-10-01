import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import AutocompleteForm from "../../../../components/custom/form/AutoCompleteForm";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TGroupCreate } from "../../../../types/models/group.type";
import { TLibrary } from "../../../../types/models/library.type";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TGroupCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TGroupCreate;
    isEditMode?: boolean;
    libOptions?: TLibrary[];
    selectedLib?: TLibrary[];
    onSelectedLibs?: (value: TLibrary[]) => void;
};

const schema = yup.object().shape({
    isPublic: yup.boolean().required("Vui lòng chọn"),
    name: yup.string().required("Vui lòng nhập tên"),
    mainLibrary: yup.string().required("Vui lòng nhập tên"),
});

const FormAddEditGroup: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    libOptions,
    selectedLib,
    onSelectedLibs,
    initialValues = {
        isPublic: false,
        name: "",
    },
    isFetching = false,
    isEditMode = false,
}) => {

    const formik = useFormik<TGroupCreate>({
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
                    {isEditMode ? "Sửa thông tin nhóm" : "Thêm thông tin nhóm mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên nhóm"
                            placeholder="Nhập tên nhóm"
                            required
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                        />

                        <AutocompleteForm
                            label="Thư viện"
                            required
                            value={selectedLib ?? []}
                            options={libOptions}
                            keyLabel={"name"}
                            onChange={(value) => onSelectedLibs?.(value)}
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

export default FormAddEditGroup;