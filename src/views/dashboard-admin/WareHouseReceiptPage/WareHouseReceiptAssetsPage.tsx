import { Button, Chip, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconFileExport, IconTrashXFilled } from "@tabler/icons-react";
import ExcelJS from 'exceljs';
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../helpers/formatDate";
import useQueryString from "../../../hooks/services/useQueryString";
import {
    useAcceptWareHouseAssetsReceipt,
    useAddWareHouseAssetsReceipt,
    useDeleteSoftManyWareHouseAssetsReceipt,
    useDeleteSoftWareHouseAssetsReceipt,
    useEditWareHouseAssetsReceipt,
} from "../../../hooks/services/warehouse-assets-receipt/warehouse-assets-receipt-mutation";
import { useFetchWareHouseAssetsReceipt, useReFetchWareHouseAssetsReceipt } from "../../../hooks/services/warehouse-assets-receipt/warehouse-assets-receipt-query";
import { User } from "../../../interfaces/user";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TSupplier } from "../../../types/models/supplier.type";
import {
    TWareHouseAssetsReceipt,
    TWareHouseAssetsReceiptCreate,
} from "../../../types/models/warehouse-assets-receipt";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import FormAddEditWareHouseAssetsReceipt from "./ui-components/FormAddEditWareHouseAssetsReceipt";
import ViewDetailWareHouseAssetsReceipt from "./ui-components/ViewDetailWareHouseAssets";
import { formatPrice } from "../../../utils/object";

const WareHouseReceiptAssetsPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const theme = useTheme();

    const { data, isLoading, isFetching} = useFetchWareHouseAssetsReceipt({ limit, page, search });
    const mutationAdd = useAddWareHouseAssetsReceipt();
    const mutationEdit = useEditWareHouseAssetsReceipt();
    const mutationSoftDelete = useDeleteSoftWareHouseAssetsReceipt();
    const mutationSoftDeleteMany = useDeleteSoftManyWareHouseAssetsReceipt();
    const revalidate = useReFetchWareHouseAssetsReceipt();
    const mutationAccept = useAcceptWareHouseAssetsReceipt();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TWareHouseAssetsReceipt | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [wareHouseAssetsReceiptToDelete, setWareHouseAssetsReceiptToDelete] =
        useState<TWareHouseAssetsReceipt | null>(null);
    const { hasPermission } = usePermission();
    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);
    const [wareHouseAssetsReceiptsDetails, setWareHouseAssetsReceiptDetails] =
        useState<TWareHouseAssetsReceipt | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const addWareHouseReceipt = () => {
        setOpenAddEdit(true);
    };
    const handleAcceptWareHouseAssetsReceipt = (row: TWareHouseAssetsReceipt) => {
        mutationAccept.mutate(row._id, {
            onSuccess: () => {
                revalidate();
                toast.success("Duyệt phiếu nhập tài sản thành công.");
            },
        });
    };
    const handleEditWareHouseAssetsReceipt = (row: TWareHouseAssetsReceipt) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };
    const handleCloseViewDetail = () => {
        setOpenViewDetail(false);
        setWareHouseAssetsReceiptToDelete(null);
    };
    const handleSubmit = (values: TWareHouseAssetsReceiptCreate) => {
        if (selectedEdit) {
            mutationEdit.mutate(
                {
                    ...values,
                    _id: selectedEdit._id,
                    supplierId: (selectedEdit.supplierId as TSupplier)._id,
                },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success("Chỉnh sửa thành công.");
                        handleClose();
                    },
                }
            );
            return;
        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success("Thêm thành công.");
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TWareHouseAssetsReceipt) => {
        setWareHouseAssetsReceiptToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (wareHouseAssetsReceiptToDelete) {
            mutationSoftDelete.mutate(wareHouseAssetsReceiptToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success("Xóa phiếu nhập kho thành công.");
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };
    const handleViewDetails = (row: TWareHouseAssetsReceipt) => {
        setWareHouseAssetsReceiptDetails(row);
        setOpenViewDetail(true);
    };
    const columns: TColumn<TWareHouseAssetsReceipt>[] = useMemo(
        () => [
            {
                id: "barcode",
                disablePadding: "none",
                label: "Mã phiếu nhập",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 120 },
            },
            {
                id: "infoWarehouseAsset",
                disablePadding: "none",
                label: "Thông tin",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 250 },
                render: (row) => {
                    return (
                        <Box>
                            <Typography mt={0.5}>
                                Nhà cung cấp:
                                <strong style={{ marginLeft: 5 }}>
                                    {capitalizeFirstLetter((row.supplierId as TSupplier)?.name)}
                                </strong>
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                Người nhập: <strong>{(row.createBy as User)?.fullname}</strong>
                            </Typography>
                            {row?.assets?.length > 0 && (
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography>
                                        <strong>Danh sách nhập:</strong>
                                    </Typography>
                                    <ul style={{ marginTop: 5 }}>
                                        {row?.assets.slice(0, 5).map((asset, idx) => (
                                            <li key={idx}>
                                                {capitalizeFirstLetter(asset?.name)}
                                                {/* (SLN:
                                                <strong>{asset?.quantity}</strong> - Tổng giá: <strong>{formatPrice(asset?.priceInput * asset?.quantity)}</strong>) */}
                                            </li>
                                        ))}
                                        {row?.assets?.length > 5 && (
                                            <Chip
                                                label={`+${row?.assets?.length - 5} tài sản khác`}
                                                variant="outlined"
                                                color="primary"
                                            />
                                        )}
                                    </ul>
                                </Box>
                            )}
                        </Box>
                    );
                },
            },
            {
                id: "createdAt",
                disablePadding: "none",
                label: "Ngày tạo",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return <>{formatDate(row.createdAt)}</>;
                },
            },
            {
                id: "updatedAt",
                disablePadding: "none",
                label: "Ngày cập nhật",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return <>{formatDate(row.updatedAt)}</>;
                },
            },
            {
                id: "isAccept",
                disablePadding: "none",
                label: "Duyệt",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <>
                            {hasPermission([
                                { resource: "stockassets", action: "manage" },
                                { resource: "stockassets", action: "update" },
                            ]) && row.isAccept === true ? (
                                <>
                                    <Chip
                                        style={{ color: "white", background: "#096A5E" }}
                                        label="Đã duyệt"
                                        variant="filled"
                                    />
                                </>
                            ) : (
                                <>
                                    {hasPermission([
                                        { resource: "stockassets", action: "manage" },
                                        { resource: "stockassets", action: "update" },
                                    ]) && (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    color: theme.palette.common.white,
                                                    background: theme.palette.error.dark,
                                                }}
                                                onClick={() => handleAcceptWareHouseAssetsReceipt(row)}
                                            >
                                                Chưa duyệt
                                            </Button>
                                        )}
                                </>
                            )}
                        </>
                    );
                },
            },
            {
                id: "action",
                disablePadding: "none",
                align: "center",
                label: "Hành động",
                render: (row) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            {/* row.isAccept !== true && */}
                            <IconEye
                                size={20}
                                stroke={1.5}
                                onClick={() => handleViewDetails(row)}
                            />
                            {hasPermission([
                                { resource: "stockassets", action: "manage" },
                                { resource: "stockassets", action: "update" },
                            ]) &&
                                !row.isAccept && (
                                    <IconPencil
                                        onClick={() => handleEditWareHouseAssetsReceipt(row)}
                                        size={20}
                                        stroke={1.5}
                                    />
                                )}

                            {hasPermission([
                                { resource: "stockassets", action: "manage" },
                                { resource: "stockassets", action: "delete" },
                            ]) &&
                                !row.isAccept && (
                                    <IconTrash
                                        size={20}
                                        stroke={1.5}
                                        onClick={() => handleOpenConfirmDialog(row)}
                                    />
                                )}
                        </Box>
                    );
                },
            },
        ],
        [handleEditWareHouseAssetsReceipt, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TWareHouseAssetsReceipt, checked: boolean) => {
        setCheckedDelete((prev) => {
            if (prev.includes(row._id)) {
                return prev.filter((t) => t !== row._id);
            }
            return [...prev, row._id];
        });
    }, []);

    const handleCheckedDeleteAll = useCallback(
        (checked: boolean) => {
            if (data?.data?.result?.length === 0) return;
            setCheckedDelete((prev) => (checked ? data?.data?.result.map((t) => t._id) : []));
        },
        [data]
    );

    const checkedAll = useMemo(() => {
        if (data?.data?.result?.length === 0 || checkedDelete.length === 0) return false;
        return data?.data?.result?.every((t) => checkedDelete.includes(t._id));
    }, [checkedDelete, data]);

    const handleDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) {
            toast.error("Vui lòng chọn dữ liệu để xóa");
            return;
        }
        setOpenConfirmSoftDeleteMultiple(true);
    }, [checkedDelete]);

    const handleConfirmSoftDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationSoftDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate();
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmSoftDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);

    const handleExportWareHouseReceiptExcel = () => {
        // Tạo một workbook mới
        console.log(data);
        if (data) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Publications');

            // Thêm hàng tiêu đề chính
            worksheet.addRow(['Danh sách nhập tài sản']).font = { bold: true, size: 14 };
            worksheet.addRow([]);

            const currentDateTime = new Date();
            const formattedDateTime = currentDateTime.toLocaleString('vi-VN', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
            });

            worksheet.addRow([`Ngày xuất file: ${formattedDateTime}`]).font = { bold: true };
            worksheet.addRow([]);

            worksheet.addRow([
                'Tên tài sản',
                'Ngày tạo',
                'Ngày cập nhật',
                'Nhà cung cấp',
                'Người tạo',
                'Số lượng nhập',
                'Giá nhập',
                'Tổng giá',
                'Trạng thái'
            ]).font = { bold: true };

            worksheet.getColumn('A').width = 15;
            worksheet.getColumn('B').width = 30;
            worksheet.getColumn('C').width = 30;
            worksheet.getColumn('D').width = 30;
            worksheet.getColumn('E').width = 30;
            worksheet.getColumn('F').width = 30;
            worksheet.getColumn('G').width = 20;
            worksheet.getColumn('H').width = 15;
            worksheet.getColumn('I').width = 15;

            const warehouseReceiptsData = data?.data?.result?.map((receipt) => {
                const supplierName = (receipt?.supplierId as TSupplier)?.name || '';
                const creatorName = (receipt?.createBy as User)?.fullname || '';
                const isAccepted = receipt?.isAccept ? 'Đã duyệt' : 'Chưa duyệt';

                const AssetsData = receipt?.assets?.map((asset) => {
                    return {
                        assetName: asset?.name || '',
                        createdAt: receipt?.createdAt ? new Date(receipt?.createdAt) : null,
                        updatedAt: receipt?.updatedAt ? new Date(receipt?.updatedAt) : null,
                        supplierName: supplierName,
                        creatorName: creatorName,
                        quantityWareHouse: asset?.quantity || 0,
                        price: formatPrice(asset?.priceInput || 0),
                        priceTotal: formatPrice(asset?.priceInput * asset?.quantity || 0),
                        approve: isAccepted,
                    };
                });

                return AssetsData;
            }).flat();

            warehouseReceiptsData.sort((a: any, b: any) => {
                if (a.createdAt && b.createdAt) {
                    return a.createdAt.getTime() - b.createdAt.getTime();
                }
                return 0;
            });


            // Add the data to the worksheet
            warehouseReceiptsData.forEach((dataRow) => {
                const row = worksheet.addRow([]);
                row.values = [
                    dataRow.assetName,
                    dataRow.createdAt,
                    dataRow.updatedAt,
                    dataRow.supplierName,
                    dataRow.creatorName,
                    dataRow.quantityWareHouse,
                    dataRow.price,
                    dataRow.priceTotal,
                    dataRow.approve
                ];
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // Style the header row
            const headerRow = worksheet.getRow(4); // Header starts at row 4
            headerRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFCCCCCC' }
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FF000000' }
                };
            });

            // Tạo file Excel và lưu
            const formattedDate = currentDateTime.toLocaleDateString('vi-VN');
            const fileName = `PhieuNhap_TaiSanThuVien_${formattedDate}.xlsx`;

            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            });
        } else {
            toast.error("Không có dữ liệu để xuất excel");
        }
    };

    const actionMenus = useMemo((): TMenuOption[] => {
        const canManageOrDelete = hasPermission([
            { resource: "stockassets", action: "manage" },
            { resource: "stockassets", action: "delete" },
        ]);
        
        const hasUnacceptedData = data?.data?.result?.some(item => item.isAccept === false);
    
        if (canManageOrDelete && hasUnacceptedData) {
            return [
                {
                    label: "Xóa các dữ liệu vào thùng rác",
                    icon: <IconTrashXFilled size={20} stroke={1.5} />,
                    onClick: handleDeleteMultiple,
                },
                {
                    label: "Xuất danh sách nhập kho",
                    icon: <IconFileExport size={20} stroke={1.5} />,
                    onClick: handleExportWareHouseReceiptExcel,
                },
            ];
        }
    
        if (canManageOrDelete) {
            return [
                {
                    label: "Xuất danh sách nhập kho",
                    icon: <IconFileExport size={20} stroke={1.5} />,
                    onClick: handleExportWareHouseReceiptExcel,
                },
            ];
        }
        return [];
    }, [handleDeleteMultiple, handleExportWareHouseReceiptExcel, data?.data?.result]);
    

    const initialValues = useMemo((): TWareHouseAssetsReceiptCreate => {
        if (selectedEdit) {
            return {
                note: selectedEdit.note,
                supplierId: (selectedEdit.supplierId as TSupplier)._id,
            };
        }
        return {
            note: "",
            supplierId: "0",
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý phiếu nhập kho"
                mainProfile="Danh sách phiếu nhập tài sản"
                link="/quan-ly-nhap-kho/phieu-nhap-tai-san"
            />

            {openAddEdit && (
                <FormAddEditWareHouseAssetsReceipt
                    open={openAddEdit}
                    wareHouseAssetsReceipt={selectedEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    isFetching={mutationAdd.isPending || mutationEdit.isPending}
                />
            )}

            <MainCard>
                <Stack
                    spacing={2}
                    sx={{
                        paddingLeft: { xs: 0, sm: 0, md: 4 },
                        paddingBottom: { xs: 2, sm: 2 },
                        width: "100%",
                    }}
                >
                    <Box display="flex" flexWrap="wrap">
                        {
                            hasPermission([
                                { resource: "stockassets", action: "manage" },
                                { resource: "stockassets", action: "create" },
                            ]) &&
                            <Box>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addWareHouseReceipt}
                                >
                                    Thêm mới
                                </StyledButton>
                            </Box>
                        }
                        <Box>
                            {
                                hasPermission([
                                    { resource: "stockassets", action: "manage" },
                                    { resource: "stockassets", action: "delete" },
                                ]) && 
                                <Link to="/quan-ly-nhap-kho/phieu-nhap-tai-san/danh-sach-xoa-phieu-nhap-kho-tai-san" style={{ textDecoration: 'none' }}>
                                    <StyledButton
                                        sx={{ background: "#de524a", color: "white", marginLeft: "10px" }}
                                        size="small"
                                        startIcon={<IconTrash stroke={2} />}
                                        variant="contained"
                                    >
                                        Thùng rác
                                    </StyledButton>
                                </Link>
                            }
                        </Box>
                    </Box>
                </Stack>

                <ActionsForm actions={actionMenus} />

                <TableList
                    checked={checkedDelete}
                    columns={columns}
                    rows={data?.data?.result || []}
                    onChecked={handleCheckedDelete}
                    onToggleCheckedAll={handleCheckedDeleteAll}
                    checkedAll={checkedAll}
                    isLoading={isLoading}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />

                {openConfirmDialog && (
                    <ConfirmDeleteDialog
                        key={"delete"}
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        onConfirm={handleConfirmDelete}
                        title="Xác nhận xóa?"
                        description={`Bạn có chắc chắn muốn xóa "${wareHouseAssetsReceiptToDelete?._id}" ?`}
                    />
                )}

                {openConfirmSoftDeleteMultiple && (
                    <ConfirmDeleteDialog
                        key={"deleteMultiple"}
                        open={openConfirmSoftDeleteMultiple}
                        onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                        onConfirm={handleConfirmSoftDeleteMultiple}
                        title="Xác nhận xóa các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn xóa?`}
                    />
                )}

                {openViewDetail && (
                    <ViewDetailWareHouseAssetsReceipt
                        open={openViewDetail}
                        onClose={handleCloseViewDetail}
                        wareHouseAssetsReceipt={wareHouseAssetsReceiptsDetails}
                    />
                )}
            </MainCard>
        </div>
    );
};
export default WareHouseReceiptAssetsPage;