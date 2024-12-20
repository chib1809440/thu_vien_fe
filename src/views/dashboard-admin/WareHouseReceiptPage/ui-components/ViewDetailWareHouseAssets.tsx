import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { FC, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as yup from "yup";
import { useAuth } from "../../../../contexts/JWTContext";
import { formatDate } from "../../../../helpers/formatDate";
import { TSupplier } from "../../../../types/models/supplier.type";
import { TWareHouseAssetsReceipt } from "../../../../types/models/warehouse-assets-receipt";
import PrintWareHouseAssetsReceipt from "./PrintWareHouseAssetsReceipt";
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
    wareHouseAssetsReceipt?: TWareHouseAssetsReceipt;
};

const schema = yup.object().shape({
    note: yup
        .string(),
});

const ViewDetailWareHouseAssetsReceipt: FC<Props> = ({
    open,
    onClose,
    wareHouseAssetsReceipt,
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
    console.log(wareHouseAssetsReceipt);

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
                Chi tiết phiếu nhập kho
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 3, sm: 3, md: 8 } }} >
                <Box sx={{ display: 'none' }}>
                    {
                        wareHouseAssetsReceipt && <PrintWareHouseAssetsReceipt ref={componentRef} wareHouseAssetsReceipt={wareHouseAssetsReceipt} />
                    }
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Nhà cung cấp:</strong> {(wareHouseAssetsReceipt?.supplierId as TSupplier)?.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Ngày tạo:</strong> {formatDate(wareHouseAssetsReceipt?.createdAt)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Ngày cập nhật</strong> {formatDate(wareHouseAssetsReceipt?.updatedAt)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Trạng thái:</strong> {wareHouseAssetsReceipt.isAccept === true ? "Đã duyệt" : "Chưa duyệt"}
                </Typography>
                {
                    wareHouseAssetsReceipt?.assets?.length > 0 && <Grid container spacing={2}>
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
                                            <StyledTableCell align="left" width='20%'>Mã tài sản</StyledTableCell>
                                            <StyledTableCell align="left" width='40%'>Tên tài sản</StyledTableCell>
                                            <StyledTableCell align="left" width='15%'>Số lượng nhập</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {wareHouseAssetsReceipt?.assets?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    <Box style={{ width: "100%" }} >
                                                        {row?._id || "Không có dữ liệu"}
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row?.name || "Không có dữ liệu"}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row?.quantityWareHouse || "Không có dữ liệu"}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                }
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

export default ViewDetailWareHouseAssetsReceipt;
