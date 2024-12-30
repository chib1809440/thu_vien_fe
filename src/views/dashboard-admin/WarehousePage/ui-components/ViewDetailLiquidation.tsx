import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import liquidationService from "../../../../_apis/services/liquidation.service";
import ConfirmDeleteDialog from "../../../../components/default/dialog/ConfirmDeleteDialog";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../../helpers/formatDate";
import { useSignature } from "../../../../hooks/services/liquidation/liquidation-mutation";
import { useReFetchLiquidation } from "../../../../hooks/services/liquidation/liquidation-query";
import { TLiquidation } from "../../../../types/models/liquidation.type";
import { typeLiquidationOptions } from "../../../../utils/constants.utils";
import { getLabelFromOptions } from "../../../../utils/object";
import PrintLiquidation from "./PrintLiquidation";

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
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

type Props = {
    open: boolean;
    onClose: () => void;
    liquidationData?: TLiquidation;
    onSubmitConfirmSignature?: (id: string, callbackCloseDialogConfirm: () => void) => void;
};

const ViewDetailLiquidation: FC<Props> = ({ open, onClose, onSubmitConfirmSignature, liquidationData }) => {
    const [buttonState, setButtonState] = useState<"Thủ thư ký" | "Hiệu trưởng ký" | "Đã ký">("Thủ thư ký");
    const [liquidationToSignature, setLiquidationToSignature] = useState<TLiquidation | null>(null);
    const [openConfirmSignatureDialog, setOpenConfirmSignatureDialog] = useState(false);
    const [openImportFile, setOpenImportFile] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const componentRef = useRef();
    const mutationSignature = useSignature();
    const revalidate = useReFetchLiquidation();

    const handleImportFile = () => {
        setOpenImportFile(true);
    };

    const handleCloseImportFile = () => {
        setOpenImportFile(false);
    };

    const handleCloseConfirmSignatureDialog = () => {
        setOpenConfirmSignatureDialog(false);
    };

    useEffect(() => {
        if (liquidationData) {
            if (liquidationData.signatures?.length >= 2) {
                setButtonState("Đã ký");
            } else if (liquidationData.signatures?.length === 1) {
                setButtonState("Hiệu trưởng ký");
            } else {
                setButtonState("Thủ thư ký");
            }
        }
    }, [liquidationData]);

    const handleConfirmSignature = () => {
        if (liquidationToSignature) {
            const payload = liquidationToSignature._id;            
            const callbackCloseDialogConfirm = () => {
                setOpenConfirmSignatureDialog(false);
            };

            onSubmitConfirmSignature(payload, callbackCloseDialogConfirm);
        }
    };

    const handleIsAccept = (row: TLiquidation) => {
        setLiquidationToSignature(row);
        setOpenConfirmSignatureDialog(true);
    };

    const handleSubmitImportFile = async () => {
        if (!file) {
            toast.error("Vui lòng chọn file trước khi tải lên.");
            return;
        }

        try {
            const uploadedFile = await liquidationService.upLoadFile(file, liquidationData?._id);
            if (uploadedFile) {
                if (uploadedFile?.data?.fileSignature) {
                    liquidationData.fileSignature = uploadedFile?.data?.fileSignature;
                }
                revalidate();
                setFile(null);
                setOpenImportFile(false);
                toast.success("Tải file thành công.");
            }
        } catch (error) {
            toast.error(error?.message || "Đã có lỗi xảy ra khi tải lên.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target.files?.[0];
        if (fileInput) {
            setFile(fileInput);
        }
    };

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
                <DialogTitle sx={{ p: 4 }}>Chi tiết phiếu biên bản thanh lý</DialogTitle>

                <DialogContent sx={{ p: { xs: 3, sm: 3, md: 8 } }}>
                    <Box sx={{ display: "none" }}>
                        {liquidationData && <PrintLiquidation ref={componentRef} liquidationData={liquidationData} />}
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
                    {liquidationData?.liquidations?.length > 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
                                    <Chip color="primary" label="Thông tin thanh lý" variant="filled" />
                                </Box>
                                <TableContainer component={Paper} sx={{ mt: 4 }}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left" width="20%">
                                                    Mã barcode
                                                </StyledTableCell>
                                                <StyledTableCell align="left" width="40%">
                                                    Thông tin thanh lý
                                                </StyledTableCell>
                                                <StyledTableCell align="left" width="15%">
                                                    Số lượng thanh lý
                                                </StyledTableCell>
                                                <StyledTableCell align="left" width="15%">
                                                    Giá
                                                </StyledTableCell>
                                                <StyledTableCell align="left" width="15%">
                                                    Tổng giá
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {liquidationData?.liquidations?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="left">
                                                        <Box style={{ width: "100%" }}>
                                                            {row?.barcode || "Không có barcode"}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        <Box>
                                                            <Typography>{row?.name || "Không có dữ liệu"}</Typography>
                                                            <Typography sx={{ mt: 0.5 }}>
                                                                Vị trí:{" "}
                                                                <strong>
                                                                    {capitalizeFirstLetter(row?.position) ||
                                                                        "Không có dữ liệu"}
                                                                </strong>
                                                            </Typography>
                                                            <Typography sx={{ mt: 0.5 }}>
                                                                Loại:{" "}
                                                                <strong>
                                                                    {getLabelFromOptions(
                                                                        typeLiquidationOptions,
                                                                        row?.type
                                                                    ) || "Không có dữ liệu"}
                                                                </strong>
                                                            </Typography>
                                                            {row?.type === "Asset" && (
                                                                <>
                                                                    <Typography sx={{ mt: 0.5 }}>
                                                                        SL trong kho:{" "}
                                                                        <strong>
                                                                            {row?.quantityWarehouse !== undefined
                                                                                ? row?.quantityWarehouse
                                                                                : "0"}
                                                                        </strong>
                                                                    </Typography>
                                                                    <Typography sx={{ mt: 0.5 }}>
                                                                        SL sử dụng:{" "}
                                                                        <strong>
                                                                            {row?.quantityUsed !== undefined
                                                                                ? row?.quantityUsed
                                                                                : "0"}
                                                                        </strong>
                                                                    </Typography>
                                                                </>
                                                            )}
                                                            {row?.type === "Publication" && (
                                                                <>
                                                                    <Typography sx={{ mt: 0.5 }}>
                                                                        SL trong kho:{" "}
                                                                        <strong>
                                                                            {row?.quantity !== undefined
                                                                                ? row?.quantity
                                                                                : "0"}
                                                                        </strong>
                                                                    </Typography>
                                                                    <Typography sx={{ mt: 0.5 }}>
                                                                        SL trên kệ:{" "}
                                                                        <strong>
                                                                            {row?.shelvesQuantity !== undefined
                                                                                ? row?.shelvesQuantity
                                                                                : "0"}
                                                                        </strong>
                                                                    </Typography>
                                                                </>
                                                            )}
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
                                                <StyledTableCell colSpan={2} align="center">
                                                    <strong>Tổng cộng:</strong>
                                                </StyledTableCell>
                                                <StyledTableCell align="left" colSpan={2}>
                                                    <strong style={{ marginLeft: 1 }}>
                                                        {liquidationData?.liquidations
                                                            ?.reduce((total, row) => {
                                                                return total + (row?.quantityLiquidation || 0);
                                                            }, 0)
                                                            .toLocaleString() || "0"}
                                                    </strong>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <strong>
                                                        {liquidationData?.liquidations
                                                            ?.reduce((total, row) => {
                                                                return (
                                                                    total +
                                                                    (row?.priceLiquidation * row?.quantityLiquidation ||
                                                                        0)
                                                                );
                                                            }, 0)
                                                            .toLocaleString() || "0"}
                                                    </strong>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {liquidationData?.fileSignature && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginRight: 2,
                                        maxWidth: "300px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <strong>File biên bản:</strong>{" "}
                                    {liquidationData.fileSignature.name.replace(/\.pdf$/, "")}
                                </Typography>
                                <Box sx={{ mr: 2 }}>
                                    <a
                                        href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${liquidationData.fileSignature.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="contained" sx={{ background: "green", color: "white" }}>
                                            Xem
                                        </Button>
                                    </a>
                                </Box>
                            </Box>
                        )}
                        <Box>
                            {liquidationData?.isAccept && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "inherit" }}
                                    onClick={handleImportFile}
                                >
                                    {liquidationData?.fileSignature ? "Cập nhật phiếu" : "Tải phiếu biên bản"}
                                </Button>
                            )}

                            {/* Dialog Upload File */}
                            <Dialog open={openImportFile} onClose={handleCloseImportFile}>
                                <DialogTitle>
                                    {liquidationData?.fileSignature ? "Cập nhật phiếu biên bản" : "Tải phiếu biên bản"}
                                </DialogTitle>
                                <DialogContent>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf, .jpg, .png" // Giới hạn loại file nếu cần
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseImportFile} color="primary">
                                        Hủy
                                    </Button>
                                    <Button onClick={handleSubmitImportFile} color="primary">
                                        {liquidationData?.fileSignature ? "Cập nhật" : "Tải lên"}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button onClick={onClose} color="error">
                            Đóng
                        </Button>

                        <Button
                            onClick={() => handlePrint()}
                            style={{ background: "#212121", color: "white" }}
                            variant="contained"
                        >
                            In
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleIsAccept(liquidationData)}
                            disabled={liquidationData?.isAccept}
                            sx={{ textTransform: "inherit" }}
                        >
                            {buttonState}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewDetailLiquidation;
