import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TShelves } from '../../../../types/models/shelves';
import { stockStatusOptions } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublicationsCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TPublicationsCreate;
    isEditMode?: boolean;
    shelfOptions?: TShelves[];

};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên"),
    shelvesQuantity: yup
        .number()
        .required("Vui lòng nhập số lượng trên kệ")
        .min(1, "Số lượng trên kệ phải lớn hơn 0")
        .max(yup.ref('quantity'), "Số lượng trên kệ không được lớn hơn số lượng tồn kho")
});

const FormEditWarehouse: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    shelfOptions,
    initialValues = {
        name: "",
        quantity: 0,
        shelvesQuantity: 0,
        status: "không có sẵn",
        shelvesId: "",
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TPublicationsCreate>({
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
                        onClose();
                    }
                }}
                disableEscapeKeyDown
            >
                <DialogTitle>
                    Cập nhật thông tin kho
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
                            label="Tên ấn phẩm"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                            disabled
                        />
                        <SelectForm
                            label="Trạng thái ấn phẩm"
                            options={stockStatusOptions}
                            {...getFieldProps("status")}
                            error={touched.status && Boolean(errors.status)}
                            helperText={touched.status && errors.status}
                        />
                        <InputForm
                            label="Số lượng"
                            type="number"
                            placeholder="Nhập số lượng"
                            {...getFieldProps("quantity")}
                            error={touched.quantity && Boolean(errors.quantity)}
                            helperText={touched.quantity && errors.quantity}
                            disabled
                        />
                        <SelectForm
                            label="Chọn kệ tủ"
                            options={
                                shelfOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []
                            }
                            {...getFieldProps("shelvesId")}
                            error={touched.shelvesId && Boolean(errors.shelvesId)}
                            helperText={touched.shelvesId && errors.shelvesId}
                        />
                        <InputForm
                            label="Số lượng trên kệ"
                            type="number"
                            placeholder="Nhập số lượng trên kệ"
                            {...getFieldProps("shelvesQuantity")}
                            error={
                                touched.shelvesQuantity && Boolean(errors.shelvesQuantity)
                            }
                            helperText={touched.shelvesQuantity && errors.shelvesQuantity}
                        />
                    </Form>
                </DialogContent>

                <DialogActions>
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormEditWarehouse;