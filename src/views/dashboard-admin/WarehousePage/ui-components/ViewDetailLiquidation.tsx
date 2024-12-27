import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { FC, useEffect, useRef, useState } from "react";
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
import DialogImportFile from "../../PublicationsPage/ui-components/DialogImportFile";
import liquidationService from "../../../../_apis/services/liquidation.service";
import { IconFileDownload } from "@tabler/icons-react";
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
    const [buttonState, setButtonState] = useState<'Thủ thư ký' | 'Hiệu trưởng ký' | 'Đã ký'>('Thủ thư ký');
    const [liquidationToSignature, setLiquidationToSignature] = useState<TLiquidation | null>(null);
    const [openConfirmSignatureDialog, setOpenConfirmSignatureDialog] = useState(false);
    const mutationSignature = useSignature();
    const revalidate = useReFetchLiquidation();

    useEffect(() => {
        if (liquidationData) {
            // Kiểm tra độ dài của signatures để xác định trạng thái isAccept
            if (liquidationData.signatures?.length === 2) {
                liquidationData.isAccept = true;  // Chỉ khi có 2 chữ ký thì isAccept mới = true
                setButtonState('Đã ký');  // Nếu đã ký đủ 2 chữ ký, thì cập nhật trạng thái nút
            } else if (liquidationData.signatures?.length === 1) {
                setButtonState('Hiệu trưởng ký');  // Nếu chỉ có 1 chữ ký, trạng thái nút là "Hiệu trưởng ký"
            } else {
                setButtonState('Thủ thư ký');  // Nếu chưa có chữ ký nào, trạng thái nút là "Thủ thư ký"
            }
        }
    }, [liquidationData]);
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
                onError: (error) => {
                    toast.error('Lỗi khi xác nhận chữ ký.');
                },
            });
        }
    };

    const handleIsAccept = (row: TLiquidation) => {
        setLiquidationToSignature(row);
        setOpenConfirmSignatureDialog(true);
        // Cập nhật lại trạng thái nút khi có sự thay đổi
        if (row.signatures?.length === 2) {
            setButtonState('Đã ký');
        } else if (row.signatures?.length === 1) {
            setButtonState('Hiệu trưởng ký');
        } else {
            setButtonState('Thủ thư ký');
        }
    };

    console.log(buttonState)
    const [openImportFile, setOpenImportFile] = useState(false);
    const handleImportFile = () => {
        setOpenImportFile(true);
    };
    const handleCloseImportFile = () => {
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
                    onClose={handleCloseImportFile}
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
                                                <StyledTableCell align="left" width='20%'>Mã barcode</StyledTableCell>
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
                                                            {row?.barcode || "Không có barcode"}
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
                                                                    <Typography sx={{ mt: 0.5 }}>SL trong kho: <strong>{row?.quantityWarehouse !== undefined ? row?.quantityWarehouse : "0"}</strong></Typography>
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

                <DialogActions sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {liquidationData?.fileSignature && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginRight: 2,
                                        maxWidth: '300px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <strong>File biên bản:</strong> {liquidationData.fileSignature.name.replace(/\.pdf$/, '')}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {liquidationData.fileSignature.typeFile === 'pdf' ? (
                                        <>
                                            <a
                                                href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${liquidationData.fileSignature.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="contained" sx={{ background: 'green', color: 'white' }}>
                                                    Xem
                                                </Button>
                                            </a>
                                            <a
                                                href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${liquidationData.fileSignature.path}`}
                                                download
                                                style={{
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    color: '#616161',
                                                }}
                                            >
                                                <Button variant="contained" sx={{ mr: 2, background: 'gray', color: 'white' }}>
                                                    <IconFileDownload size={20} stroke={1.5} style={{ marginRight: 8 }} />
                                                    Tải xuống
                                                </Button>
                                            </a>
                                        </>
                                    ) : liquidationData.fileSignature.typeFile === 'image' ? (
                                        <>
                                            <a
                                                href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${liquidationData.fileSignature.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="contained" sx={{ background: 'green', color: 'white' }}>
                                                    Xem Ảnh
                                                </Button>
                                            </a>
                                            <a
                                                href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${liquidationData?.fileSignature?.path}`}
                                                download
                                                style={{
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    color: '#616161',
                                                }}
                                            >
                                                <Button variant="contained" sx={{ textTransform: 'inherit', mr: 2, background: 'gray', color: 'white' }}>
                                                    <IconFileDownload size={20} stroke={1.5} style={{ marginRight: 8 }} />
                                                    Tải xuống
                                                </Button>
                                            </a>
                                        </>
                                    ) : null}
                                </Box>
                            </Box>
                        )}
                        {liquidationData?.isAccept && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'inherit' }}
                                onClick={handleImportFile}
                            >
                                {liquidationData?.fileSignature ? 'Cập nhật phiếu' : 'Tải phiếu biên bản'}
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={onClose} color="error">
                            Đóng
                        </Button>

                        <Button onClick={() => handlePrint()} style={{ background: '#212121', color: 'white' }} variant="contained">
                            In
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleIsAccept(liquidationData)}
                            disabled={liquidationData?.isAccept}
                            sx={{ textTransform: 'inherit' }}
                        >
                            {buttonState}  {/* Hiển thị trạng thái của nút */}
                        </Button>
                    </Box>
                </DialogActions>

            </Dialog >
        </>
    );
};

export default ViewDetailLiquidation;
