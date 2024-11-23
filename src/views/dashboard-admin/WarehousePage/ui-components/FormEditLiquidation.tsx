import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Box } from '@mui/system';
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import InputForm from "../../../../components/custom/form/InputForm";
import { TLiquidationCreate } from '../../../../types/models/liquidation.type';
import { TPublications } from '../../../../types/models/publications.type';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TLiquidationCreate & { liquidationQuantity?: number }, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TLiquidationCreate;
};

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
    const [liquidationQuantity, setLiquidationQuantity] = useState(0);

    const formik = useFormik<TLiquidationCreate>({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {

            if (onSubmit) {
                onSubmit({ ...values, liquidationQuantity: values.quantity }, resetForm);
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
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap"  }}>
                            <InputForm
                                label="Tổng số lượng ấn phẩm sách"
                                type="number"
                                value={(values?.publicationId as TPublications)?.totalQuantity}
                                disabled
                            />
                            <InputForm
                                label="Vị trí hư hỏng"
                                placeholder="Nhập vị trí hư hỏng"
                                {...getFieldProps("position")}
                                error={touched.position && Boolean(errors.position)}
                                helperText={touched.position && errors.position}
                                disabled
                            />
                        </Box>

                        <InputForm
                            label="Lý do thanh lý"
                            placeholder="Lý do thanh lý"
                            {...getFieldProps("reason")}
                            error={touched.reason && Boolean(errors.reason)}
                            helperText={touched.reason && errors.reason}
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
                            {...getFieldProps("quantity")}
                            disabled
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