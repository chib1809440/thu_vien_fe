import React, { useMemo, useState } from 'react';
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
    OutlinedInput,
    Typography
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
import { toast } from 'react-toastify';
import { UN_AUTHORIZED } from '../../../../constant/authorization';
import { useUpdateConfirmForgotPass, useUpdateForgotPass, useUpdateResetPass } from '../../../../hooks/react-query/userData';
import ChangePassDialog from './ui-components/ChangePassDialog';
import ConfirmForgotPassDialog from './ui-components/ConfirmForgotPassDialog';
import ForgotPassDialog from './ui-components/ForgotPassDialog';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const { login } = useAuth();
    const scriptedRef = useScriptRef();

    const [loginCount, setLoginCount] = React.useState(0);
    const [isCountdown, setCountdown] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(30);
    const timeCountdown = localStorage.getItem('timeCountdown');

    const mutationUpdateForgotPass = useUpdateForgotPass();
    const mutationUpdateConfirmForgotPass = useUpdateConfirmForgotPass();
    const mutationUpdateResetPass = useUpdateResetPass();
    const [accountName, setAccountName] = useState<{ username: string }>({ username: "" });
    const [resetData, setResetData] = useState<{ username: string; token: string }>({ username: '', token: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
    const [openDialogRessetPass, setOpenDialogRessetPass] = useState(false);

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

    const handleOpenDialog = () => setOpenDialog(true);

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSubmitForgotPass = (values: any) => {
        mutationUpdateForgotPass.mutate(
            { ...values },
            {
                onSuccess: () => {
                    toast.success("Gửi yêu cầu quên mật khẩu thành công! Vui lòng kiểm tra email.");
                    handleCloseDialog();
                    setAccountName({ username: values.username });
                    setOpenDialogConfirm(true);
                },
            }
        );

    }

    const handleSubmitConfirmForgotPass = (values: any) => {
        mutationUpdateConfirmForgotPass.mutate(
            { username: accountName.username, ...values },
            {
                onSuccess: (data) => {
                    const token = data?.data?.result?.token;
                    if (token) {
                        setResetData({
                            username: accountName.username,
                            token: token,
                        });
                        toast.success("Nhập mã xác thực thành công.");
                        setOpenDialogConfirm(false);
                        setOpenDialogRessetPass(true);
                    } else {
                        toast.error("Không tìm thấy token. Vui lòng thử lại.");
                    }
                },
            }
        );
    };

    const handleResetPasswordSubmit = (value: any) => {
        mutationUpdateResetPass.mutate(
            { username: resetData.username, token: resetData.token, ...value },
            {
                onSuccess: () => {
                    toast.success("Thay đổi mật khẩu thành công.");
                    setOpenDialogRessetPass(false);
                },
            }
        );
    };

    const initialValuesForgotPass = useMemo((): any => {
        return {
            username: "",
        };
    }, []);
    const initialValuesConfirmForgotPass = useMemo((): any => {
        return {
            code: "",
        };
    }, []);

    const initialValuesResetPass = useMemo((): any => {
        return {
            password: "",
            confirmPassword: "",
        };
    }, []);

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
                        <Grid item xs={12}>
                            <Button sx={{ float: "right", textTransform: "inherit" }} onClick={handleOpenDialog}>
                                <Typography
                                    variant="caption"
                                    fontSize="14px"
                                    color="#de524a"
                                >
                                    Quên mật khẩu?
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            {!isCountdown ?
                                <LoadingButton loading={isSubmitting} color="secondary" onClick={handleLogin} disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" sx={{ textTransform: "inherit" }}>
                                    Đăng Nhập
                                </LoadingButton>
                                :
                                <Button color="secondary" onClick={handleLogin} disabled fullWidth size="large" type="submit" variant="contained">
                                    {timeLeft}
                                </Button>
                            }
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
                    {
                        openDialog &&
                        <ForgotPassDialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            initialValues={initialValuesForgotPass}
                            onSubmit={handleSubmitForgotPass}
                        />
                    }
                    {
                        openDialogConfirm &&
                        <ConfirmForgotPassDialog
                            open={openDialogConfirm}
                            onClose={() => setOpenDialogConfirm(false)}
                            initialValues={initialValuesConfirmForgotPass}
                            onSubmit={handleSubmitConfirmForgotPass}
                        />
                    }
                    {
                        openDialogRessetPass &&
                        <ChangePassDialog
                            open={openDialogRessetPass}
                            onClose={() => setOpenDialogRessetPass(false)}
                            initialValues={initialValuesResetPass}
                            onSubmit={handleResetPasswordSubmit}
                        />
                    }
                </form>
            )}


        </Formik>
    );
};

export default JWTLogin;