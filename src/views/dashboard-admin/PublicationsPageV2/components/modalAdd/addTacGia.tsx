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
import { useCreateTypeProduct } from "../../../Directory/Author/hook/createTypeProduct";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function ModalTacGia(props: {
    isOpen: any;
    isClose: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldCreateTypeProduct, isSubmit } = useCreateTypeProduct()
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
                    Thêm tác giả
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            authorName: '',
                            authorDescription: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            authorName: Yup.string().required('Tên tác giả không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateTypeProduct(values)

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
                                        <FormControl fullWidth error={Boolean(touched.authorName && errors.authorName)}>
                                            <TextField
                                                id="outlined-adornment-authorName"
                                                type="text"
                                                value={values.authorName}
                                                name="authorName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên tác giả"
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
                                        <FormControl fullWidth error={Boolean(touched.authorDescription && errors.authorDescription)}>
                                            <TextField
                                                id="outlined-adornment-authorDescription"
                                                type="text"
                                                value={values.authorDescription}
                                                name="authorDescription"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Mô tả"
                                                variant="outlined"
                                            />
                                            {touched.authorDescription && errors.authorDescription && (
                                                <FormHelperText error id="standard-weight-helper-text-authorDescription">
                                                    {errors.authorDescription}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Thêm mới" disabled={isSubmitting} width="100%" type="submit">

                                            </ButtonGD>
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
                    <ButtonGD title="Hủy bỏ" isColor onClick={handleClose}>

                    </ButtonGD>
                    {/* <Button color="success" onClick={() => handleComform(selected)}>Chắn chắn</Button> */}
                </DialogActions>
            </Dialog>
        </>

    );
}
