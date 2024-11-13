import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { CreatePublication, TLoanSlip, TLoanSlipCreate } from "../../../../types/models/loanSlip.type";
import DatePicker from "react-datepicker";
import { Label } from "@mui/icons-material";
import { vi } from "date-fns/locale";
import useDebounce, { searchDelay } from "../../../../hooks/useDebounce";
import { getUserByBarCode } from "../../../../_apis/user.api";
import { EntityResponse } from "../../../../interfaces/entityResponse";
import { User } from "../../../../interfaces/user";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TPublications } from "../../../../types/models/publications.type";
import { positions } from "@mui/system";
import publicationsService from "../../../../_apis/services/publications.service";
import useDebounceArray from "../../../../hooks/useDebounceArray";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import PrintLoanSlip from "./PrintLoanSlip";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { Role } from "../../../../interfaces/role";
import { useAuth } from "../../../../contexts/JWTContext";
import { formatDate } from "../../../../helpers/formatDate";
import Barcode from "react-barcode";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


type Props = {
    open: boolean;
    onClose: () => void;
    loanSlip?: TLoanSlip;
};

const schema = yup.object().shape({
    note: yup
        .string(),
});

const ViewDetailLoanSlip: FC<Props> = ({
    open,
    onClose,
    loanSlip,
}) => {
    const { user } = useAuth();
    const libraryDetail = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryDetail;
    }, [user]);
    console.log(loanSlip?.publications);

    return (
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
                Chi tiết phiếu mượn
            </DialogTitle>

            <DialogContent sx={{ p: 8 }} >
                <Typography variant="h3" align="center" sx={{ mt: 0 }}>
                    {capitalizeFirstLetter(libraryDetail?.name)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Họ và tên người mượn sách:</strong> {loanSlip?.userId?.fullname}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Email:</strong> {loanSlip?.userId?.email}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Số điện thoại:</strong> {loanSlip?.userId?.phoneNumber}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Địa chỉ:</strong> {loanSlip?.userId?.address}
                </Typography>
                {loanSlip?.userId?.class && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Lớp:</strong> {loanSlip?.userId?.class}
                    </Typography>
                )}
                {loanSlip?.userId?.school && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Trường:</strong> {loanSlip?.userId?.school}
                    </Typography>
                )}
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <p>
                        <strong>Ngày mượn:</strong> {formatDate(loanSlip?.borrowedDay)}
                    </p>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <p>
                        <strong>Ngày trả:</strong> {formatDate(loanSlip?.returnDay)}
                    </p>
                </Typography>
                {
                    loanSlip?.publications?.length > 0 && <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    color='primary'
                                    label="Thông tin mượn"
                                    variant="filled"
                                />
                            </Box>
                            <TableContainer component={Paper} sx={{ mt: 4 }}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead >
                                        <TableRow>
                                            <StyledTableCell align="left" width='20%'>BarCode</StyledTableCell>
                                            <StyledTableCell align="left" width='40%'>Tên sách</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Số lượng trả</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Số lượng đã trả</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loanSlip?.publications?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    <Box style={{ width: "100%" }} >
                                                        {row?.barcode || "Không có dữ liệu"}
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row?.name || "Không có dữ liệu"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row?.quantityLoan || "Không có dữ liệu"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {(row?.quantityReturn) || "0"}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                }

                {
                    loanSlip?.historys?.length > 0 && <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    color='primary'
                                    label="Thông tin Lịch sử mượn"
                                    variant="filled"
                                />
                            </Box>
                            <TableContainer component={Paper} sx={{ mt: 4 }}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left" width='20%'>BarCode</StyledTableCell>
                                            <StyledTableCell align="left" width='40%'>Tên sách</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Số lượng đã trả</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Ngày trả</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loanSlip?.historys?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    <Box style={{ width: "100%" }} >
                                                        {row?.barcode || "Không có dữ liệu"}
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row?.name || "Không có dữ liệu"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row?.quantityReturn || "Không có dữ liệu"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {formatDate(row?.historyDate) || "Không có dữ liệu"}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                }
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Barcode
                        value={loanSlip?.barcode} // Đảm bảo rằng barcode không phải là undefined
                        width={1} // Kích thước chiều rộng
                        height={50} // Kích thước chiều cao
                        fontSize={10}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 4 }}>
                <Button onClick={onClose} color="error">
                    Đóng
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default ViewDetailLoanSlip;
