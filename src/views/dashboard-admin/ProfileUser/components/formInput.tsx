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
import { useCreateUser } from "../hook/createUser";
import im from "../../../../assets/images/users/default-avata.png";

// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateAccount(props: {
    isSubmit: any;
    isCancel: any;
    dataGroupPower: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldCreateUser, isSubmit } = useCreateUser()

    const [isGender, setGender] = React.useState<string>('0');
    const [isRole, setRole] = React.useState<string>('0');


    React.useEffect(() => {
        props.isSubmit(isSubmit)
    }, [isSubmit]);

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

    return (
        <>
            <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ THÀNH VIÊN" link="/trang-chu" />
            <MainCard title="THÊM MỚI THÀNH VIÊN">
                <Grid height='auto'>
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                            gender: '',
                            fullName: '',
                            addressUser: '',
                            emailUser: '',
                            numberPhone: '',
                            imageUser: 'IOTA.png',
                            birthDay: '2000-01-01',
                            role: '',
                            groupId: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            fullName: Yup.string().max(255).required('Họ tên không đuợc trống'),
                            // addressUser: Yup.string().max(255).required('Địa chỉ không đuợc trống'),
                            numberPhone: Yup.string()
                                .required('Số điện thoại không được trống')
                                .matches(/^0/, 'Số điện thoại phải bắt đầu bằng số 0')
                                .min(10, 'Số điện thoại phải có 10 số'),
                            emailUser: Yup.string().email('Vui lòng nhập đúng định dạng email').max(255)

                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateUser(values, selectedFile, isGender, isRole)

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
                                {/* <Grid container md={12} justifyContent='space-between' height='auto' gap={2} mt={2}> */}
                                <Grid container md={12}>
                                    <Grid md={2} container>
                                        <Grid md={12}>
                                            <Grid sx={{ width: '90%', height: 'auto', borderRadius: '30px' }}>
                                                {preview === '' ? <img width='100%' height='auto' src={im} alt="avata" /> : <img width='100%' height='100%' src={preview} alt="avata" />}
                                            </Grid>
                                        </Grid>
                                        <Grid md={12} container justifyContent='center'>
                                            <InputLabel sx={{ fontWeight: '700' }} id="upload-photo"> Chọn hình ảnh
                                                <Input inputProps={{ accept: 'image/*' }} type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                                                    onChange={handleImageInput}
                                                />
                                            </InputLabel>
                                        </Grid>
                                    </Grid>
                                    <Grid md={10}>
                                        <Grid container md={12} gap={2} justifyContent='space-between'>
                                            {/* <Grid md={3.5} sm={5.5} xs={12}>
                                        <FormControl fullWidth error={Boolean(touched.username && errors.username)}>
                                            <TextField
                                                id="outlined-adornment-username"
                                                type="username"
                                                value={values.username}
                                                name="username"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
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
                                    </Grid> */}
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
                                                        label="Họ và tên"

                                                    />
                                                    {touched.fullName && errors.fullName && (
                                                        <FormHelperText error id="standard-weight-helper-text-fullName">
                                                            {errors.fullName}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={3.5} sm={5.5} xs={12} height="50px">
                                                <FormControl fullWidth error={Boolean(touched.birthDay && errors.birthDay)}>
                                                    <TextField
                                                        id="outlined-adornment-birthDay"
                                                        type="date"
                                                        value={values.birthDay}
                                                        name="birthDay"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        defaultValue="2000-01-01"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Ngày sinh"

                                                    />
                                                    {touched.birthDay && errors.birthDay && (
                                                        <FormHelperText error id="standard-weight-helper-text-birthDay">
                                                            {errors.birthDay}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={3.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.emailUser && errors.emailUser)}>
                                                    <TextField
                                                        id="outlined-adornment-emailUser"
                                                        type="text"
                                                        value={values.emailUser}
                                                        name="emailUser"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                        label="Email"
                                                    />
                                                    {touched.emailUser && errors.emailUser && (
                                                        <FormHelperText error id="standard-weight-helper-text-emailUser">
                                                            {errors.emailUser}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={3.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.numberPhone && errors.numberPhone)}>
                                                    <TextField
                                                        id="outlined-adornment-numberPhone-login"
                                                        type="tel"  // Sử dụng type "tel" để hiển thị bàn phím số trên điện thoại di động
                                                        value={values.numberPhone}
                                                        name="numberPhone"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            // Chỉ cho phép giữ lại các ký tự số
                                                            const phoneNumber = e.target.value.replace(/[^0-9]/g, '');
                                                            // Giới hạn độ dài của số điện thoại nếu cần
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
                                            <Grid md={3.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth>
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
                                                        <MenuItem value='0'>Nam</MenuItem>
                                                        <MenuItem value='1'>Nữ</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid md={3.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth>
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
                                    </Grid>


                                </Grid>


                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Thêm mới" color="secondary" disabled={isSubmitting || values.fullName === '' || values.numberPhone.length < 10} width="100%" type="submit" />
                                        </AnimateButton>
                                    </Grid>
                                    <Grid width={window.screen.width >= 1024 ? '200px' : '200px'}>
                                        <AnimateButton>
                                            <ButtonGD title="Huỷ" isColor color="error" disabled={isSubmitting} width="100%"
                                                onClick={() => props.isCancel(0)}
                                            >
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
                </Grid>
            </MainCard>
        </>

    );
}
