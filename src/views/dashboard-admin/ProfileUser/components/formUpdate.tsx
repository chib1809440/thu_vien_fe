import React from "react";
import IBreadcrumsCustom from "../../../../ui-component/breadcrums";
import MainCard from "../../../../ui-component/cards/MainCard";
// material-ui
import {
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';

// third party
import { Box } from "@mui/system";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UN_AUTHORIZED } from "../../../../constant/authorization";
import useScriptRef from "../../../../hooks/useScriptRef";
import ButtonGD from "../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
import { useUpdateUser } from "../hook/updateUser";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function UpdateAccount(props: {
    isUp: any;
    isCancel: any;
    dataUpdate: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldUpdateUser, isUpdate } = useUpdateUser()

    const [isGender, setGender] = React.useState<string>('');
    const [isActive, setActive] = React.useState<number>(0);
    const [isRole, setRole] = React.useState<string>('0');

    React.useEffect(() => {
        props.isUp(isUpdate)
    }, [isUpdate])

    React.useEffect(() => {
        if (props.dataUpdate?.isActive) {
            setActive(0)
        } else {
            setActive(1)
        }
        setGender(props.dataUpdate.gender)
    }, [props.dataUpdate]);


    const [selectedFile, setSelectedFile] = React.useState();
    const [preview, setPreview] = React.useState('');

    React.useEffect(() => {
        if (!selectedFile) {
            setPreview('');
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const handleImageInput = (e: any) => {
        const file = e.target.files[0];
        const _5MB = 5242880;
        if (file.size > _5MB)
            setSelectedFile(file);
        else {
            setSelectedFile(file);
        }
    }

    const [, setValueDate] = React.useState('');
    const dateOff = new Date(props.dataUpdate.birthDay);


    function getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return year + '-' + month + '-' + day;
    }

    return (
        <>
            <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ TÀI KHOẢN" link="/trang-chu" />
            <MainCard title="CẬP NHẬT TÀI KHOẢN">
                <Grid height='auto'>
                    <Formik
                        initialValues={{
                            userID: props.dataUpdate?.userID,
                            username: props.dataUpdate?.username,
                            password: props.dataUpdate?.password,
                            gender: props.dataUpdate?.gender,
                            fullName: props.dataUpdate?.fullName,
                            addressUser: props.dataUpdate?.addressUser,
                            emailUser: props.dataUpdate?.emailUser,
                            numberPhone: props.dataUpdate?.numberPhone,
                            imageUser: props.dataUpdate?.imageUser,
                            birthDay: props.dataUpdate?.birthDay,
                            role: props.dataUpdate?.role,
                            groupId: props.dataUpdate?.groupId,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            fullName: Yup.string().max(255).required('Họ tên không đuợc trống'),
                            // addressUser: Yup.string().max(255).required('Địa chỉ không đuợc trống'),
                            numberPhone: Yup.string().max(255).required('Số điện thoại không đuợc trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateUser(values, selectedFile, isActive, isGender, isRole)

                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } catch (err: any) {
                                const errMessage = err && err.message == UN_AUTHORIZED ?
                                    "Sai tài khoản hoặc mật khẩu !" :
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
                                <Grid container md={12} justifyContent='space-between' height='auto' gap={2} mt={2}>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.fullName && errors.fullName)}>
                                            <TextField
                                                id="outlined-adornment-fullName-login"
                                                type="text"
                                                value={values.fullName}
                                                name="fullName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Họ và tên"

                                            />
                                            {touched.fullName && errors.fullName && (
                                                <FormHelperText error id="standard-weight-helper-text-fullName-login">
                                                    {errors.fullName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            defaultValue={getFormattedDate(dateOff)}
                                            label="Ngày sinh"
                                            onChange={(e) => setValueDate(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.emailUser && errors.emailUser)}>
                                            <TextField
                                                id="outlined-adornment-emailUser-login"
                                                type="text"
                                                value={values.emailUser}
                                                name="emailUser"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Email"

                                            />
                                            {touched.emailUser && errors.emailUser && (
                                                <FormHelperText error id="standard-weight-helper-text-emailUser-login">
                                                    {errors.emailUser}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.numberPhone && errors.numberPhone)}>
                                            <TextField
                                                id="outlined-adornment-numberPhone-login"
                                                type="text"
                                                value={values.numberPhone}
                                                name="numberPhone"
                                                onInput={(e: any) => {
                                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                }}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Số điện thoại"

                                            />
                                            {touched.numberPhone && errors.numberPhone && (
                                                <FormHelperText error id="standard-weight-helper-text-numberPhone-login">
                                                    {errors.numberPhone}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.addressUser && errors.addressUser)}>
                                            <TextField
                                                id="outlined-adornment-addressUser-login"
                                                type="text"
                                                value={values.addressUser}
                                                name="addressUser"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                label="Địa chỉ"

                                            />
                                            {touched.addressUser && errors.addressUser && (
                                                <FormHelperText error id="standard-weight-helper-text-addressUser-login">
                                                    {errors.addressUser}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12} container justifyContent='space-around'>
                                        <FormControl sx={{ width: '45%' }}>
                                            <InputLabel id="gender-simple-select-label">Giới tính</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="gender-simple-select"
                                                value={isGender}
                                                label="Giới tính"
                                                inputProps={{}}
                                                onBlur={handleBlur}
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                <MenuItem value={0}>Nam</MenuItem>
                                                <MenuItem value={1}>Nữ</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl sx={{ width: '45%' }}>
                                            <InputLabel id="role-simple-select-label">Vai trò</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="role-simple-select"
                                                value={isRole}
                                                label="Vai trò"
                                                inputProps={{}}
                                                onBlur={handleBlur}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                <MenuItem value='1'>Giáo viên</MenuItem>
                                                <MenuItem value='0'>Học sinh</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid md={3.5} sm={5.5} xs={12} container justifyContent='space-between' alignItems='center'>
                                    <Grid container width='45%' height='100%' alignItems='center'>
                                        <InputLabel sx={{ fontWeight: '700' }} id="upload-photo"> Chọn hình ảnh
                                            <Input type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                                                inputProps={{ accept: 'image/*' }}
                                                onChange={handleImageInput}
                                            />
                                        </InputLabel>
                                    </Grid>
                                    <Grid sx={{ width: '45%', height: '150px', borderRadius: '30px' }}>
                                        {preview === '' ?
                                            <img style={{ borderRadius: '5px' }} width='auto' height='100%' src={`${process.env.REACT_APP_BASE_API_URL}${props.dataUpdate?.imageUser}`} alt="avata" />
                                            :
                                            <img style={{ borderRadius: '5px' }} width='auto' height='100%' src={preview} alt="avata" />
                                        }
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật" color="secondary" disabled={isSubmitting} width="100%" type="submit" />
                                        </AnimateButton>
                                    </Grid>

                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Huỷ" isColor={true} disabled={isSubmitting} width="100%"
                                                onClick={() => props.isCancel(0)} />
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
            </MainCard>
        </>

    );
}
