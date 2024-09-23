import React from "react";
// material-ui
import {
    Button,
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
import AnimateButton from "../../../../../ui-component/extended/AnimateButton";
import { useUpdateLoanSlip } from "../hook/updateLoanSlip";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function UpdateModal(props: {
    isOpen: any;
    isClose: any;
    productItems?: any;
    dataUpdate: any;
    isUpdate: any;
}) {

    const scriptedRef = useScriptRef();
    const date = new Date();
    const dateOff = new Date(Date.now() + (3600 * 1000 * 24));

    const { hanldUpdateLoanSlip, isUpdate } = useUpdateLoanSlip()
    const [data, setData] = React.useState<any>([]);
    const [listQuality, setListQuality] = React.useState<any>([]);

    let newArrayInputQuality = [...listQuality]

    React.useEffect(() => {
        setData(props.dataUpdate);
    }, [props.dataUpdate]);

    React.useEffect(() => {
        if (data?.length !== 0)
            data?.supplies.forEach((item, index) => {
                let newReturned_qty = 0
                item?.detail.forEach((itemDetail) => {
                    newReturned_qty = newReturned_qty + itemDetail.returned_qty;
                })
                newArrayInputQuality.splice(index, 1, Number(item.qty - newReturned_qty))
            })
        setListQuality(newArrayInputQuality)
    }, [data]);
    
    React.useEffect(() => {
        if (isUpdate)
            props.isClose(false)
        props.isUpdate(isUpdate)
    }, [isUpdate])


    function addQuality(item, index) {
        newArrayInputQuality.splice(index, 1, Number(item))
        setListQuality(newArrayInputQuality)
    }

    function getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return year + '-' + month + '-' + day;
    }



    const handleClose = () => {
        props.isClose(false);
    };
    function plusReturnedQty(dataDetails) {
        let returned_qty = 0;

        if (dataDetails?.length > 0) {
            dataDetails?.forEach((item) => {
                returned_qty = returned_qty + item.returned_qty;
            });
            return Number(returned_qty);
        }
    }

    function defaultValue(value1, value2) {
        return value1 - value2
    }

    const [isSubmitTrigger, setSubmitTrigger] = React.useState(false);

    return (
        <>
            <Dialog
                open={props.isOpen}
                // onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }} style={{ cursor: 'move' }} id="draggable-dialog-title">
                    TRẢ SÁCH
                </DialogTitle>
                <DialogContent sx={{ height: '650px' }}>
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
                            note: data.note,
                            supplies: [],
                            loanSlipNumber: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            // name: Yup.string().max(255).required('Tên người dùng không được để trống'),
                            // numberPhone: Yup.string().max(255).required('Số điện thoại không đuợc trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateLoanSlip(values, data, listQuality)

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
                                    <Grid md={12} sm={12} xs={12}>
                                        <FormControl fullWidth >
                                            <TextField
                                                value={data?.users?.fullName}
                                                label="Tên thành viên"
                                                variant="outlined"
                                                inputProps={{ readOnly: true }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid md={5.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth >
                                            <TextField
                                                type="date"
                                                value={getFormattedDate(date)}
                                                label="Ngày mượn"
                                                variant="outlined"
                                                inputProps={{ readOnly: true }}
                                            />

                                        </FormControl>
                                    </Grid>
                                    <Grid md={5.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                type="date"
                                                value={getFormattedDate(dateOff)}
                                                label="Ngày trả"
                                                variant="outlined"
                                                inputProps={{ readOnly: true }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {data?.supplies.map((item, index) => (
                                        <Grid key={item} container lg={12} md={12} sm={12} xs={12} justifyContent='space-between'>
                                            <Grid md={5.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth >

                                                    <TextField
                                                        value={item?.supply?.supplyName}
                                                        label="Tên ấn phẩm"
                                                        variant="outlined"
                                                        inputProps={{ readOnly: true }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid container md={5.5} sm={5.5} xs={12}>
                                                <Grid md={12}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            id="outlined-adornment-numberPhone"
                                                            type="number"
                                                            // value={values.numberPhone}
                                                            //  name="numberPhone"
                                                            onInput={(e: any) => {
                                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                            }}
                                                            onBlur={handleBlur}
                                                            onChange={(newValue) => addQuality(newValue.target.value, index)}
                                                            inputProps={{ defaultValue: item?.detail?.length === 0 ? item.qty : defaultValue(item.qty, plusReturnedQty(item?.detail)), min: 0, max: item?.detail?.length === 0 ? item.qty : defaultValue(item.qty, plusReturnedQty(item?.detail)) }}
                                                            // inputProps={{ defaultValue: defaultValue(item.qty, plusReturnedQty(item?.detail)), min: 0, max: defaultValue(item.qty, plusReturnedQty(item?.detail)) }}
                                                            InputProps={{
                                                                readOnly: defaultValue(item.qty, plusReturnedQty(item?.detail)) === 0 ? true : false,
                                                                startAdornment: <InputAdornment position="start">{`Đã trả ${plusReturnedQty(item?.detail) === undefined ? '0' : plusReturnedQty(item?.detail)} / ${item.qty}`}</InputAdornment>,
                                                            }}
                                                            label="Số lượng *"
                                                            variant="outlined"
                                                        />
                                                        {Number(item.qty) - Number(item.detail) !== 0 &&
                                                            <>
                                                                {
                                                                    listQuality[index] > item.qty || listQuality[index] < -1
                                                                        ? setSubmitTrigger(true)
                                                                        : setSubmitTrigger(false)
                                                                }
                                                            </>
                                                        }
                                                
                                                        {listQuality[index] > item.qty && (
                                                            <FormHelperText error>Số lượng nhập cao hơn số lượng mượn</FormHelperText>
                                                        )}
                                                        {listQuality[index] < 0 && (
                                                            <FormHelperText error>Không được nhập số âm</FormHelperText>
                                                        )}
                                                        {defaultValue(item.qty, plusReturnedQty(item?.detail)) !== 0 && (
                                                            <>
                                                                {listQuality[index] < -1 && (
                                                                    <FormHelperText error>
                                                                        Không để trống / Sai cứu pháp / Hãy kiểm tra lại
                                                                    </FormHelperText>
                                                                )}
                                                            </>
                                                        )}

                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Grid md={12} sm={12} xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="outlined-adornment-note"
                                                type="text"
                                                value={values.note}
                                                name="note"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{ defaultValue: data.note }}
                                                label="Ghi chú"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <Button color="secondary" disabled={isSubmitting || isSubmitTrigger} fullWidth size="large" type="submit" variant="contained">
                                                Xác Nhận
                                            </Button>
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
                    <Button variant="contained" color="error"  onClick={handleClose}>
                        Hủy bỏ
                    </Button>
                    {/* <Button color="success" onClick={() => handleComform(selected)}>Chắn chắn</Button> */}
                </DialogActions>
            </Dialog>
        </>

    );
}
