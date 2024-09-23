import React from "react";
// material-ui
import {
    Autocomplete,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    TextField
} from '@mui/material';

// third party
import { Box } from "@mui/system";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UN_AUTHORIZED } from "../../../../../constant/authorization";
import useScriptRef from "../../../../../hooks/useScriptRef";
import AnimateButton from "../../../../../ui-component/extended/AnimateButton";
import { useCreateLoanSlip } from "../hook/createLoanSlip";
import ButtonGD from "../../../../../ui-component/ButtonGD";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateModal(props: {
    isOpen: any;
    isClose: any;
    productItems: any;
}) {

    const scriptedRef = useScriptRef();
    const date = new Date();
    // const dateOff = new Date();
    const dateOff = new Date(Date.now() + (3600 * 1000 * 24));
    const dateMonth = new Date(Date.now() + (3600 * 1000 * 24 * 30));
    const { hanldCreateLoanSlip, isSubmit } = useCreateLoanSlip()
    const [valueDate, setValueDate] = React.useState('');
    const [valueProduct, setValueProduct] = React.useState<any>([]);
    const [productItem, setProductItem] = React.useState<any>([]);
    const [data, setData] = React.useState<any>([]);

    React.useEffect(() => {
        const filteredRows = props.productItems?.filter((item: any) => item?.cabinet_quantity !== 0);
        setData(filteredRows);
    }, [props.productItems]);


    function getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return year + '-' + month + '-' + day;
    }
    const [, setPayDay] = React.useState<any>(getFormattedDate(date));

    const handleClose = () => {
        props.isClose(false);
    };

    React.useEffect(() => {
        const datePay = new Date(dateOff.setDate(date.getDate()))
        setPayDay(datePay)
    }, [valueDate])
    React.useEffect(() => {
        if (isSubmit)
            props.isClose(false)
    }, [isSubmit])

    let newProduct = [{
        label: '',
        id: ''
    }]
    React.useEffect(() => {
        if (data?.length !== 0)
            data.forEach((item) =>
                newProduct.push({
                    label: item.supplyName,
                    id: item.supplyId
                }));
        setValueProduct(newProduct.slice(1))
    }, [data])

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Thêm phiếu mượn
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: '',
                            create_at: '',
                            return_date: '',
                            return_at: '',
                            numberPhone: '',
                            creator_id: '',
                            approver_id: '',
                            quantity: 0,
                            state: '',
                            note: '',
                            supplies: [],
                            loanSlipNumber: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().max(255).required('Tên người dùng không được để trống'),
                            numberPhone: Yup.string().max(255).required('Số điện thoại không đuợc trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateLoanSlip(values, valueDate, productItem)

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
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                                            <TextField
                                                id="outlined-adornment-name"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên người mượn"
                                                variant="outlined"
                                            />
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {errors.name}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.numberPhone && errors.numberPhone)}>
                                            <TextField
                                                id="outlined-adornment-numberPhone"
                                                type="text"
                                                value={values.numberPhone}
                                                 name="numberPhone"
                                                onInput = {(e:any) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                                                }}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Số điện thoại"
                                                variant="outlined"
                                            />
                                            {touched.numberPhone && errors.numberPhone && (
                                                <FormHelperText error id="standard-weight-helper-text-numberPhone">
                                                    {errors.numberPhone}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth >
                                            <TextField
                                                type="date"
                                                value={getFormattedDate(date)}
                                                label="Ngày mượn"
                                                variant="outlined"
                                                disabled
                                            />

                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                type="date"
                                                defaultValue={getFormattedDate(dateOff)}
                                                label="Ngày trả"
                                                onChange={(e) => setValueDate(e.target.value)}
                                                inputProps={{ min: getFormattedDate(dateOff), max: getFormattedDate(dateMonth) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid width={window.screen.width >= 1024 ? '100%' : '270px'}>
                                        {valueProduct?.length === 1 ?
                                            <Grid container justifyContent='center' mt={5}>
                                                <Grid container justifyContent='center' width='100%'>Đang tải sách...</Grid>
                                                {/* <CircularProgress /> */}
                                                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                            </Grid>
                                            :
                                            <FormControl fullWidth >
                                                <Autocomplete
                                                    fullWidth
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={valueProduct}
                                                    multiple
                                                    onChange={(event, newValue) => setProductItem(newValue)}
                                                    renderInput={(params) => <TextField {...params} label="Chọn ấn phẩm" />}
                                                />
                                            </FormControl>
                                        }
                                    </Grid>
                                    <Grid width={window.screen.width >= 1024 ? '100%' : '270px'}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="outlined-adornment-note"
                                                type="text"
                                                value={values.note}
                                                name="note"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Ghi chú"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid  width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Thêm mới" color="secondary" disabled={isSubmitting} width="100%"  type="submit"/>
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
                    <ButtonGD title="Hủy bỏ" isColor onClick={handleClose}/>
                    {/* <Button color="success" onClick={() => handleComform(selected)}>Chắn chắn</Button> */}
                </DialogActions>
            </Dialog>
        </>

    );
}
