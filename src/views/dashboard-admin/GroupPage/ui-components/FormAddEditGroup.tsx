import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useMemo } from "react";
import * as yup from "yup";
import AutocompleteForm from "../../../../components/custom/form/AutoCompleteForm";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
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
};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
    mainLibrary: yup.string().required("Vui lòng chọn trưởng nhóm thư viện").nullable(),
    libraries: yup
        .array()
        .min(1, "Vui lòng chọn một thư viện")
        .required("Vui lòng chọn một thư viện")
        .nullable(),
});

const FormAddEditGroup: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    libOptions,
    initialValues = {
        mainLibrary: "",
        name: "",
        libraries: [],
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

    const handleChangedLibs = useCallback((value: TLibrary[]) => {
        setFieldValue?.("libraries", value);
        if (value.length === 0) {
            setFieldValue("mainLibrary", "");
        }
    }, []);

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
                            value={(values.libraries as unknown as TLibrary[]) || []}
                            options={libOptions}
                            keyLabel={"name"}
                            onChange={handleChangedLibs}
                            error={touched.libraries && Boolean(errors.libraries)}
                            helperText={touched.libraries && errors.libraries}
                        />

                        <SelectForm
                            label="Trưởng nhóm thư viện"
                            options={((values.libraries as unknown as TLibrary[]) || [])?.map(
                                (item) => ({
                                    value: item._id,
                                    label: item.name,
                                })
                            )}
                            {...getFieldProps("mainLibrary")}
                            error={touched.mainLibrary && Boolean(errors.mainLibrary)}
                            helperText={touched.mainLibrary && errors.mainLibrary}
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