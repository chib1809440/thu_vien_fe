import React from "react";
// material-ui
import {
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
import ButtonGD from "../../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../../ui-component/extended/AnimateButton";
import { useExtendLoanSlip } from "../hook/extendLoanSlip";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function ModalExtend(props: {
    isOpen: any;
    isClose: any;
    productItems?: any;
    dataUpdate: any;
}) {

    const scriptedRef = useScriptRef();
    const date = new Date(props.dataUpdate.create_at);
    const dateReturn = new Date(props.dataUpdate.return_at);
    const dateOff = new Date(props.dataUpdate.limited_date ? props.dataUpdate.limited_date : props.dataUpdate.return_at);
    const dateMonth = new Date(Date.now() + (3600 * 1000 * 24 * 60))
    const { hanldExtendLoanSlip, isExtend } = useExtendLoanSlip()
    const [valueDate, setValueDate] = React.useState('');
    // const [valueProduct, setValueProduct] = React.useState<any>([]);
    const [productItem, setProductItem] = React.useState<any>([]);
    const [isActive, setActive] = React.useState<string>('false');

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

    // let newProduct = [{
    //     label: '',
    //     id: ''
    // }]
    let newProduct1 = [{
        label: '',
        id: ''
    }]
    React.useEffect(() => {
        const datePay = new Date(dateOff.setDate(date.getDate()))
        setPayDay(datePay)
    }, [valueDate])
    
    React.useEffect(() => {
        if (isExtend)
            props.isClose(false);
    }, [isExtend])

    
    React.useEffect(() => {
        if (props.dataUpdate?.length !== 0)
            props.dataUpdate?.supplies.forEach((item) =>
                newProduct1.push({
                    label: item.supply !== null && item.supply.supplyName,
                    id: item?.supply?.supplyId,
                }));
        setProductItem(newProduct1.slice(1))

        if (props.dataUpdate.state) {
            setActive('true')
        } else {
            setActive('false')
        }
    }, [props.dataUpdate])

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Gia hạn phiếu mượn
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: props.dataUpdate?.users?.fullName,
                            numberPhone: props.dataUpdate?.users?.numberPhone,
                            create_at: props.dataUpdate.create_at,
                            return_date: props.dataUpdate.return_date,
                            return_at: props.dataUpdate.return_at,
                            creator_id: props.dataUpdate.creator_id,
                            approver_id: props.dataUpdate.approver_id,
                            quantity: props.dataUpdate.quantity,
                            state: props.dataUpdate.state,
                            note: props.dataUpdate.note,
                            supplies: props.dataUpdate.supplies,
                            loanSlipNumber: props.dataUpdate.loanSlipNumber,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            // name: Yup.string().max(255).required('Tên người dùng không được để trống'),
                            // numberPhone: Yup.string().max(255).required('Số điện thoại không đuợc trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldExtendLoanSlip(values, valueDate, productItem, isActive)

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
                                    <Grid md={5.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                                            <TextField
                                                id="outlined-adornment-name"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                inputProps={{ readOnly: true }}
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
                                    <Grid md={5.5} sm={5.5} xs={12}>
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
                                                label="Số điện thoại"
                                                variant="outlined"
                                                inputProps={{ readOnly: true }}
                                            />
                                            {touched.numberPhone && errors.numberPhone && (
                                                <FormHelperText error id="standard-weight-helper-text-numberPhone">
                                                    {errors.numberPhone}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={5.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth >
                                            <TextField
                                                type="date"
                                                value={getFormattedDate(dateOff)}
                                                label="Ngày trả"
                                                variant="outlined"
                                                inputProps={{ readOnly: true }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid md={5.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth>
                                        <TextField
                                                type="date"
                                                defaultValue={getFormattedDate(dateOff)}
                                                label="Ngày gia hạn"
                                                onChange={(e) => setValueDate(e.target.value)}
                                                inputProps={{ min: getFormattedDate(dateReturn), max: getFormattedDate(dateMonth) }}
                                                color="success"
                                                focused
                                            />
                                        </FormControl>
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
                                            <ButtonGD title="Gia hạn" color="secondary" disabled={isSubmitting} width="100%"  type="submit"/>
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
