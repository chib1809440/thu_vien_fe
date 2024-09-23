import React from "react";
import IBreadcrumsCustom from "../../../../../ui-component/breadcrums";
import MainCard from "../../../../../ui-component/cards/MainCard";
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
import im from "../../../../../assets/images/users/default-avata.png";
import { UN_AUTHORIZED } from "../../../../../constant/authorization";
import useScriptRef from "../../../../../hooks/useScriptRef";
import ButtonGD from "../../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../../ui-component/extended/AnimateButton";
import { useCreateUser } from "../hook/createUser";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateAccount(props: {
    isSubmit: any;
    isCancel: any;
}) {

    const scriptedRef = useScriptRef();
    const { hanldCreateUser, isSubmit } = useCreateUser()

    const [isGender, setGender] = React.useState<string>('0');

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
            <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ TÀI KHOẢN" link="/trang-chu" />
            <MainCard title="THÊM MỚI TÀI KHOẢN">
                <Grid height='auto'>
                    <Formik
                        initialValues={{
                            anotherName: '',
                            anoPassword: '',
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
                            anotherName: Yup.string().max(255).required('Tài khoản không đuợc trống').min(6, 'Tài khoản tối thiểu phải 6 ký tự.'),
                            anoPassword: Yup.string().max(255).required('Mật khẩu không đuợc trống').min(6, 'Mật khẩu quá ngắn - tối thiểu phải 6 ký tự.'),
                            fullName: Yup.string().max(255).required('Họ tên không đuợc trống'),
                            // addressUser: Yup.string().max(255).required('Địa chỉ không đuợc trống'),
                            // numberPhone: Yup.number().typeError("Vui lòng nhập đúng định dạng số điện thoại").required('Số điện thoại không được để trống'),
                            numberPhone: Yup.string()
                                .required('Số điện thoại không được trống')
                                .matches(/^0/, 'Số điện thoại phải bắt đầu bằng số 0'),
                            emailUser: Yup.string().email('Vui lòng nhập đúng định dạng email').max(255)

                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateUser(values, selectedFile, isGender)

                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                                // if (statusCre === 400) {
                                //     setErrors({ anotherName: 'Tài khoản đã bị trùng' });
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
                                            <Grid md={3.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.anotherName && errors.anotherName)}>
                                                    <TextField
                                                        type="text"
                                                        value={values.anotherName}
                                                        name="anotherName"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{
                                                            autoComplete: "off",
                                                        }}
                                                        label="Tài khoản"
                                                    />
                                                    {touched.anotherName && errors.anotherName && (
                                                        <FormHelperText error id="standard-weight-helper-text-anotherName">
                                                            {errors.anotherName}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={3.5} sm={5.5} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.anoPassword && errors.anoPassword)}>
                                                    <TextField
                                                        id="outlined-adornment-anoPassword"
                                                        type="anoPassword"
                                                        value={values.anoPassword}
                                                        name="anoPassword"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                        label="Mật khẩu"

                                                    />
                                                    {touched.anoPassword && errors.anoPassword && (
                                                        <FormHelperText error id="standard-weight-helper-text-anoPassword">
                                                            {errors.anoPassword}
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
                                                        type="email"
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
                                            {/* <Grid md={3.5} sm={5.5} xs={12}>
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
                                                        <MenuItem value='2'>Quản trị</MenuItem>
                                                        <MenuItem value='1'>Giáo viên</MenuItem>
                                                        <MenuItem value='0'>Học sinh</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid> */}
                                        </Grid>
                                    </Grid>


                                    {/* <Grid md={3.5} sm={5.5} xs={12}>
                                        <Grid container width='100%' height='100%' alignItems='center'>
                                            <InputLabel sx={{ fontWeight: '700' }} id="upload-photo"> Chọn hình ảnh
                                                <Input inputProps={{ accept: 'image/*' }} type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                                                    onChange={handleImageInput}
                                                />
                                            </InputLabel>
                                        </Grid>
                                    </Grid>
                                    <Grid md={3.5} sm={5.5} xs={12}>
                                        <Grid sx={{ width: '150px', height: '150px', borderRadius: '30px' }}>
                                            {preview === '' ? <img width='auto' height='100%' src={im} alt="avata" /> : <img width='auto' height='100%' src={preview} alt="avata" />}
                                        </Grid>
                                    </Grid> */}
                                </Grid>

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid xs={1}>
                                        <AnimateButton>
                                            <ButtonGD width="100%" title="Thêm mới" disabled={isSubmitting} type="submit" />
                                        </AnimateButton>
                                    </Grid>
                                    <Grid xs={1}>
                                        <AnimateButton>
                                            <ButtonGD title="Huỷ" isColor disabled={isSubmitting} width="100%"
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
