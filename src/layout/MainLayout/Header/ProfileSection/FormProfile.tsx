import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from '../../../../components/custom/form/SelectForm';
import Uploadimage, { UploadAvatarRefProps } from '../../../../components/custom/form/UploadImage';
import StyledButton from '../../../../components/default/button/StyledButton';
import { capitalizeFirstLetter } from '../../../../helpers/capitalizeFirstLetter';
import { CreateUserModel } from "../../../../interfaces/user";
import { genderOptions } from '../../../../utils/constants.utils';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: CreateUserModel, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: CreateUserModel;
    isEditMode?: boolean;
    imageUrl?: string;
};

const schema = yup.object().shape({
    fullname: yup.string().required("Vui lòng nhập tên"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    email: yup.string().email("Vui lòng nhập đúng định dạng email"),
    username: yup.string().required("Vui lòng nhập tên đăng nhâp"),
    phoneNumber: yup.string().matches(/^[0-9]+$/, "Vui lòng nhập đúng định dạng số điện thoại"),
});

const FormProfile: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        email: "",
        username: "",
        fullname: "",
        phoneNumber: "",
        address: "",
        birthday: "",
        gender: "",
        class: "",
        school: "",
        roleId: "",
        libraryId: "",
    },
    isFetching = false,
    isEditMode = false,
    imageUrl,
}) => {
    const formik = useFormik<CreateUserModel>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                // Chuyển ngày thành ISO string khi submit
                if (values.birthday) {
                    values.birthday = new Date(values.birthday).toISOString();
                }
                onSubmit(values, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );

    const imageRef = useRef<UploadAvatarRefProps>(null);
    const [defaultImage, setDefaultImage] = useState<string>("");
    const [fileName, setFileName] = useState("");
    const [avatarBoolean, setAvatarBoolean] = useState(true);
    // Xét ảnh
    const handleChangeImage = useCallback(
        async (file: File) => {
            if (!avatarBoolean) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setDefaultImage(event.target?.result as string);
                };
                reader.readAsDataURL(file);
                setFileName(file.name);
            }

            setFieldValue("file", file);
        },
        [initialValues, setFieldValue, defaultImage, avatarBoolean]
    );

    const handleGenderChange = (e) => {
        const selectedGender = e.target.value;
        setFieldValue("gender", selectedGender);
    };


    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={open}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        // Ngăn tắt khi bấm ra ngoài
                        onClose();
                    }
                }}
                disableEscapeKeyDown
            >
                <DialogTitle>
                    Thông tin cá nhân
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        color='error'
                        sx={{ position: 'absolute', right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent >
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 2,
                                width: "100%",
                                my: 2,
                                "& .css-1saycg4": {
                                    margin: "auto",
                                }
                            }}
                        >
                            <Uploadimage
                                avatar={avatarBoolean}
                                ref={imageRef}
                                defaultImage={imageUrl || defaultImage}
                                onChange={handleChangeImage}
                                fileName={fileName}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    ml: { xs: 0, md: 2, xl: 5 },
                                }}
                            >
                                <InputForm
                                    label="Tên đăng nhập"
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                    {...getFieldProps("username")}
                                />
                                <InputForm
                                    label="Họ tên"
                                    error={touched.fullname && Boolean(errors.fullname)}
                                    helperText={touched.fullname && errors.fullname}
                                    {...getFieldProps("fullname")}
                                />

                            </Box>
                        </Box>
                        <InputForm
                            label="Địa chỉ"
                            placeholder="Nhập địa chỉ"
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            {...getFieldProps("address")}
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Email"
                                placeholder="Nhập email"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                {...getFieldProps("email")}
                            />
                            <InputForm
                                label="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                {...getFieldProps("phoneNumber")}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
                            <Box sx={{ flex: 1 }}>
                                <InputForm
                                    type='number'
                                    label="Lớp"
                                    placeholder="Nhập tên lớp"
                                    error={touched.class && Boolean(errors.class)}
                                    helperText={touched.class && errors.class}
                                    {...getFieldProps("class")}
                                    value={capitalizeFirstLetter(values?.class)}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <SelectForm
                                    label="Giới tính"
                                    options={genderOptions}
                                    {...getFieldProps("gender")}
                                    onChange={handleGenderChange}
                                    error={touched.gender && Boolean(errors.gender)}
                                    helperText={touched.gender && errors.gender}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ mt: { xs: 0, md: 5 } }}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DatePicker
                                            label="Ngày sinh"
                                            value={values.birthday ? new Date(values.birthday) : null}
                                            onChange={(newValue) => {
                                                console.log("Old Birthday: ", values.birthday); // Kiểm tra giá trị cũ
                                                if (newValue) {
                                                    setFieldValue("birthday", newValue.toISOString());
                                                }
                                                console.log("New Birthday: ", newValue); // Kiểm tra giá trị mới
                                            }}
                                            inputFormat="DD/MM/YYYY"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={touched.birthday && Boolean(errors.birthday)}
                                                    helperText={touched.birthday && errors.birthday}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Box>


                        {/* <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Trường"
                                placeholder="Nhập tên trường"
                                disabled
                                error={touched.school && Boolean(errors.school)}
                                helperText={touched.school && errors.school}
                                {...getFieldProps("school")}
                                value={capitalizeFirstLetter(values?.school)}
                            /> 

                            <InputForm
                                type='number'
                                label="Lớp"
                                placeholder="Nhập tên lớp"
                                error={touched.class && Boolean(errors.class)}
                                helperText={touched.class && errors.class}
                                {...getFieldProps("class")}
                                value={capitalizeFirstLetter(values?.class)}
                            />
                        </Box> */}
                    </Form>
                </DialogContent>
                <DialogActions sx={{ pr: 3, pl: 3 }}>
                    <StyledButton
                        color="primary"
                        size="small"
                        variant="contained"
                        onClick={handleSubmit as () => void}
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                    >
                        {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormProfile;
