import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { FC, useMemo, useRef } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import * as yup from "yup";
import { useAuth } from "../../../../contexts/JWTContext";
import { formatDate } from "../../../../helpers/formatDate";
import { TSupplier } from "../../../../types/models/supplier.type";
import { TWareHouseReceipt } from "../../../../types/models/warehouse-receipt";
import PrintWareHouseReceipt from "./PrintWareHouseReceipt";
import { formatPrice } from "../../../../utils/object";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#204165",
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
    wareHouseReceipt?: TWareHouseReceipt;
};

const schema = yup.object().shape({
    note: yup
        .string(),
});

const ViewDetailWareHouseReceipt: FC<Props> = ({
    open,
    onClose,
    wareHouseReceipt,
}) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                margin: 10mm; /* Thiết lập margin */
                size: A4; /* Thiết lập kích thước */
            }
            body {
                margin: 0; /* Đảm bảo không có margin thừa */
            }
        `,
    });
    const { user } = useAuth();
    const libraryDetail = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryDetail;
    }, [user]);
    console.log(wareHouseReceipt);

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
                Chi tiết phiếu nhập kho ấn phẩm
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 3, sm: 3, md: 8 } }} >
                <Box sx={{ display: 'none' }}>
                    {
                        wareHouseReceipt && <PrintWareHouseReceipt ref={componentRef} wareHouseReceipt={wareHouseReceipt} />
                    }
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Nhà cung cấp:</strong> {(wareHouseReceipt?.supplierId as TSupplier)?.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Ngày tạo:</strong> {formatDate(wareHouseReceipt?.createdAt)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Ngày cập nhật</strong> {formatDate(wareHouseReceipt?.updatedAt)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Trạng thái:</strong> {wareHouseReceipt.isAccept === true ? "Đã duyệt" : "Chưa duyệt"}
                </Typography>
                {
                    wareHouseReceipt?.publications?.length > 0 && <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    color='primary'
                                    label="Thông tin nhập sách"
                                    variant="filled"
                                />
                            </Box>
                            <TableContainer component={Paper} sx={{ mt: 4 }}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead >
                                        <TableRow>
                                            <StyledTableCell align="left" width='20%'>BarCode</StyledTableCell>
                                            <StyledTableCell align="left" width='30%'>Tên sách</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Số lượng nhập</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Giá nhập/Giá bìa</StyledTableCell>
                                            <StyledTableCell align="left" width='20%'>Tổng giá</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {wareHouseReceipt?.publications?.map((row, index) => (
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
                                                    {row?.quantityWareHouse || "0"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {formatPrice(row?.priceInput) || "0"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {formatPrice(row?.quantityWareHouse * row?.priceInput) || "0"}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        <StyledTableRow sx={{ background: "#204165 !important", color: "white" }}>
                                            <StyledTableCell colSpan={2} align="center" sx={{ color: "white" }}>
                                                <strong>Tổng cộng:</strong>
                                            </StyledTableCell>
                                            <StyledTableCell align="left" colSpan={2} sx={{ color: "white" }}>
                                                <strong style={{ marginLeft: 1 }}>
                                                    {wareHouseReceipt?.publications
                                                        ?.reduce((total, row) => {
                                                            return total + (row?.quantityWareHouse || 0);
                                                        }, 0)
                                                        .toLocaleString() || "0"}
                                                </strong>
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ color: "white" }}>
                                                <strong>
                                                    {formatPrice(
                                                        wareHouseReceipt?.publications
                                                            ?.reduce((total, row) => {
                                                                return total + (row?.priceInput * row?.quantityWareHouse || 0);
                                                            }, 0)
                                                    ) || "0"}
                                                </strong>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                }

                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Barcode
                        value={wareHouseReceipt?.barcode} // Đảm bảo rằng barcode không phải là undefined
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
                {
                    <Button onClick={() => {
                        handlePrint()
                    }} style={{ background: '#212121', color: 'white' }} variant="contained"  >
                        In
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
};

export default ViewDetailWareHouseReceipt;
