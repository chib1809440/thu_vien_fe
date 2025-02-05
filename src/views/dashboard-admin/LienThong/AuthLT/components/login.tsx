import React from 'react';
// material-ui
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from '../../../../../hooks/useScriptRef';
import { UN_AUTHORIZED } from '../../../../../constant/authorization';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AnimateButton from '../../../../../ui-component/extended/AnimateButton';
import { LoadingButton } from '@mui/lab';
import { AuthLT } from '../hook/AuthLT';
import styled from 'styled-components';
import ModalAddApi from './ModalAddApi';
import ModalControlApi from './ModalControlApi';

export default function LoginLienThong(props: {
    apiConnection: any;
}) {

    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const [loginCount, setLoginCount] = React.useState(0);
    const [isCountdown, setCountdown] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault()!;
    };

    const handleLogin = () => {
        setLoginCount(prevCount => prevCount + 1);
        if (loginCount === 5) {
            localStorage.setItem('timeCountdown', '30');
            setCountdown(true)
        }
    };

    const [timeLeft, setTimeLeft] = React.useState(30);
    const timeCountdown = localStorage.getItem('timeCountdown');

    React.useEffect(() => {
        setTimeLeft(Number(timeCountdown));
        if (Number(timeCountdown) !== 0) {
            setCountdown(true)
        }
    }, [timeCountdown]);

    React.useEffect(() => {
        if (timeLeft === 0) {
            localStorage.setItem('timeCountdown', '0');
            setLoginCount(0)
            setCountdown(false)
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => timeLeft - 1);
            localStorage.setItem('timeCountdown', timeLeft.toString());
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const [valueApi, setValueApi] = React.useState<any>([]);
    const [itemApi, setdataApi] = React.useState<any>([]);

    let newApi = [{
        label: '',
        id: ''
    }]

    React.useEffect(() => {
        if (props.apiConnection.length !== 0) {
            props.apiConnection.forEach((item) =>
                newApi.push({
                    label: item.name,
                    id: item.api
                }));
        }
        setValueApi(newApi.slice(1))
    }, [props.apiConnection])

    React.useEffect(() => {
        if (itemApi !== null && itemApi !== '') {
            localStorage.setItem("apiLT", itemApi.id);
        }
    }, [itemApi])

    const { loginLT } = AuthLT()

    const [isOpenModal, setOpenModal] = React.useState(false);
    const [isOpenModalControl, setOpenModalControl] = React.useState(false);


    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().max(255).required('Tài khoản không thể trống'),
                    password: Yup.string().max(255).required('Mật khẩu không thể trống')
                })}

                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await loginLT(values.username, values.password, itemApi);

                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err: any) {
                        const errMessage = err && err.message == UN_AUTHORIZED ?
                            "Không thể đăng nhập, hãy kiểm tra server!" :
                            "Tài khoản hoặc mật khẩu không đúng !";

                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: errMessage });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} >

                        <FormControl fullWidth >
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-Category"
                                options={valueApi}
                                // multiple
                                onChange={(event, newValue) => setdataApi(newValue)}
                                renderInput={(params) => <TextField {...params} label="Trung tâm liên thông" />}
                            />
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-username-login">Tên tài khoản</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username-login"
                                type="username"
                                value={values.username}
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.username && errors.username && (
                                <FormHelperText error id="standard-weight-helper-text-username-login">
                                    {errors.username}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password-login">Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                                label="Password"
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Grid container justifyContent='space-between'>
                            <CsTypography onClick={() => setOpenModal(true)}>Thêm trung tâm liên thông</CsTypography>
                            <CsTypography onClick={() => setOpenModalControl(true)}>Cài đặt trung tâm liên thông</CsTypography>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <LoadingButton loading={isSubmitting} color="secondary" onClick={handleLogin} disabled={isSubmitting || itemApi === null || values.password === '' || values.username === ''} fullWidth size="large" type="submit" variant="contained">
                                    Đăng Nhập
                                </LoadingButton>
                            </AnimateButton>
                        </Box>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                    </form>
                )}
            </Formik>
            <ModalAddApi isOpen={isOpenModal} isClose={(e) => setOpenModal(e)} />
            <ModalControlApi isOpen={isOpenModalControl} isClose={(e) => setOpenModalControl(e)} data={props.apiConnection} />
        </>
    );
}

const CsTypography = styled(Typography)`
    color: blue;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        transform: scale3d(1.02, 1.02, 1);
    }
    -webkit-user-select: none; /* For Webkit browsers */
    -moz-user-select: none; /* For Mozilla Firefox */
    -ms-user-select: none; /* For Microsoft Edge */
    user-select: none; /* Standard syntax */
`;