import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { FC, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import ConfirmDeleteDialog from "../../../../components/default/dialog/ConfirmDeleteDialog";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../../helpers/formatDate";
import { useSignature } from "../../../../hooks/services/liquidation/liquidation-mutation";
import { useReFetchLiquidation } from "../../../../hooks/services/liquidation/liquidation-query";
import { TLiquidation } from "../../../../types/models/liquidation.type";
import PrintLiquidation from "./PrintLiquidation";
import { getLabelFromOptions } from "../../../../utils/object";
import { typeLiquidationOptions } from "../../../../utils/constants.utils";
import DialogImportFile from "../../PublicationsPage/ui-components/DialogImportFile ";
import liquidationService from "../../../../_apis/services/liquidation.service";
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
    liquidationData?: TLiquidation;
};

const ViewDetailLiquidation: FC<Props> = ({
    open,
    onClose,
    liquidationData,
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
    const [liquidationToSignature, setLiquidationToSignature] = useState<TLiquidation | null>(null);
    const [openConfirmSignatureDialog, setOpenConfirmSignatureDialog] = useState(false);
    const mutationSignature = useSignature();
    const revalidate = useReFetchLiquidation();
    const handleIsAccept = (row: TLiquidation) => {
        setLiquidationToSignature(row);
        setOpenConfirmSignatureDialog(true);
    }
    const handleCloseConfirmSignatureDialog = () => {
        setOpenConfirmSignatureDialog(false);
    };

    const handleConfirmSignature = () => {
        if (liquidationToSignature) {
            mutationSignature.mutate(liquidationToSignature._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xác nhận ký thành công.');
                    setOpenConfirmSignatureDialog(false);
                },
            });
        }
    };
    const [openImportFile, setOpenImportFile] = useState(false);
    const handleImportFile = () => {
        setOpenImportFile(true);
    };
    const handleCloseImportExcel = () => {
        setOpenImportFile(false);
    };

    const handleSubmitImportFile = async (file: File) => {
        try {
            await liquidationService.upLoadFile(file, liquidationData?._id);
            revalidate();
            toast.success("Tải file thành công.")
            setOpenImportFile(false);
        } catch (error) {
            toast.error(error?.message);
        }
    };

    console.log("liquidationData", liquidationData);
    

    return (
        <>
            <ConfirmDeleteDialog
                key={"isAccept"}
                open={openConfirmSignatureDialog}
                onClose={handleCloseConfirmSignatureDialog}
                onConfirm={handleConfirmSignature}
                title="Xác nhận ký?"
                description={`Bạn có chắc chắn muốn xác nhận ký"?`}
            />

            {openImportFile && (
                <DialogImportFile
                    open={openImportFile}
                    onClose={handleCloseImportExcel}
                    onSubmit={handleSubmitImportFile}
                    title={"Tải file biên bản thanh lý"}
                />
            )}

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
                    Chi tiết phiếu biên bản thanh lý
                </DialogTitle>

                <DialogContent sx={{ p: { xs: 3, sm: 3, md: 8 } }} >
                    <Box sx={{ display: 'none' }}>
                        {
                            liquidationData && <PrintLiquidation ref={componentRef} liquidationData={liquidationData} />
                        }
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Ngày tạo:</strong> {formatDate(liquidationData?.createdAt)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Ngày cập nhật</strong> {formatDate(liquidationData?.updatedAt)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Trạng thái:</strong> {liquidationData?.isAccept === true ? "Đã ký" : "Chưa ký"}
                    </Typography>
                    {
                        liquidationData?.liquidations?.length > 0 && <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                        color='primary'
                                        label="Thông tin thanh lý"
                                        variant="filled"
                                    />
                                </Box>
                                <TableContainer component={Paper} sx={{ mt: 4 }}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead >
                                            <TableRow>
                                                <StyledTableCell align="left" width='20%'>Mã phiếu</StyledTableCell>
                                                <StyledTableCell align="left" width='40%'>Thông tin thanh lý</StyledTableCell>
                                                <StyledTableCell align="left" width='15%'>Số lượng thanh lý</StyledTableCell>
                                                <StyledTableCell align="left" width='15%'>Giá</StyledTableCell>
                                                <StyledTableCell align="left" width='15%'>Tổng giá</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {liquidationData?.liquidations?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="left">
                                                        <Box style={{ width: "100%" }} >
                                                            {row?.barcode || "Không có dữ liệu"}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        <Box>
                                                            <Typography>{row?.name || "Không có dữ liệu"}</Typography>
                                                            <Typography sx={{ mt: 0.5 }}>Vị trí: <strong>{capitalizeFirstLetter(row?.position) || "Không có dữ liệu"}</strong></Typography>
                                                            <Typography sx={{ mt: 0.5 }}>Loại: <strong>{getLabelFromOptions(typeLiquidationOptions, row?.type) || "Không có dữ liệu"}</strong></Typography>
                                                            {
                                                                row?.type === "Asset" &&
                                                                <>
                                                                    <Typography sx={{ mt: 0.5 }}>SL trong kho: <strong>{row?.quantityTotal !== undefined ? row?.quantityTotal : "0"}</strong></Typography>
                                                                    <Typography sx={{ mt: 0.5 }}>SL sử dụng: <strong>{row?.quantityUsed !== undefined ? row?.quantityUsed : "0"}</strong></Typography>
                                                                </>
                                                            }
                                                            {
                                                                row?.type === "Publication" &&
                                                                <>
                                                                    <Typography sx={{ mt: 0.5 }}>SL trong kho: <strong>{row?.quantity !== undefined ? row?.quantity : "0"}</strong></Typography>
                                                                    <Typography sx={{ mt: 0.5 }}>SL trên kệ: <strong>{row?.shelvesQuantity !== undefined ? row?.shelvesQuantity : "0"}</strong></Typography>
                                                                </>
                                                            }

                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {row?.quantityLiquidation || "0"}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {row?.priceLiquidation || "0"}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {row?.priceLiquidation * row?.quantityLiquidation || "0"}
                                                    </StyledTableCell>
                                                </StyledTableRow>

                                            ))}
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={2} align="center"><strong>Tổng cộng:</strong></StyledTableCell>
                                                <StyledTableCell align="left" colSpan={2}>
                                                    <strong style={{ marginLeft: 1 }}>
                                                        {liquidationData?.liquidations?.reduce((total, row) => {
                                                            return total + (row?.quantityLiquidation || 0);
                                                        }, 0).toLocaleString() || "0"}
                                                    </strong>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <strong>
                                                        {liquidationData?.liquidations?.reduce((total, row) => {
                                                            return total + (row?.priceLiquidation * row?.quantityLiquidation || 0);
                                                        }, 0).toLocaleString() || "0"}
                                                    </strong>
                                                </StyledTableCell>
                                            </StyledTableRow>
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

                    <Button onClick={() => { handlePrint() }}
                        style={{ background: '#212121', color: 'white' }} variant="contained"  >
                        In
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => { handleIsAccept(liquidationData) }}
                        disabled={liquidationData?.isAccept}
                        sx={{ textTransform: "inherit" }}
                    >
                        {
                            (() => {
                                const signatures = liquidationData?.signatures || [];
                                let signatureText = '';

                                if (signatures.length === 2) {
                                    signatureText = 'Hiệu trưởng ký';
                                } else if (signatures.includes('thủ thư')) {
                                    signatureText = 'Thủ thư ký';
                                } else {
                                    signatureText = 'Xác nhận ký';
                                }

                                return signatureText;
                            })()
                        }
                    </Button>
                    {
                        liquidationData?.isAccept &&
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: "inherit" }}
                            onClick={handleImportFile}
                        >
                            Tải phiếu biên bản
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewDetailLiquidation;
