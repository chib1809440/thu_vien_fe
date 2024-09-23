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
import { useUpdateAssetLib } from "../hook/updateAssetLib";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function UpdateModal(props: {
    isOpen: any;
    isClose: any;
    dataUpdate: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldUpdateAssetLib, isUpdate } = useUpdateAssetLib()

    React.useEffect(() => {
        if (isUpdate) {
            props.isClose(false);
        }
    }, [isUpdate]);

    const handleClose = () => {
        props.isClose(false);
    };

    function qtyDAMAGED() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'DAMAGED')
            if (dataFilter[0]?.qty !== undefined) return dataFilter[0]?.qty;
            if (dataFilter[0]?.qty === undefined) return 0;
        }
    }
    function qtyLIQUIDATED() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'LIQUIDATED')
            if (dataFilter[0]?.qty !== undefined) return dataFilter[0]?.qty;
            if (dataFilter[0]?.qty === undefined) return 0;
        }
    }
    function qtyUSING() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'USING')
            if (dataFilter[0]?.qty !== undefined) return dataFilter[0]?.qty;
            if (dataFilter[0]?.qty === undefined) return 0;
        }
    }
    function qtyWAREHOUSE() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'WAREHOUSE')
            if (dataFilter[0]?.qty !== undefined) return dataFilter[0]?.qty;
            if (dataFilter[0]?.qty === undefined) return 0;
        }
    }
    // 
    function idDAMAGED() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'DAMAGED')
            if (dataFilter[0]?.id !== undefined) return dataFilter[0]?.id;
            if (dataFilter[0]?.id === undefined) return '';
        }
    }
    function idLIQUIDATED() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'LIQUIDATED')
            if (dataFilter[0]?.id !== undefined) return dataFilter[0]?.id;
            if (dataFilter[0]?.id === undefined) return '';
        }
    }
    function idUSING() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'USING')
            if (dataFilter[0]?.id !== undefined) return dataFilter[0]?.id;
            if (dataFilter[0]?.id === undefined) return '';
        }
    }
    function idWAREHOUSE() {
        if (props.dataUpdate?.propertiesDetail) {
            const dataFilter = props.dataUpdate?.propertiesDetail.filter((item: any) => item?.state === 'WAREHOUSE')
            if (dataFilter[0]?.id !== undefined) return dataFilter[0]?.id;
            if (dataFilter[0]?.id === undefined) return '';
        }
    }


    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Cập nhật tài sản
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            id: props.dataUpdate.id,
                            name: props.dataUpdate.name,
                            note: props.dataUpdate.note,
                            qty: props.dataUpdate.qty,
                            idDAMAGED: idDAMAGED(),
                            qtyDAMAGED: qtyDAMAGED(),
                            idLIQUIDATED: idLIQUIDATED(),
                            qtyLIQUIDATED: qtyLIQUIDATED(),
                            idUSING: idUSING(),
                            qtyUSING: qtyUSING(),
                            idWAREHOUSE: idWAREHOUSE(),
                            qtyWAREHOUSE: qtyWAREHOUSE(),
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Tên tài sản không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateAssetLib(values)

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
                                        <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                                            <TextField
                                                id="outlined-adornment-name"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên tài sản"
                                                variant="outlined"
                                            />
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {errors.name}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qty && errors.qty)}>
                                            <TextField
                                                id="outlined-adornment-qty"
                                                type="number"
                                                value={values.qty}
                                                name="qty"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Số lượng tổng"
                                                variant="outlined"
                                            />
                                            {touched.qty && errors.qty && (
                                                <FormHelperText error id="standard-weight-helper-text-qty">
                                                    {errors.qty}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qty && errors.qty)}>
                                            <TextField
                                                id="outlined-adornment-qty"
                                                type="number"
                                                value={values.qtyWAREHOUSE}
                                                name="qtyWAREHOUSE"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{readOnly: true}}
                                                label="Số lượng kho"
                                                variant="outlined"
                                            />
                                            {touched.qty && errors.qty && (
                                                <FormHelperText error id="standard-weight-helper-text-qty">
                                                    {errors.qty}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qty && errors.qty)}>
                                            <TextField
                                                id="outlined-adornment-qty"
                                                type="number"
                                                value={values.qtyUSING}
                                                name="qtyUSING"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Số lượng sử dụng"
                                                variant="outlined"
                                            />
                                            {touched.qty && errors.qty && (
                                                <FormHelperText error id="standard-weight-helper-text-qty">
                                                    {errors.qty}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qty && errors.qty)}>
                                            <TextField
                                                id="outlined-adornment-qty"
                                                type="number"
                                                value={values.qtyLIQUIDATED}
                                                name="qtyLIQUIDATED"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Số lượng thanh lý"
                                                variant="outlined"
                                            />
                                            {touched.qty && errors.qty && (
                                                <FormHelperText error id="standard-weight-helper-text-qty">
                                                    {errors.qty}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.qty && errors.qty)}>
                                            <TextField
                                                id="outlined-adornment-qty"
                                                type="number"
                                                value={values.qtyDAMAGED}
                                                name="qtyDAMAGED"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Số lượng hư hỏng"
                                                variant="outlined"
                                            />
                                            {touched.qty && errors.qty && (
                                                <FormHelperText error id="standard-weight-helper-text-qty">
                                                    {errors.qty}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.note && errors.note)}>
                                            <TextField
                                                id="outlined-adornment-note"
                                                type="text"
                                                value={values.note}
                                                name="note"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Mô tả"
                                                variant="outlined"
                                            />
                                            {touched.note && errors.note && (
                                                <FormHelperText error id="standard-weight-helper-text-note">
                                                    {errors.note}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật" disabled={isSubmitting} width="100%" type="submit" />
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
