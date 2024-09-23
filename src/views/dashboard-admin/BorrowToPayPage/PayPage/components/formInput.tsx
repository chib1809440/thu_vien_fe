import React from "react";
// material-ui
import {
    Button,
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
import { useCreateGroupPower } from "../../../SystemPage/DistributionOfPowers/hook/createGroupPower";
import ButtonGD from "../../../../../ui-component/ButtonGD";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateGroupPower(props: {
    isSubmit: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldCreateGroupPower, isSubmit } = useCreateGroupPower()

    React.useEffect(() => {
        props.isSubmit(isSubmit)
    }, [isSubmit]);

    return (
        <>
             <Grid height='auto'>
                    <Formik
                        initialValues={{
                            groupName: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            groupName: Yup.string().max(255).required('Tên nhóm không đuợc trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateGroupPower(values)

                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } catch (err: any) {
                                const errMessage = err && err.message == UN_AUTHORIZED ?
                                    "Lỗi hệ thống":"Lỗi hệ thống";

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
                                <Grid container justifyContent={window.screen.width >= 1024 ? 'flex-start' : 'space-between'} height='auto' gap={3}>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.groupName && errors.groupName)}>
                                            <TextField
                                                id="outlined-adornment-groupName-login"
                                                type="text"
                                                value={values.groupName}
                                                name="groupName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Tên nhóm"
                                                variant="outlined"
                                            />
                                            {touched.groupName && errors.groupName && (
                                                <FormHelperText error id="standard-weight-helper-text-groupName-login">
                                                    {errors.groupName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>


                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid  width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Thêm mới" color="secondary" disabled={isSubmitting} width="100%"  type="submit"/>

                                        </AnimateButton>
                                    </Grid>
                                    {/* <Grid  width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <Button color="error"  variant="contained" disabled={isSubmitting} fullWidth size="large" variant="contained"
                                                onClick={() => props.isCancel(true)}
                                            >
                                                Huỷ
                                            </Button>
                                        </AnimateButton>
                                    </Grid> */}
                                </Grid>
                                {errors.submit && (
                                    <Box sx={{ mt: 3 }}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                            </form>
                        )}
                    </Formik>
            </Grid>
        </>

    );
}
