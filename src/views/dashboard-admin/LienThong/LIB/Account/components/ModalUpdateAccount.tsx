import React from 'react';
import { Button, CardActions, CardContent, Divider, FormControl, FormHelperText, Grid, IconButton, Modal, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from '../../../../../../ui-component/cards/MainCard';
import { Box } from "@mui/system";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UN_AUTHORIZED } from "../../../../../../constant/authorization";
import useScriptRef from "../../../../../../hooks/useScriptRef";
import ButtonGD from "../../../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../../../ui-component/extended/AnimateButton";
import { useCreateSuppliesLT } from './hook/useAccountLT';


const ModalWrapper = styled('div')({
    marginBottom: 16,
    height: 500,
    flexGrow: 1,
    minWidth: 300,
    zIndex: -1,
    transform: 'translateZ(0)',
    '@media all and (-ms-high-contrast: none)': {
        display: 'none'
    }
});

// ==============================|| SERVER MODAL ||============================== //

export default function ModalUpdateAccount(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
}) {
    const rootRef = React.useRef(null);
    const scriptedRef = useScriptRef();

    const [isOpen, setOpen] = React.useState(false);

    const { hanldUpdateAccount, isUpAcount } = useCreateSuppliesLT()

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    React.useEffect(() => {
        if (isUpAcount) {
            setOpen(false)
            props.isClose(false)
        }
    }, [isUpAcount])


    function handleClose() {
        setOpen(false)
        props.isClose(false)
    }

    return (
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={isOpen}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            sx={{
                display: 'flex',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            container={() => rootRef.current}
        >
            <MainCard
                sx={{
                    width: 'auto',
                    zIndex: 1
                }}
                title='Thêm mới tài khoản'
                content={false}
                secondary={
                    <IconButton size="large">
                        <CloseIcon fontSize="small" onClick={handleClose} />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid height='auto'>
                        <Formik
                            initialValues={{
                                userID: props.data?.userID,
                                username: props.data?.username,
                                password: props.data?.password ? props.data?.password : '',
                                fullName: props.data?.fullName,
                                schoolName: props.data?.schoolName,
                                addressUser: props.data?.addressUser,
                                numberPhone: props.data?.numberPhone,
                                role: props.data?.role,
                                submit: null
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().max(255).required('Tài khoản không đuợc trống').min(6, 'Tài khoản tối thiểu phải 6 ký tự.'),
                                // password: Yup.string().max(255).required('Mật khẩu không đuợc trống').min(6, 'Mật khẩu quá ngắn - tối thiểu phải 6 ký tự.'),
                                schoolName: Yup.string().max(255).required('Tên trường không đuợc trống'),
                                fullName: Yup.string().max(255).required('Tên người quản lý không đuợc trống'),
                                addressUser: Yup.string().max(255).required('Địa chỉ không đuợc trống'),
                                // numberPhone: Yup.number().typeError("Vui lòng nhập đúng định dạng số điện thoại").required('Số điện thoại không được để trống'),
                                numberPhone: Yup.string()
                                    .required('Số điện thoại không được trống')
                                    .matches(/^0/, 'Số điện thoại phải bắt đầu bằng số 0'),
                            })}
                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                try {
                                    await hanldUpdateAccount(values)

                                    if (scriptedRef.current) {
                                        setStatus({ success: true });
                                        setSubmitting(false);
                                    }
                                    // if (statusCre === 400) {
                                    //     setErrors({ username: 'Tài khoản đã bị trùng' });
                                    // }
                                } catch (err: any) {
                                    const errMessage = err && err.message == UN_AUTHORIZED ?
                                        "Tài khoản không thể tạo !" :
                                        "Lỗi hệ thống";

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
                                    <Grid container md={12}>
                                        <Grid md={12}>
                                            <Grid container md={12} gap={2} justifyContent='space-between'>
                                                <Grid md={3.5} sm={5.5} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.username && errors.username)}>
                                                        <TextField
                                                            type="text"
                                                            value={values.username}
                                                            name="username"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{
                                                                autoComplete: "off",
                                                            }}
                                                            label="Tài khoản"
                                                        />
                                                        {touched.username && errors.username && (
                                                            <FormHelperText error id="standard-weight-helper-text-username">
                                                                {errors.username}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid md={3.5} sm={5.5} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                                                        <TextField
                                                            id="outlined-adornment-password"
                                                            type="password"
                                                            value={values.password}
                                                            name="password"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                            label="Mật khẩu"

                                                        />
                                                        {touched.password && errors.password && (
                                                            <FormHelperText error id="standard-weight-helper-text-password">
                                                                {errors.password}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid md={3.5} sm={5.5} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.schoolName && errors.schoolName)}>
                                                        <TextField
                                                            id="outlined-adornment-schoolName"
                                                            type="text"
                                                            value={values.schoolName}
                                                            name="schoolName"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                            label="Tên trường"

                                                        />
                                                        {touched.schoolName && errors.schoolName && (
                                                            <FormHelperText error id="standard-weight-helper-text-schoolName">
                                                                {errors.schoolName}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid md={3.5} sm={5.5} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.fullName && errors.fullName)}>
                                                        <TextField
                                                            id="outlined-adornment-fullName"
                                                            type="text"
                                                            value={values.fullName}
                                                            name="fullName"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                            label="Tên người quản lý"

                                                        />
                                                        {touched.fullName && errors.fullName && (
                                                            <FormHelperText error id="standard-weight-helper-text-fullName">
                                                                {errors.fullName}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid md={3.5} sm={5.5} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.numberPhone && errors.numberPhone)}>
                                                        <TextField
                                                            id="outlined-adornment-numberPhone-login"
                                                            type="tel"
                                                            value={values.numberPhone}
                                                            name="numberPhone"
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                const phoneNumber = e.target.value.replace(/[^0-9]/g, '');
                                                                const maxLength = 10;
                                                                const truncatedPhoneNumber = phoneNumber.slice(0, maxLength);

                                                                // Cập nhật giá trị
                                                                handleChange({
                                                                    target: {
                                                                        name: 'numberPhone',
                                                                        value: truncatedPhoneNumber,
                                                                    },
                                                                });
                                                            }}
                                                            label="Số điện thoại"
                                                        />
                                                        {touched.numberPhone && errors.numberPhone && (
                                                            <FormHelperText error id="standard-weight-helper-text-numberPhone">
                                                                {errors.numberPhone}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid md={3.5} sm={5.5} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.addressUser && errors.addressUser)}>
                                                        <TextField
                                                            id="outlined-adornment-addressUser"
                                                            type="text"
                                                            value={values.addressUser}
                                                            name="addressUser"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                            label="Địa chỉ"

                                                        />
                                                        {touched.addressUser && errors.addressUser && (
                                                            <FormHelperText error id="standard-weight-helper-text-addressUser">
                                                                {errors.addressUser}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>


                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                        <Grid xs={1}>
                                            <AnimateButton>
                                                <ButtonGD width="100%" title="Thêm mới" disabled={isSubmitting} type="submit" />
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
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button color='error' variant="contained" type="button" sx={{ textTransform: 'none' }} onClick={handleClose}>
                            Huỷ
                        </Button>
                    </Grid>
                </CardActions>
                <Divider />
            </MainCard>
        </Modal>
    );
}
