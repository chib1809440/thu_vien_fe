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
import { useUpdateTypeSuply } from "../hook/updateTypeSuply";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function UpdateModal(props: {
    isOpen: any;
    isClose: any;
    dataUpdate: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldUpdateTypeSuply, isUpdate } = useUpdateTypeSuply()

    React.useEffect(() => {
        props.isClose(isUpdate);
    }, [isUpdate]);

    const handleClose = () => {
        props.isClose(true);
    };

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Cập nhật lĩnh vực
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            categoryId: props.dataUpdate.id,
                            categoryName: props.dataUpdate.name,
                            categoryDescription: props.dataUpdate.note,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            categoryName: Yup.string().required('Tên lĩnh vực không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateTypeSuply(values)

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
                                        <FormControl fullWidth error={Boolean(touched.categoryName && errors.categoryName)}>
                                            <TextField
                                                id="outlined-adornment-categoryName"
                                                type="text"
                                                value={values.categoryName}
                                                name="categoryName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên lĩnh vực"
                                                variant="outlined"
                                            />
                                            {touched.categoryName && errors.categoryName && (
                                                <FormHelperText error id="standard-weight-helper-text-categoryName">
                                                    {errors.categoryName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl fullWidth error={Boolean(touched.categoryDescription && errors.categoryDescription)}>
                                            <TextField
                                                id="outlined-adornment-categoryDescription"
                                                type="text"
                                                value={values.categoryDescription}
                                                name="categoryDescription"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Mô tả"
                                                variant="outlined"
                                            />
                                            {touched.categoryDescription && errors.categoryDescription && (
                                                <FormHelperText error id="standard-weight-helper-text-categoryDescription">
                                                    {errors.categoryDescription}
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
