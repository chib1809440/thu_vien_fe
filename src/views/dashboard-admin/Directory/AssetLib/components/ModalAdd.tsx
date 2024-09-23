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
import { useCreateAssetLib } from "../hook/createAssetLib";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateModal(props: {
    isOpen: any;
    isClose: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldCreateAssetLib, isSubmit } = useCreateAssetLib()
    const handleClose = () => {
        props.isClose(false);
    };
    React.useEffect(() => {
        if (isSubmit)
        props.isClose(false);
    }, [isSubmit]);

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Thêm tài sản
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: '',
                            note: '',
                            qty: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Tên tài sản không được để trống'),
                            qty: Yup.number().required('Số lượng tài sản không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateAssetLib(values)

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
                                                label="Số lượng"
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
                                    <Grid  width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Thêm mới" color="secondary" disabled={isSubmitting || values.name === '' || values.qty === '' || Number(values.qty) < 0} width="100%"  type="submit"/>
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
