import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TShelvesCreate } from "../../../../types/models/shelves";
import StyledButton from "../../../../components/default/button/StyledButton";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { Asset } from "../../../../interfaces/asset";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TShelvesCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TShelvesCreate;
    isEditMode?: boolean;
    assetData?: Asset[];
    selectedAsset?: Asset;
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
        assetId: null
    },
    isFetching = false,
    isEditMode = false,
    assetData,
    selectedAsset
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
                    {isEditMode ? "Sửa thông tin tủ kệ" : "Tạo thông tin tủ kệ mới"}
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
                        
                        <SelectForm
                            label="Tài sản"
                            value={(values.assetId as Asset)?._id}
                            options={selectedAsset ? [
                                {
                                    value: selectedAsset?._id,
                                    label: capitalizeFirstLetter(selectedAsset?.name),
                                },
                            ] : assetData.map((item) => ({
                                value: item._id,
                                label: capitalizeFirstLetter(item.name),
                            }))}
                            error={touched.assetId && Boolean(errors.assetId)}
                            {...getFieldProps("assetId")}
                            helperText={touched.assetId && errors.assetId}
                            disabled={isEditMode || !!selectedAsset}
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

export default FormAddEditShelf;