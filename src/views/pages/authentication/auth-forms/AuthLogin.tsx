import React from 'react';
// material-ui
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import useAuth from '../../../../hooks/useAuth';
import useScriptRef from '../../../../hooks/useScriptRef';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { UN_AUTHORIZED } from '../../../../constant/authorization';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const { login } = useAuth();
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

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().max(255).required('Tài khoản không thể trống'),
                password: Yup.string().max(255).required('Mật khẩu không thể trống')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    await login(values.email, values.password);

                    if (scriptedRef.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                    }
                } catch (err: any) {
                    const errMessage = err && err.message == UN_AUTHORIZED ?
                        "Tài khoản hoặc mật khẩu không đúng !" :
                        "Không thể đăng nhập, hãy kiểm tra server!";

                    if (scriptedRef.current) {
                        setStatus({ success: false });
                        setErrors({ submit: errMessage });
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-login">Địa chỉ Email / Tên tài khoản</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-login"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.email}
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

                    <Grid container alignItems="center" justifyContent="space-between">
                        {/* <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Keep me logged in"
                            />
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="subtitle1"
                                component={Link}
                                to={
                                    loginProp
                                        ? `/pages/forgot-password/forgot-password${loginProp}`
                                        : '/pages/forgot-password/forgot-password3'
                                }
                                color="secondary"
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Typography>
                        </Grid> */}
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            {!isCountdown ?
                                <LoadingButton loading={isSubmitting} color="secondary" onClick={handleLogin} disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                    Đăng Nhập
                                </LoadingButton>
                                :
                                <Button color="secondary" onClick={handleLogin} disabled fullWidth size="large" type="submit" variant="contained">
                                    {timeLeft}
                                </Button>
                            }
                            {/* :
                                <Button endIcon={<CircularProgress />} color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                    Đăng Nhập
                                </Button> */}
                        </AnimateButton>
                    </Box>
                    {isCountdown &&
                        <>
                            <FormHelperText error>{`Bạn đã đăng nhập sai quá nhiều lần`} </FormHelperText>
                            <FormHelperText error>{`Vui lòng chờ ${timeLeft} giây để đăng nhập lại`} </FormHelperText>
                        </>
                    }
                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                </form>
            )}
        </Formik>
    );
};

export default JWTLogin;