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
    const { hanldUpdateTypeProduct, isUpdate, hanldCleareTypeProduct } = useUpdateTypeProduct()

    const [itemCabinet, setdataCabinet] = React.useState<any>([]);
    const [valueCabinet, setValueCabinet] = React.useState<any>([]);
    const [quantityCabin, setQuantity] = React.useState<number>(0);

    let newCabinet = [{
        label: '',
        id: ''
    }]
    React.useEffect(() => {
        props.dataCabinet.forEach((item) =>
            newCabinet.push({
                label: item.position,
                id: item.cabinetId
            }));
        setValueCabinet(newCabinet.slice(1))
    }, [props.dataCabinet])

    React.useEffect(() => {
        let newCabinetV1 = [{
            label: '',
            id: ''
        }]
        setQuantity(props.dataUpdate?.cabinet_quantity)
        if (props.dataUpdate?.cabinets !== null || props.dataUpdate?.length !== 0) {
            newCabinetV1.push({
                label: props.dataUpdate?.cabinets?.position,
                id: props.dataUpdate?.cabinets?.cabinetId
            })
            setdataCabinet(newCabinetV1[1])
        }
    }, [props.dataUpdate])

    React.useEffect(() => {
        if (isUpdate)
            props.isClose(false);
    }, [isUpdate]);

    const handleClose = () => {
        props.isClose(false);
    };

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Xác nhận chuyển
                </DialogTitle>
                <DialogContent sx={{ height: '400px' }}>
                    <Formik
                        initialValues={{
                            supplyId: props.dataUpdate.supplyId,
                            supplyName: props.dataUpdate.supplyName,
                            quantity: props.dataUpdate.quantity,
                            warehouse_quantity: props.dataUpdate.warehouse_quantity,
                            cabinet_quantity: props.dataUpdate.cabinet_quantity,
                            cabinets: props.dataUpdate.cabinets,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateTypeProduct(values, itemCabinet, quantityCabin)

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
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.supplyName && errors.supplyName)}>
                                            <TextField
                                                id="outlined-adornment-supplyName"
                                                type="text"
                                                value={values.supplyName}
                                                name="supplyName"
                                                onBlur={handleBlur}
                                                inputProps={{readOnly: true}}
                                                label="Tên ấn phẩm"
                                                variant="outlined"
                                            />
                                            {touched.supplyName && errors.supplyName && (
                                                <FormHelperText error id="standard-weight-helper-text-supplyName">
                                                    {errors.supplyName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid container justifyContent='space-between' md={12}>
                                        <Grid md={5.8}>
                                            <FormControl fullWidth error={Boolean(touched.cabinet_quantity && errors.cabinet_quantity)}>
                                                <TextField
                                                    id="outlined-adornment-quantity"
                                                    name="quantity"
                                                    onBlur={handleBlur}
                                                    label="Tổng số ấn phẩm"
                                                    variant="outlined"
                                                    InputProps={{ inputProps: { min: 0, max: values.quantity, readOnly: true }, startAdornment: <InputAdornment sx={{color:'#000', fontWeight:'500'}} position="start">Số lượng ở kho: {values.warehouse_quantity}</InputAdornment>, }}
                                                />
                                                {touched.cabinet_quantity && errors.cabinet_quantity && (
                                                    <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                        {errors.cabinet_quantity}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid md={5.8}>
                                            <FormControl fullWidth error={Boolean(touched.cabinet_quantity && errors.cabinet_quantity)}>
                                                <TextField
                                                    id="outlined-adornment-quantity"
                                                    type="number"
                                                    value={quantityCabin}
                                                    name="quantity"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    label="Số lượng"
                                                    variant="outlined"
                                                    InputProps={{ inputProps: { min: 0, max: values.quantity }, startAdornment: <InputAdornment sx={{color:'#000', fontWeight:'900'}} position="start">Số lượng trên kệ: </InputAdornment> }}
                                                />
                                                {values.quantity < quantityCabin && (
                                                    <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                        {`Hãy nhập nhỏ hơn tổng số ấn phẩm (${values.quantity})`}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    {/* <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.cabinets && errors.cabinets)}>
                                            <TextField
                                                id="outlined-adornment-cabinets"
                                                type="text"
                                                value={values.cabinets['position']}
                                                name="cabinets"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên kệ hiện tại"
                                                variant="outlined"
                                                // disabled
                                            />
                                            {touched.cabinets && errors.cabinets && (
                                                <FormHelperText error id="standard-weight-helper-text-cabinets">
                                                    {errors.cabinets}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid> */}
                                    <Grid width='100%'>
                                        {props.dataCabinet?.length === 0 ?
                                            // <CircularProgress />
                                            <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                            :
                                            <FormControl fullWidth >
                                                <Autocomplete
                                                    fullWidth
                                                    disablePortal
                                                    id="combo-box-Cabinet"
                                                    options={valueCabinet}
                                                    // multiple
                                                    value={itemCabinet}
                                                    onChange={(event, newValue) => setdataCabinet(newValue)}
                                                    renderInput={(params) => <TextField {...params} label=" Chọn Tủ - Kệ " />}
                                                />
                                            </FormControl>
                                        }
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 5 }} justifyContent='center' gap={3}>
                                    <Grid container justifyContent='center' gap={2}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật" disabled={isSubmitting || values.quantity < quantityCabin || itemCabinet === null} width="100px" type="submit" />
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
                    <ButtonGD title="Xoá khỏi kệ" isColor onClick={() => hanldCleareTypeProduct(props.dataUpdate)}>
                    </ButtonGD>
                    <ButtonGD title="Huỷ" isColor onClick={handleClose}>
                    </ButtonGD>
                </DialogActions>
            </Dialog>
        </>

    );
}
