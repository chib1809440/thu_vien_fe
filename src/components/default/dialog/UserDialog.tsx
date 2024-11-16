import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorResponse } from "../../../interfaces/errorResponse";
import { Entity } from "draft-js";
import { EntityResponse } from "../../../interfaces/entityResponse";
import { CreateUserModel, User } from "../../../interfaces/user";
import { useCreateUser, useUpdateUser } from "../../../hooks/react-query/userData";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { generateUserName } from "../../../helpers/generateUserName";
import { IconHttpDelete, IconSquareXFilled } from "@tabler/icons-react";
import { useRoleList } from "../../../hooks/react-query/roleData";
import { Role } from "../../../interfaces/role";
import { getLabelFromOptions } from "../../../utils/object";
import { statusRole } from "../../../utils/constants.utils";
import useAuth from "../../../hooks/useAuth";
export const validationUtilizedObjectSchema = yup.object({
    fullname: yup.string().required("Vui lòng nhập họ và tên"),
    email: yup.string().email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(
            /^(\+84|0[3|5|7|8|9])+([0-9]{8})$/,
            "Số điện thoại không hợp lệ, vui lòng nhập số hợp lệ"
        ),
    roleId: yup
        .string()
        .required("Vui lòng chọn vai trò").notOneOf(['0'], "Vui lòng chọn vai trò"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),

    birthday: yup.string().required("Vui lòng nhập ngày sinh"),
    gender: yup.string().required("Vui lòng nhập giới tính"),

});
interface DialogProps {
    id?: string,
    open: boolean,
    handleOpen: (e) => void,
    fullScreen?: boolean,
    content?: React.ReactNode,
    action?: React.ReactNode,
    title: string,
    user?: User,
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}
export default function UserDialog({ title, maxWidth, id, content, action, fullScreen, open, user, handleOpen }: DialogProps) {
    const [formData, setFormData] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState<string | string[]>(null);
    const [birthday, setBirthday] = useState(new Date());
    const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(null); // State cho ảnh xem trước
    const [avatarFile, setAvatarFile] = useState<File>(null); // State cho ảnh xem trước
    // Hàm để xử lý khi người dùng chọn ảnh
    const { data: roles, isPending, error, isError, isPlaceholderData, isFetching, refetch } =
        useRoleList();
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result); // Cập nhật hình ảnh xem trước
            };
            reader.readAsDataURL(file); // Đọc file và chuyển đổi thành URL
            setAvatarFile(file);
        }
        event.target.value = null;
    };


    const handleRemoveAvatar = () => {
        setAvatarPreview(null); // Reset hình ảnh xem trước
        setAvatarFile(null); // Reset hình ảnh xem trước
    };

    const onSuccess = (data: EntityResponse<User>) => {
        if (data.statusCode) {
            const { statusCode, message } = data;
            if (statusCode === 200 || statusCode === 201) {
                handleOpen(false);
                if (!id) {
                    formik.resetForm();
                    toast.success("Thêm dữ liệu thành công", {});
                    return;
                }
                toast.success("Cập nhật dữ liệu thành công", {});
            } else {

                setEntityError(message);
            }
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const OnError = (data: ErrorResponse) => {
        console.log('toi day', data);
        if (data.statusCode) {
            const { statusCode, message } = data;

            setEntityError(message);
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const { mutate: createUser, isPending: isPendingInsert, isSuccess } = useCreateUser(onSuccess, OnError);
    const { mutate: updateUser, isPending: isPendingUpdate } = useUpdateUser(onSuccess, OnError);
    const formik = useFormik({
        initialValues: {
            fullname: user?.fullname ?? "",
            email: user?.email ?? "",
            phoneNumber: user?.phoneNumber ?? "",
            address: user?.address ?? "",
            gender: user?.gender ?? "",
            roleId: (user?.roleId as Role)?._id ?? '0',
            birthday: (new Date().toDateString()),
            class: user?.class ?? "",
            school: user?.school ?? "",

        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {
                setLoading(true);
                const formData = new FormData();
                console.log(values);
                formData.append("fullname", values.fullname);
                formData.append("email", values.email); // Thêm email nếu cần
                formData.append("phoneNumber", values.phoneNumber); // Thêm số điện thoại nếu cần
                formData.append("address", values.address); // Thêm địa chỉ nếu cần
                formData.append("gender", values.gender);
                formData.append("birthday", values.birthday);
                formData.append("roleId", values.roleId);
                formData.append("class", values.class);
                formData.append("school", values.school);
                if (avatarFile) {
                    formData.append("file", avatarFile);
                }
                if (!user) {
                    createUser(formData);
                } else {
                    formData.append("_id", user._id)
                    updateUser({ id: user._id, data: formData });
                }
            } catch (error: any) {
                setLoading(false);
                let errorResponse: ErrorResponse = error.response.data;
                setEntityError(errorResponse.message);
            }
        },
    });
    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (user) {
            formik.setValues({
                fullname: user?.fullname ?? "",
                email: user?.email ?? "",
                phoneNumber: user?.phoneNumber ?? "",
                address: user?.address ?? "",
                birthday: user?.birthday ?? "",
                gender: user?.gender ?? "",
                roleId: (user?.roleId as Role)?._id ?? '0',
                class: user?.class ?? "",
                school: user?.school ?? "",
            });
        }
    }, [user]);
    console.log("dsadsd", user);

    const { logout, user: userAuth } = useAuth();
    useEffect(() => {
        if (!userAuth) return null;

        const _userAuth = { ...userAuth } as any;
        if (!user) {
            let school = _userAuth?.data?.libraryDetail.name;
            formik.setFieldValue("school", school)
        }
    }, [userAuth]);
    const onHandleClose = () => {
        handleOpen(false);
        if (id) {
            formik.resetForm();
            setEntityError(null);
        }
    };
    if (isPending) {
        return <>Loading......</>
    }

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, pb: 2 }} id="customized-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 4, py: 0 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap="12px"
                        >
                            {Array.isArray(entityError) ? (
                                entityError.map((error, index) => (
                                    <Typography
                                        key={index}
                                        sx={{ mb: 1.5, fontWeight: "bold" }}
                                        className="required_text"
                                    >
                                        {error}
                                    </Typography>
                                ))
                            ) : (
                                <Typography
                                    sx={{ mb: 1.5, fontWeight: "bold" }}
                                    className="required_text"
                                >
                                    {entityError}
                                </Typography>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Họ và tên <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="fullname"
                                                    name="fullname"
                                                    value={formik.values.fullname}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.fullname &&
                                                        Boolean(formik.errors.fullname)
                                                    }
                                                />
                                                {formik.touched.fullname &&
                                                    Boolean(formik.errors.fullname) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.fullname
                                                                ? formik.errors.fullname.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Số điện thoại <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={formik.values.phoneNumber}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.phoneNumber &&
                                                        Boolean(formik.errors.phoneNumber)
                                                    }
                                                />
                                                {formik.touched.phoneNumber &&
                                                    Boolean(formik.errors.phoneNumber) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.phoneNumber
                                                                ? formik.errors.phoneNumber.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Email <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="email"
                                                    name="email"
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.email &&
                                                        Boolean(formik.errors.email)
                                                    }
                                                />
                                                {formik.touched.email &&
                                                    Boolean(formik.errors.email) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.email
                                                                ? formik.errors.email.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Giới tính  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="gender"
                                                    name="gender"
                                                    type="gender"
                                                    value={formik.values.gender}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.gender &&
                                                        Boolean(formik.errors.gender)
                                                    }
                                                >
                                                    <MenuItem
                                                        key={0}
                                                        value="nữ"
                                                    >
                                                        Nữ
                                                    </MenuItem>
                                                    <MenuItem
                                                        key={1}
                                                        value="nam"
                                                    >
                                                        Nam
                                                    </MenuItem>
                                                    <MenuItem
                                                        key={1}
                                                        value="khác"
                                                    >
                                                        Khác
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formik.touched.gender &&
                                                Boolean(formik.errors.gender) && (
                                                    <FormHelperText className="required_text">
                                                        {" "}
                                                        {formik.errors.gender
                                                            ? formik.errors.gender.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Ngày sinh <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <DatePicker
                                                    locale={vi}
                                                    className="react-date-picker"
                                                    selected={birthday}
                                                    onChange={(date: Date) => {
                                                        setBirthday(date);
                                                        formik.setFieldValue("birthday", date);
                                                    }}
                                                    onYearChange={(date: Date) => {
                                                        setBirthday(date);
                                                        formik.setFieldValue("birthday", date);
                                                    }}
                                                    onMonthChange={(date: Date) => {
                                                        setBirthday(date);
                                                        formik.setFieldValue("birthday", date);
                                                    }}
                                                    dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                                    showMonthDropdown // Hiển thị dropdown chọn tháng
                                                    dropdownMode="select"
                                                    showYearDropdown // Hiển thị dropdown chọn năm
                                                />
                                                {formik.touched.birthday &&
                                                    Boolean(formik.errors.birthday) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.birthday
                                                                ? formik.errors.birthday.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={2}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Lớp
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="class"
                                                    name="class"
                                                    value={formik.values.class}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.class &&
                                                        Boolean(formik.errors.class)
                                                    }
                                                />
                                                {formik.touched.class &&
                                                    Boolean(formik.errors.class) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.class
                                                                ? formik.errors.class.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={5}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Trường
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="school"
                                                    name="school"
                                                    value={formik.values.school}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.school &&
                                                        Boolean(formik.errors.school)
                                                    }
                                                    disabled
                                                />
                                                {formik.touched.school &&
                                                    Boolean(formik.errors.school) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.school
                                                                ? formik.errors.school.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={5}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Vai trò</span>
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="roleId"
                                                        name="roleId"
                                                        type="roleId"
                                                        value={formik.values.roleId}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.roleId &&
                                                            Boolean(formik.errors.roleId)
                                                        }
                                                    >
                                                        <MenuItem value="0" disabled>
                                                            Chọn vai trò
                                                        </MenuItem>
                                                        {roles?.data?.result?.length > 0 ? (
                                                            roles.data.result
                                                                .map((item, index) => (
                                                                    <MenuItem key={index} value={item._id}>
                                                                        {getLabelFromOptions(statusRole, item.name)}
                                                                    </MenuItem>
                                                                ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.roleId &&
                                                    Boolean(formik.errors.roleId) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.roleId
                                                                ? formik.errors.roleId.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Địa chỉ  <span className="required_text">(*)</span>
                                            </Typography>
                                            <TextareaAutosize
                                                id="address"
                                                name="address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                minRows={4}
                                            />
                                            {formik.touched.address &&
                                                Boolean(formik.errors.address) && (
                                                    <FormHelperText className="required_text">
                                                        {" "}
                                                        {formik.errors.address
                                                            ? formik.errors.address.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                        </Grid>
                                    </Grid>
                                    {
                                        id ? <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                            <Grid item md={12}>
                                                <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                        <span style={{ marginRight: '8px' }}>Hình ảnh hiện tại</span>
                                                        <span className="required_text">(*)</span>
                                                    </Typography>
                                                    <img
                                                        src={process.env.REACT_APP_BASE_API_FILE_URL + user?.avatar}
                                                        alt="Xem trước"
                                                        style={{ width: '30%', height: 'auto' }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid> : <>

                                        </>
                                    }
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            {avatarPreview && (
                                                <div style={{ position: 'relative', display: 'inline-block', marginTop: 10 }}>
                                                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                        <span style={{ marginRight: '8px' }}>Hình ảnh {id ? 'cập nhật' : ''}</span>
                                                        <span className="required_text">(*)</span>
                                                    </Typography>
                                                    <img
                                                        src={avatarPreview as string}
                                                        alt="Xem trước"
                                                        style={{ width: '30%', height: 'auto', display: 'block', marginBottom: '10px' }} // Thêm display: 'block'
                                                    />
                                                    {
                                                        !id ? (
                                                            <IconSquareXFilled
                                                                onClick={handleRemoveAvatar}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    right: 0,
                                                                    cursor: 'pointer',
                                                                    color: 'red', // Thay đổi màu sắc nếu cần
                                                                    fontSize: '20px', // Kích thước biểu tượng
                                                                }}
                                                            />
                                                        ) : null
                                                    }
                                                </div>
                                            )}
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="avatar-upload"
                                                type="file"
                                                onChange={handleAvatarChange}
                                            />
                                            {/* Hiển thị ảnh xem trước */}
                                        </Grid>
                                        <label htmlFor="avatar-upload">
                                            <Button sx={{ ml: 2 }} variant="contained" component="span" color="primary" style={{ display: 'block', }}> {/* Thêm display: 'block' */}
                                                <span>Chọn ảnh</span>
                                            </Button>
                                        </label>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        onClick={() => formik.handleSubmit()}
                        type="submit"
                        loading={id ? isPendingUpdate : isPendingInsert}
                        variant="contained"
                        size="large"
                    >
                        Lưu
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);