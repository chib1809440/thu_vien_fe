import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import { TLiquidationCreate } from '../../../../types/models/liquidation.type';
import { TPublications } from '../../../../types/models/publications.type';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TLiquidationCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TLiquidationCreate;
};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên"),

});

const FormEditLiquidation: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        note: "",
        quantity: 0,
        status: "hư hỏng",
        reason: "",
        position: "trong kho",
        publicationId: ""
    },
    isFetching = false,
}) => {
    const formik = useFormik<TLiquidationCreate>({
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

    const total = (values?.publicationId as TPublications)?.quantity + (values?.publicationId as TPublications)?.shelvesQuantity
    const [additionalQuantity, setAdditionalQuantity] = useState(0);
    const [touchedMount, setTouchedMount] = useState({ additionalQuantity: false });
    const [errorsMount, setErrorsMount] = useState({ additionalQuantity: '' });
    const quantity = parseInt(getFieldProps("quantity").value, 10) || 0;

    const validateAdditionalQuantity = (additionalQuantity, quantity) => {
        const value = Number(additionalQuantity);

        if (quantity < value) {
            if (value <= 0) return "Số lượng phải lớn hơn 0";
            if (value >= quantity) return `Số lượng thanh lý không được lớn hơn số lượng hư hỏng là ${quantity}`;
        }
        return null;
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
    
        const numericValue = Number(value);
        if (numericValue < 0) {
            setAdditionalQuantity(0);
            setErrorsMount({ ...errorsMount, additionalQuantity: "Số lượng không được âm" });
            return;
        }
    
        setAdditionalQuantity(numericValue);
        setTouchedMount({ ...touchedMount, additionalQuantity: true });
    
        const error = validateAdditionalQuantity(numericValue, quantity);
        setErrorsMount({ ...errorsMount, additionalQuantity: error });
    };

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
                    Cập nhật thông tin sách thanh lý - hư hỏng
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
                            value={(values?.publicationId as TPublications)?.name}
                            disabled
                        />
                        <InputForm
                            label="Tổng số lượng ấn phẩm sách"
                            type="number"
                            value={total}
                            disabled
                        />
                        <InputForm
                            label="Số lượng hư hỏng"
                            type="number"
                            placeholder="Nhập số lượng hư hỏng"
                            {...getFieldProps("quantity")}
                            error={touched.quantity && Boolean(errors.quantity)}
                            helperText={touched.quantity && errors.quantity}
                            disabled
                        />
                        <InputForm
                            label="Số lượng thanh lý"
                            type="number"
                            placeholder="Nhập số lượng"
                            value={additionalQuantity}
                            onChange={handleQuantityChange}
                            error={touchedMount.additionalQuantity && Boolean(errorsMount.additionalQuantity)} 
                            helperText={touchedMount.additionalQuantity && errorsMount.additionalQuantity ? errorsMount.additionalQuantity : undefined} // Truyền helperText
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

export default FormEditLiquidation;