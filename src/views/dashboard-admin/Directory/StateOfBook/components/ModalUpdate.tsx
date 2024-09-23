import React from "react";
// material-ui
import {
    Autocomplete,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    TextField
} from '@mui/material';

// third party
import { Box } from "@mui/system";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UN_AUTHORIZED } from "../../../../../constant/authorization";
import useScriptRef from "../../../../../hooks/useScriptRef";
import ButtonGD from "../../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../../ui-component/extended/AnimateButton";
import { useUpdateTypeProduct } from "../hook/updateTypeProduct";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function UpdateModal(props: {
    isOpen: any;
    isClose: any;
    dataUpdate: any;
    dataCabinet: any;
}) {

    const scriptedRef = useScriptRef();
    const {isUpdate, hanldUpdateStateOfBook } = useUpdateTypeProduct()

    const [qtyDAMAGED, setQtyDAMAGED] = React.useState<number>(props.dataUpdate?.qtyDAMAGED);
    const [qtyLIQUIDATED, setQtyLIQUIDATED] = React.useState<number>(props.dataUpdate?.qtyLIQUIDATED);

    React.useEffect(() => {
        if (isUpdate)
            props.isClose(false);
    }, [isUpdate]);

    React.useEffect(() => {
        setQtyDAMAGED(props.dataUpdate?.qtyDAMAGED)
        setQtyLIQUIDATED(props.dataUpdate?.qtyLIQUIDATED)
    }, [props.dataUpdate]);

    const handleClose = () => {
        props.isClose(false);
    };

    function checkSubmit(value1, value2, value3) {
        if (value1 - value2 - value3 < 0)
            return true
    }

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Cập nhật thanh lý - hư hỏng
                </DialogTitle>
                <DialogContent sx={{ maxHeight: '700px', minHeight: '400px' }}>
                    <Formik
                        initialValues={{
                            supplyId: props.dataUpdate.supplyId,
                            warehouse_quantity: props.dataUpdate?.warehouse_quantity,
                            cabinetId: props.dataUpdate?.cabinets?.cabinetId,
                            authorName: props.dataUpdate.supplyName,
                            qtyDAMAGED: props.dataUpdate?.qtyDAMAGED,
                            qtyLIQUIDATED: props.dataUpdate?.qtyLIQUIDATED,
                            quantity: props.dataUpdate.quantity,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            await hanldUpdateStateOfBook(props.dataUpdate, qtyDAMAGED, qtyLIQUIDATED)

                            try {

                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } catch (err: any) {
                                const errMessage = err && err.message == UN_AUTHORIZED ?
                                    "Lỗi hệ thống" : "Lỗi hệ thống";

                                if (scriptedRef.current) {
                                    setStatus({ success: false });
                                    setErrors({ submit: errMessage });
                                    setSubmitting(false);
                                }
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container md={12} justifyContent='space-between' height='auto' gap={2} mt={2}>
                                    <Grid md={12} minWidth={{ md: '600px', xs: '90%' }}>
                                        <FormControl fullWidth error={Boolean(touched.authorName && errors.authorName)}>
                                            <TextField
                                                id="outlined-adornment-authorName"
                                                type="text"
                                                value={values.authorName}
                                                name="authorName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{ readOnly: true }}
                                                label="Tên ấn phẩm"
                                                variant="outlined"
                                            />
                                            {touched.authorName && errors.authorName && (
                                                <FormHelperText error id="standard-weight-helper-text-authorName">
                                                    {errors.authorName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12} minWidth={{ md: '600px', xs: '90%' }}>
                                        <FormControl fullWidth error={Boolean(touched.authorName && errors.authorName)}>
                                            <TextField
                                                id="outlined-adornment-authorName"
                                                type="text"
                                                value={values.warehouse_quantity - qtyDAMAGED - qtyLIQUIDATED}
                                                name="authorName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{ readOnly: true }}
                                                label="Số lượng còn khả dụng"
                                                variant="outlined"
                                            />
                                            {touched.authorName && errors.authorName && (
                                                <FormHelperText error id="standard-weight-helper-text-authorName">
                                                    {errors.authorName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qtyDAMAGED && errors.qtyDAMAGED)}>
                                            <TextField
                                                id="outlined-adornment-quantity"
                                                type="number"
                                                value={qtyDAMAGED}
                                                name="qtyDAMAGED"
                                                onBlur={handleBlur}
                                                onChange={(e) => setQtyDAMAGED(Number(e.target.value))}
                                                label="Số lượng hư hỏng"
                                                variant="outlined"
                                                InputProps={{ inputProps: { min: 1, max: values.warehouse_quantity }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '900' }} position="start">Số lượng hư hỏng: </InputAdornment> }}
                                            />
                                            {values.warehouse_quantity < qtyDAMAGED && (
                                                <FormHelperText error id="standard-weight-helper-text-qtyDAMAGED">
                                                    {`Hãy nhập nhỏ hơn tổng số khả dụng (${values.warehouse_quantity - qtyDAMAGED - qtyLIQUIDATED})`}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qtyLIQUIDATED && errors.qtyLIQUIDATED)}>
                                            <TextField
                                                id="outlined-adornment-quantity"
                                                type="number"
                                                value={qtyLIQUIDATED}
                                                name="qtyLIQUIDATED"
                                                onBlur={handleBlur}
                                                onChange={(e) => setQtyLIQUIDATED(Number(e.target.value))}
                                                label="Số lượng thanh lý"
                                                variant="outlined"
                                                InputProps={{ inputProps: { min: 1, max: values.warehouse_quantity }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '900' }} position="start">Số lượng thanh lý: </InputAdornment> }}
                                            />
                                            {(values.warehouse_quantity - qtyDAMAGED) < qtyLIQUIDATED && (
                                                <FormHelperText error id="standard-weight-helper-text-qtyLIQUIDATED">
                                                    {`Hãy nhập nhỏ hơn tổng số khả dụng (${values.warehouse_quantity - qtyDAMAGED - qtyLIQUIDATED})`}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật" disabled={isSubmitting || checkSubmit(values.warehouse_quantity, qtyDAMAGED, qtyLIQUIDATED)} width="100%" type="submit" />
                                        </AnimateButton>
                                    </Grid>

                                </Grid>
                                {errors.submit && (
                                    <Box sx={{ mt: 3 }}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                            </form>
                        )}
                    </Formik>
                </DialogContent>
                <DialogActions>
                    <ButtonGD title="Hủy bỏ" isColor onClick={handleClose} />

                    {/* <Button color="success" onClick={() => handleComform(selected)}>Chắn chắn</Button> */}
                </DialogActions>
            </Dialog>
        </>

    );
}
