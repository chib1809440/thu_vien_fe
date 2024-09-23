import React from "react";
// material-ui
import {
    Alert,
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
    InputAdornment,
    Snackbar,
    TextField
} from '@mui/material';

// third party
import { Box } from "@mui/system";
import { Formik } from 'formik';
import useScanDetection from 'use-scan-detection';
import * as Yup from 'yup';
import { UN_AUTHORIZED } from "../../../../../constant/authorization";
import useScriptRef from "../../../../../hooks/useScriptRef";
import ButtonGD from "../../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../../ui-component/extended/AnimateButton";
import { useCreateLoanSlipV2 } from "../hook/createLoanSlipV2";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateModal(props: {
    isOpen: any;
    isClose: any;
    productItems: any;
    dataUser: any;
}) {

    const scriptedRef = useScriptRef();
    const date = new Date();
    const dateOff = new Date(Date.now() + (3600 * 1000 * 24));
    const dateMonth = new Date(Date.now() + (3600 * 1000 * 24 * 30))

    const { hanldCreateLoanSlipV2, isSubmit } = useCreateLoanSlipV2()

    const [valueDate, setValueDate] = React.useState('');
    const [valueProduct, setValueProduct] = React.useState<any>([]);
    const [valueProductV1, setValueProductV1] = React.useState<any>([]);
    const [productItem,] = React.useState<any>([]);
    const [valueUsers, setValueUsers] = React.useState<any>([]);
    const [UsersItem, setUsersItem] = React.useState<any>([]);
    const [data, setData] = React.useState<any>([]);

    const [arrayInput, setArrayInput] = React.useState<any>(['root']);
    const [listProduct, setListProduct] = React.useState<any>(['']);
    const [listQuality, setListQuality] = React.useState<any>([1]);
    const [barcodeScan, setBarcodeScan] = React.useState<any>('');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [openAlertError, setOpenAlertError] = React.useState(false);
    const [nameProductAlert, setNameProductAlert] = React.useState('');

    let newArrayInput = [...arrayInput]
    let newArrayInputProduct = [...listProduct]
    let newArrayInputQuality = [...listQuality]

    useScanDetection({
        onComplete: (code: any) => {

            const idReplace = code.replace(/Shift|rrowLeftBackspace/g, "")
            const isValidateBarcode = idReplace.indexOf("9786")

            if (idReplace?.length === 13 && isValidateBarcode === 0) {
                setBarcodeScan(idReplace)
            } else {
                setBarcodeScan('')
            }

            const dataFilter = valueProduct?.filter((item) => item.ISBN === idReplace)

            if (dataFilter?.length === 0 && barcodeScan !== '') {
                setOpenAlertError(true)
                setTimeout(() => {
                    setOpenAlertError(false)
                }, 2500);
            }
        }
    });

    React.useEffect(() => {
        const dataFilter = valueProduct?.filter((item) => item.ISBN === barcodeScan)
        setNameProductAlert(dataFilter[0]?.label)
        let index = listProduct.indexOf('');
        if (dataFilter?.length !== 0) {
            setOpenAlert(true)
            setTimeout(() => {
                setOpenAlert(false)
            }, 2500);
            if (index !== -1 && barcodeScan !== '') {
                newArrayInputProduct.splice(index, 1, dataFilter[0]?.id)
                setListProduct(newArrayInputProduct)
            }
            if (index === -1 && barcodeScan !== '') {
                setArrayInput([...arrayInput, Math.floor(Math.random() * Date.now()).toString(36)])

                newArrayInputQuality.push(1)
                setListQuality(newArrayInputQuality)
                if (dataFilter[0]?.id !== undefined) {
                    newArrayInputProduct.push(dataFilter[0]?.id)
                    setListProduct(newArrayInputProduct)
                }
            }
        }
    }, [barcodeScan]);

    React.useEffect(() => {
        const filteredRows = props.productItems?.filter((item: any) => item?.cabinet_quantity !== 0 && item?.cabinet_quantity !== null);
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
        setArrayInput(['root'])
        setListProduct([''])
        setListQuality([1])
        props.isClose(false);
        setBarcodeScan('')
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
        id: '',
        ISBN: ''
    }]
    let newUser = [{
        label: '',
        id: '',
    }]

    React.useEffect(() => {
        if (data?.length !== 0)
            data.forEach((item) =>
                newProduct.push({
                    label: item.supplyName,
                    id: item.supplyId,
                    ISBN: item.ISBN
                }));
        setValueProduct(newProduct.slice(1))
        setValueProductV1(newProduct.slice(1))
    }, [data])

    React.useEffect(() => {
        let newValue = [...valueProductV1]
        if (listProduct?.length !== 0) {
            listProduct.forEach((items) => {
                newValue = newValue?.filter((item) => item.id !== items)
            })
            setValueProduct(newValue)
        }
    }, [listProduct, valueProductV1])

    React.useEffect(() => {
        if (props.dataUser?.length !== 0)
            props.dataUser.forEach((item) => {
                if (item.username !== 'admin') {
                    newUser.push({
                        label: item.fullName,
                        id: item.userID,
                    })
                }
            }
            );
        setValueUsers(newUser.slice(1))
    }, [props.dataUser])

    function addInput() {
        setArrayInput([...arrayInput, Math.floor(Math.random() * Date.now()).toString(36)])
        newArrayInputQuality.push(1)
        newArrayInputProduct.push('')
        setListQuality(newArrayInputQuality)
        setListProduct(newArrayInputProduct)

    }
    function removeInput(index) {
        if (index !== 'root') {
            newArrayInput.splice(index, 1)
            newArrayInputProduct.splice(index, 1)
            newArrayInputQuality.splice(index, 1)
            setListQuality(newArrayInputQuality)
            setListProduct(newArrayInputProduct)
            setArrayInput(newArrayInput)
        }
    }
    function addProduct(item, index) {
        if (item !== null) {
            newArrayInputProduct.splice(index, 1, item.id)
            setListProduct(newArrayInputProduct)
        } else {
            newArrayInputProduct.splice(index, 1, '')
            setListProduct(newArrayInputProduct)
        }
    }
    function addQuality(item, index) {
        newArrayInputQuality.splice(index, 1, Number(item))
        setListQuality(newArrayInputQuality)
    }

    function checkProduct(item) {
        const newData = data?.filter((items) => items.supplyId === listProduct[item])
        return newData[0]?.cabinet_quantity
    }

    function checkNameProduct(item: string) {
        const newData = data?.filter((items) => items.supplyId === item)
        return newData[0]?.supplyName
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };
    const handleCloseAlertError = () => {
        setOpenAlertError(false);
    };

    return (
        <>
            <Dialog
                open={props.isOpen}
                // onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Thêm phiếu mượn
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
                            note: '',
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
                                await hanldCreateLoanSlipV2(values, valueDate, productItem, UsersItem, listProduct, listQuality)

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
                                        {valueUsers?.length === 0 ?
                                            <Grid container justifyContent='center' mt={5}>
                                                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                                {/* <CircularProgress /> */}
                                            </Grid>
                                            :
                                            <FormControl fullWidth >
                                                <Autocomplete
                                                    fullWidth
                                                    id="multiple-limit-tags"
                                                    disablePortal
                                                    options={valueUsers}
                                                    value={UsersItem}
                                                    // multiple
                                                    onChange={(event, newValue) => setUsersItem(newValue)}
                                                    renderInput={(params) => <TextField {...params} label="Chọn thành viên" />}
                                                />
                                            </FormControl>
                                        }
                                        {UsersItem?.length === 0 && UsersItem === null &&
                                            <FormHelperText sx={{ marginLeft: 1 }} error>Hãy chọn người mượn</FormHelperText>
                                        }

                                    </Grid>

                                    <Grid md={5.5} sm={5.5} xs={12}>
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
                                    <Grid md={5.5} sm={5.5} xs={12}>
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
                                    {arrayInput.map((item, index) => (
                                        <Grid key={item} container lg={12} md={12} sm={12} xs={12} justifyContent='space-between'>
                                            <Grid md={5.5} sm={5.5} xs={12}>
                                                {valueProduct?.length === 0 && data?.length === 0 ?
                                                    <Grid container justifyContent='center' mt={5}>
                                                        <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu ấn phẩm</Grid>
                                                        {/* <CircularProgress /> */}
                                                    </Grid>
                                                    :
                                                    <>
                                                        {checkNameProduct(listProduct[index]) === undefined ?
                                                            <>
                                                                <FormControl fullWidth >
                                                                    <Autocomplete
                                                                        fullWidth
                                                                        id="multiple-limit-tags"
                                                                        disablePortal
                                                                        options={valueProduct}
                                                                        value={'Chọn ấn phẩm'}
                                                                        onChange={(event, newValue) => addProduct(newValue, index)}
                                                                        renderInput={(params) => <TextField {...params} label="Chọn ấn phẩm" />}
                                                                    />
                                                                </FormControl>
                                                            </>
                                                            :
                                                            <>
                                                                <FormControl fullWidth >
                                                                    <Autocomplete
                                                                        fullWidth
                                                                        id="multiple-limit-tags"
                                                                        disablePortal
                                                                        options={valueProduct}
                                                                        value={checkNameProduct(listProduct[index])}
                                                                        onChange={(event, newValue) => addProduct(newValue, index)}
                                                                        renderInput={(params) => <TextField {...params} label="Chọn ấn phẩm" />}
                                                                    />
                                                                </FormControl>
                                                            </>}
                                                    </>
                                                }
                                            </Grid>
                                            <Grid container md={5.5} sm={5.5} xs={12}>
                                                <Grid md={8}>
                                                    {data?.length !== 0 &&
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
                                                                inputProps={{ defaultValue: 1, min: 1 }}
                                                                InputProps={{
                                                                    startAdornment: <InputAdornment position="start">{` ${checkProduct(index) === undefined ? '0' : 'Còn' + '' + checkProduct(index)}`}</InputAdornment>,
                                                                }}
                                                                label="Số lượng"
                                                                variant="outlined"
                                                            />
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                {data?.length !== 0 &&
                                                    <Grid container justifyContent='center' alignItems='center' md={4}>
                                                        <ButtonGD width="80px" disabled={arrayInput.length < 2} onClick={() => removeInput(index)} title="Xóa" isColor={true} />
                                                    </Grid>
                                                }
                                            </Grid>
                                        </Grid>
                                    ))}
                                    {valueProduct?.length !== 0 && data?.length !== 0 &&
                                        <Grid container justifyContent='flex-end' md={12} sm={12} xs={12}>
                                            <Button variant="outlined" fullWidth title="Thêm ấn phẩm" onClick={addInput}>Thêm ấn phẩm</Button>
                                        </Grid>
                                    }

                                    <Grid md={12} sm={12} xs={12}>
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
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Xác nhận" width="100%" disabled={isSubmitting || UsersItem?.length === 0 || listProduct?.length === 0 || listProduct.indexOf('') !== -1} type="submit" />
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
                {nameProductAlert !== undefined &&
                    <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                            {`Thêm thành công ấn phẩm ${nameProductAlert}`}
                        </Alert>
                    </Snackbar>
                }
                <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleCloseAlertError}>
                    <Alert onClose={handleCloseAlertError} severity="error" sx={{ width: '100%' }}>
                        {`Thêm ấn phẩm thất bại vui lòng kiểm tra lại`}
                    </Alert>
                </Snackbar>

                <DialogActions>
                    <AnimateButton>
                        <ButtonGD color="error" isColor={true} title="Hủy bỏ" onClick={handleClose} />
                    </AnimateButton>
                    {/* <ButtonGD color="success" onClick={() => handleComform(selected)}>Chắn chắn</ButtonGD> */}
                </DialogActions>
            </Dialog>
        </>

    );
}
