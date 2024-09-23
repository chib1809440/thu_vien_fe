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
import { useUpdateTypeProduct } from "../hook/updateTypeProduct";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function UpdateModal(props: {
    isOpen: any;
    isClose: any;
    dataUpdate: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldUpdateTypeProduct, isUpdate } = useUpdateTypeProduct()

    React.useEffect(() => {
        if (isUpdate === 3) {
            props.isClose(false);
        }
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
                    Cập nhật học liệu
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            printedMatterId : props.dataUpdate.printedMatterId,
                            printedMatterName: props.dataUpdate.printedMatterName,
                            printedMatterDescription: props.dataUpdate.printedMatterDescription,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            printedMatterName: Yup.string().required('Tên học liệu không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateTypeProduct(values)

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
                                        <FormControl fullWidth error={Boolean(touched.printedMatterName && errors.printedMatterName)}>
                                            <TextField
                                                id="outlined-adornment-printedMatterName"
                                                type="text"
                                                value={values.printedMatterName}
                                                name="printedMatterName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên học liệu"
                                                variant="outlined"
                                            />
                                            {touched.printedMatterName && errors.printedMatterName && (
                                                <FormHelperText error id="standard-weight-helper-text-printedMatterName">
                                                    {errors.printedMatterName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.printedMatterDescription && errors.printedMatterDescription)}>
                                            <TextField
                                                id="outlined-adornment-printedMatterDescription"
                                                type="text"
                                                value={values.printedMatterDescription}
                                                name="printedMatterDescription"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Mô tả"
                                                variant="outlined"
                                            />
                                            {touched.printedMatterDescription && errors.printedMatterDescription && (
                                                <FormHelperText error id="standard-weight-helper-text-printedMatterDescription">
                                                    {errors.printedMatterDescription}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid  width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật"  disabled={isSubmitting} width="100%" type="submit"/>
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
