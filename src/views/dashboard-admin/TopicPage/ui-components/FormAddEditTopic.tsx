import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TCategory, TCategoryCreate } from "../../../../types/models/category";
import StyledButton from "../../../../components/default/button/StyledButton";
import { TTopicCreate } from "../../../../types/models/topic";
import AutocompleteForm from "../../../../components/custom/form/AutoCompleteForm";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TTopicCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TTopicCreate;
    isEditMode?: boolean;
    cateOptions?: TCategory[];
};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
});

const FormAddEditTopic: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        categoryIds: [],
    },
    isFetching = false,
    isEditMode = false,
    cateOptions
}) => {
    const formik = useFormik<TTopicCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            // const categoryIds = values.categoryIds?.map(category => category._id);

            // // Cập nhật lại values với categoryIds là mảng ID
            // const updatedValues = {
            //     ...values,
            //     categoryIds, // Gán lại mảng các ID vào values
            // };

            // Gọi hàm onSubmit đã truyền vào
            if (onSubmit) {
                onSubmit(values, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );

    const handleChangedCate = useCallback((value: TCategory[]) => {
        const categoryIds = value.map(category => category._id);

        console.log(categoryIds);

        setFieldValue?.("categoryIds", categoryIds);
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
                    {isEditMode ? "Sửa thông tin chủ đề" : "Thêm thông tin chủ đề mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên chủ đề"
                            placeholder="Nhập tên chủ đề"
                            required
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                        />
                        <AutocompleteForm
                            label="Lĩnh vực"
                            required
                            value={(values?.categoryIds as unknown as TCategory[]) || []}
                            options={cateOptions}
                            keyLabel={"name"}
                            onChange={handleChangedCate}
                            error={touched.categoryIds && Boolean(errors.categoryIds)}
                            helperText={touched.categoryIds && errors.categoryIds}
                            noOptionsText="Vui lòng thêm lĩnh vực mới"
                        />
                    </Form>
                </DialogContent>

                <DialogActions>
                    <Button disabled={isFetching} onClick={onClose} color="error" style={{ fontSize: 14 }}>
                        Huỷ
                    </Button>
                    <StyledButton
                        disableHoverEffect
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

export default FormAddEditTopic;