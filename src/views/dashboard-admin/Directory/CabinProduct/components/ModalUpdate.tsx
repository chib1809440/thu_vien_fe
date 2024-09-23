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
    const { hanldUpdateTypeProduct, isUpdate, hanldUpdateStateOfBook } = useUpdateTypeProduct()

    const [itemCabinet, setdataCabinet] = React.useState<any>([]);
    const [valueCabinet, setValueCabinet] = React.useState<any>([]);
    const [quantityCabin, setQuantity] = React.useState<number>(1);
    const [itemSelectOption, setdataSelectOption] = React.useState<any>([]);

    let newSelectOption = [
        {
            label: 'Chọn trạng thái',
            id: '0'
        },
        {
            label: 'Chuyển lên tủ - kệ',
            id: '1'
        },
        {
            label: 'Ấn phẩm thanh lý',
            id: '2'
        },
        {
            label: 'Ấn phẩm hư hỏng',
            id: '3'
        }]

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
        if (isUpdate)
            props.isClose(false);
    }, [isUpdate]);

    const handleClose = () => {
        props.isClose(false);
        setdataCabinet([])
        setdataSelectOption(
            {
                label: 'Chọn trạng thái',
                id: '0'
            }
        )
    };

    function checkSubmit() {
        if (itemSelectOption !== null && itemSelectOption.id === '1' && itemCabinet !== null && itemCabinet?.length !== 0 && quantityCabin > 0 && props.dataUpdate.quantity >= quantityCabin) {
            return false
        }
        if (itemSelectOption !== null && itemSelectOption.id === '2' && quantityCabin > 0 && props.dataUpdate.quantity >= quantityCabin) {
            return false
        }
        if (itemSelectOption !== null && itemSelectOption.id === '3' && quantityCabin > 0 && props.dataUpdate.quantity >= quantityCabin) {
            return false
        }
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
                    Xác nhận chuyển
                </DialogTitle>
                <DialogContent sx={{ maxHeight: '700px', minHeight: '400px' }}>
                    <Formik
                        initialValues={{
                            supplyId: props.dataUpdate.supplyId,
                            cabinetId: props.dataUpdate?.cabinets?.cabinetId,
                            authorName: props.dataUpdate.supplyName,
                            quantity: props.dataUpdate.quantity,
                            cabinet_quantity: props.dataUpdate.cabinet_quantity,
                            note: props.dataUpdate.note,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                if(itemSelectOption.id === '3' && itemSelectOption.id !== null){
                                    await hanldUpdateStateOfBook(values, quantityCabin, itemSelectOption.id)
                                }
                                if(itemSelectOption.id === '2' && itemSelectOption.id !== null){
                                    await hanldUpdateStateOfBook(values, quantityCabin, itemSelectOption.id)
                                }
                                if(itemSelectOption.id === '1' && itemSelectOption.id !== null){
                                    await hanldUpdateTypeProduct(values, itemCabinet, quantityCabin)
                                }
                                
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
                                                    options={newSelectOption}
                                                    // multiple
                                                    onChange={(event, newValue) => setdataSelectOption(newValue)}
                                                    renderInput={(params) => <TextField {...params} label="Chọn trạng thái" />}
                                                    defaultValue={newSelectOption[0]}
                                                />
                                            </FormControl>
                                        }
                                    </Grid>
                                    {itemSelectOption?.id === '1' &&
                                        <>
                                            <Grid md={12}>
                                                <FormControl fullWidth error={Boolean(touched.cabinet_quantity && errors.cabinet_quantity)}>
                                                    <TextField
                                                        id="outlined-adornment-quantity"
                                                        name="quantity"
                                                        onBlur={handleBlur}
                                                        label="Tổng số học liệu"
                                                        variant="outlined"
                                                        InputProps={{ inputProps: { min: 0, max: values.quantity, readOnly: true }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '500' }} position="start">Tổng số học liệu: {values.quantity}</InputAdornment>, }}
                                                    />
                                                    {touched.cabinet_quantity && errors.cabinet_quantity && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {errors.cabinet_quantity}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={12}>
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
                                                        InputProps={{ inputProps: { min: 1, max: values.quantity }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '900' }} position="start">Số lượng chuyển: </InputAdornment> }}
                                                    />
                                                    {values.quantity < quantityCabin && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {`Hãy nhập nhỏ hơn tổng số học liệu (${values.quantity})`}
                                                        </FormHelperText>
                                                    )}
                                                    {quantityCabin < 1 && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {`Hãy nhập nhỏ hơn tổng số học liệu lớn hơn 0`}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
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
                                                            onChange={(event, newValue) => setdataCabinet(newValue)}
                                                            renderInput={(params) => <TextField {...params} label="Chọn Tủ - Kệ" />}
                                                        />
                                                    </FormControl>
                                                }
                                                {(itemCabinet?.length === 0 || itemCabinet === null) && (
                                                    <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                        {`Hãy chọn Tủ - Kệ`}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                        </>
                                    }
                                    {itemSelectOption?.id === '2' &&
                                        <>
                                            <Grid md={12}>
                                                <FormControl fullWidth error={Boolean(touched.cabinet_quantity && errors.cabinet_quantity)}>
                                                    <TextField
                                                        id="outlined-adornment-quantity"
                                                        name="quantity"
                                                        onBlur={handleBlur}
                                                        label="Tổng số học liệu"
                                                        variant="outlined"
                                                        InputProps={{ inputProps: { min: 0, max: values.quantity, readOnly: true }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '500' }} position="start">Tổng số học liệu: {values.quantity}</InputAdornment>, }}
                                                    />
                                                    {touched.cabinet_quantity && errors.cabinet_quantity && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {errors.cabinet_quantity}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={12}>
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
                                                        InputProps={{ inputProps: { min: 1, max: values.quantity }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '900' }} position="start">Số lượng thanh lý: </InputAdornment> }}
                                                    />
                                                    {values.quantity < quantityCabin && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {`Hãy nhập nhỏ hơn tổng số học liệu (${values.quantity})`}
                                                        </FormHelperText>
                                                    )}
                                                    {quantityCabin < 1 && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {`Hãy nhập nhỏ hơn tổng số học liệu lớn hơn 0`}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </>
                                    }
                                    {itemSelectOption?.id === '3' &&
                                        <>
                                            <Grid md={12}>
                                                <FormControl fullWidth error={Boolean(touched.cabinet_quantity && errors.cabinet_quantity)}>
                                                    <TextField
                                                        id="outlined-adornment-quantity"
                                                        name="quantity"
                                                        onBlur={handleBlur}
                                                        label="Tổng số học liệu"
                                                        variant="outlined"
                                                        InputProps={{ inputProps: { min: 0, max: values.quantity, readOnly: true }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '500' }} position="start">Tổng số học liệu: {values.quantity}</InputAdornment>, }}
                                                    />
                                                    {touched.cabinet_quantity && errors.cabinet_quantity && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {errors.cabinet_quantity}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={12}>
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
                                                        InputProps={{ inputProps: { min: 1, max: values.quantity }, startAdornment: <InputAdornment sx={{ color: '#000', fontWeight: '900' }} position="start">Số lượng hư hỏng: </InputAdornment> }}
                                                    />
                                                    {values.quantity < quantityCabin && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {`Hãy nhập nhỏ hơn tổng số học liệu (${values.quantity})`}
                                                        </FormHelperText>
                                                    )}
                                                    {quantityCabin < 1 && (
                                                        <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                            {`Hãy nhập nhỏ hơn tổng số học liệu lớn hơn 0`}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </>
                                    }
                                </Grid>
                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật" disabled={isSubmitting || checkSubmit()} width="100%" type="submit" />
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
