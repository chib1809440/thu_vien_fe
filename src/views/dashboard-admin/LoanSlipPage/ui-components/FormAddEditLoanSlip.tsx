import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TLoanSlipCreate } from "../../../../types/models/loanSlip.type";
import DatePicker from "react-datepicker";
import { Label } from "@mui/icons-material";
import { vi } from "date-fns/locale";
import useDebounce, { searchDelay } from "../../../../hooks/useDebounce";
import { getUserByBarCode } from "../../../../_apis/user.api";
import { EntityResponse } from "../../../../interfaces/entityResponse";
import { User } from "../../../../interfaces/user";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TLoanSlipCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TLoanSlipCreate;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên")
});

const FormAddEditLoanSlip: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        note: "",
        borrowedDay: "",
        returnDay: "",
        userId: ""
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TLoanSlipCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                onSubmit(values, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );
    const [borrowedDay, setBorrowedDay] = useState(new Date());
    const [returnDay, setReturnDay] = useState(new Date());
    const [barCodeUserId, setbarCodeUserId] = useState<string>('');
    const [userData, setUserData] = useState<EntityResponse<User>>(null);
    const debouncedBarCodeUserId = useDebounce(barCodeUserId, searchDelay);
    useEffect(() => {
        if (debouncedBarCodeUserId) {
            // Chỉ gọi API khi có giá trị barcode
            const fetchUser = async () => {
                try {
                    const result = await getUserByBarCode(debouncedBarCodeUserId);
                    setUserData(result); // Lưu kết quả tìm kiếm
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUser();
        }
    }, [debouncedBarCodeUserId]);
    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="xl"
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
                <DialogTitle sx={{ p: 4 }}>
                    {isEditMode ? "Sửa phiếu mượn" : "Thêm phiếu mượn mới"}
                </DialogTitle>

                <DialogContent sx={{ p: 4 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box >
                                <Chip
                                    color='primary'
                                    label="Thông tin người dùng"
                                    variant="filled"
                                />
                            </Box>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Box style={{ width: "100%" }} sx={{ mt: 2, mb: 2, ml: 2 }}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="barCodeUserId"
                                        name="barCodeUserId"
                                        placeholder="Nhập barcode người dùng"
                                        value={barCodeUserId}
                                        onChange={(e) => setbarCodeUserId(e.target.value)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ ml: 4, mt: 2, fontWeight: "bold" }}>
                                    Họ và tên:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.fullname || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                                <Typography sx={{ ml: 4, mt: 2, fontWeight: "bold" }}>
                                    Địa chỉ:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.address || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Số điện thoại:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.phoneNumber || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Giới tính:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.gender || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Email:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.email || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Vai trò:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.roleId?.name || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Chip
                                color='primary'
                                label="Thông tin mượn - trả"
                                variant="filled"
                            />

                            <Form autoComplete="none" noValidate onSubmit={handleSubmit}>

                                {/* <InputForm
                                    label="Ghi chú"
                                    placeholder="Nhập ghi chú"
                                    required
                                    error={touched.note && Boolean(errors.note)}
                                    helperText={touched.note && errors.note}
                                    {...getFieldProps("name")}
                                    
                                /> */}
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ngày mượn  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <DatePicker
                                                locale={vi}
                                                className="react-date-picker"
                                                selected={borrowedDay}
                                                onChange={(date: Date) => {
                                                    setBorrowedDay(date);
                                                }}
                                                onYearChange={(date: Date) => {
                                                    setBorrowedDay(date);
                                                }}
                                                onMonthChange={(date: Date) => {
                                                    setBorrowedDay(date);
                                                }}
                                                dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                                showMonthDropdown // Hiển thị dropdown chọn tháng
                                                dropdownMode="select"
                                                showYearDropdown // Hiển thị dropdown chọn năm
                                                popperPlacement="top-end"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ngày trả  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <DatePicker
                                                locale={vi}
                                                className="react-date-picker"
                                                selected={returnDay}
                                                onChange={(date: Date) => {
                                                    setReturnDay(date);
                                                }}
                                                onYearChange={(date: Date) => {
                                                    setReturnDay(date);
                                                }}
                                                onMonthChange={(date: Date) => {
                                                    setReturnDay(date);
                                                }}
                                                dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                                showMonthDropdown // Hiển thị dropdown chọn tháng
                                                dropdownMode="select"
                                                showYearDropdown // Hiển thị dropdown chọn năm
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>


                            </Form>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4 }}>
                                <Chip
                                    color='primary'
                                    label="Thông tin sách"
                                    variant="filled"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button disabled={isFetching} onClick={onClose} color="error">
                        Huỷ
                    </Button>
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang thêm..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditLoanSlip;