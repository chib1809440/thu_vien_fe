import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Divider,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { IconEye, IconPencil } from "@tabler/icons";
import { IconCheck, IconFileExport, IconPlus, IconTrash } from "@tabler/icons-react";
import ExcelJS from 'exceljs';
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import {
    useAddLiquidation,
    useDeleteLiquidation,
    useDeleteManyLiquidation,
    useEditLiquidation,
    useSignature,
} from "../../../hooks/services/liquidation/liquidation-mutation";
import { useFetchLiquidation, useReFetchLiquidation } from "../../../hooks/services/liquidation/liquidation-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { CreateLiquidation, TLiquidation } from "../../../types/models/liquidation.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import { formatPrice, parserParams } from "../../../utils/object";
import FormAddEditLiquidation from "./ui-components/FormAddEditLiquidation";
import ViewDetailLiquidation from "./ui-components/ViewDetailLiquidation";
import ActionsForm from "../../../components/custom/form/ActionForm";

const LiquidationProductPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const filter = useMemo(() => parserParams([{ compare: "", target: { search } }]), [search]);

    const { data, isLoading, isFetching } = useFetchLiquidation({
        limit,
        page,
        ...filter,
    });

    const mutationAdd = useAddLiquidation();
    const mutationEdit = useEditLiquidation();
    const revalidate = useReFetchLiquidation();
    const { hasPermission } = usePermission();
    const mutationDelete = useDeleteLiquidation();
    const mutationDeleteMany = useDeleteManyLiquidation();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLiquidation | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);
    const [liquidationToDelete, setLiquidationToDelete] = useState<TLiquidation | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [liquidationDetails, setLiquidationDetails] = useState<TLiquidation | null>(null);
    const mutationSignature = useSignature();

    const handleEditLiquidation = (row: TLiquidation) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: CreateLiquidation) => {
        // console.log("value", values);
        if (selectedEdit) {
            mutationEdit.mutate(
                {
                    ...values,
                    _id: selectedEdit._id,
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

    const handleOpenConfirmDialog = (row: TLiquidation) => {
        setLiquidationToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (liquidationToDelete) {
            mutationDelete.mutate(liquidationToDelete._id, {
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
    const handleCloseViewDetail = () => {
        setOpenViewDetail(false);
        setLiquidationToDelete(null);
    };
    const handleViewDetails = (row: TLiquidation) => {
        setLiquidationDetails(row);
        setOpenViewDetail(true);
    };

    const columns: TColumn<TLiquidation>[] = useMemo(
        () => [
            {
                id: "info",
                disablePadding: "none",
                label: "Thông tin thanh lý",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 250 },
                render: (row) => {
                    const liquidations = row?.liquidations || [];
                    return (
                        <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Chi tiết thanh lý</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {liquidations?.length > 0 && (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                        {liquidations.slice(0, 2).map((liquidation, index) => (
                                            <Box key={index}>
                                                {/* Kiểm tra liquidation.type để hiển thị tên tài sản hoặc tên ấn phẩm */}
                                                {liquidation.type === "Asset" ? (
                                                    <Box>
                                                        <Typography sx={{ mt: 0.5 }}>
                                                            Tên tài sản:{" "}
                                                            <strong>
                                                                {capitalizeFirstLetter(liquidation?.name) ||
                                                                    "Không có tên tài sản"}
                                                            </strong>
                                                        </Typography>
                                                    </Box>
                                                ) : liquidation.type === "Publication" ? (
                                                    <Box>
                                                        <Typography sx={{ mt: 0.5 }}>
                                                            Tên ấn phẩm:{" "}
                                                            <strong>
                                                                {capitalizeFirstLetter(liquidation?.name) ||
                                                                    "Không có tên ấn phẩm"}
                                                            </strong>
                                                        </Typography>
                                                    </Box>
                                                ) : null}

                                                {/* Hiển thị số lượng thanh lý */}
                                                <Typography sx={{ mt: 0.5 }}>
                                                    SL thanh lý:{" "}
                                                    <strong>
                                                        {liquidation?.quantityLiquidation || "Không có số lượng"}
                                                    </strong>
                                                </Typography>

                                                {/* Định dạng giá */}
                                                <Typography sx={{ mt: 0.5 }}>
                                                    Giá:
                                                    <strong>
                                                        {formatPrice(liquidation?.priceLiquidation)}
                                                    </strong>
                                                </Typography>
                                                {/* <Typography sx={{ mt: 0.5 }}>
                                                        Vị trí: <strong>
                                                            {capitalizeFirstLetter(liquidation?.position)}
                                                        </strong>
                                                    </Typography> */}

                                                {/* Đường gạch ngang giữa các phần tử, trừ phần tử cuối */}
                                                {index < liquidations.length - 1 && <Divider sx={{ my: 1 }} />}
                                            </Box>
                                        ))}
                                        {liquidations.length > 2 && (
                                            <Chip
                                                label={`+${liquidations?.length - 2} vật phẩm khác`}
                                                variant="outlined"
                                                color="primary"
                                            />
                                        )}
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                },
            },
            {
                id: "reason",
                disablePadding: "none",
                label: "Lý do thanh lý",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 150 },
                render: (row) => {
                    return capitalizeFirstLetter(row?.reason);
                },
            },
            {
                id: "quantity",
                disablePadding: "none",
                label: "Tổng SL",
                align: "left",
                render: (row) => {
                    const totalQuantity = row?.liquidations?.reduce((total, liquidation) => {
                        return total + (liquidation?.quantityLiquidation || 0);
                    }, 0);
                    return <Typography sx={{ mt: 0.5 }}>{totalQuantity}</Typography>;
                },
            },
            {
                id: "quantity",
                disablePadding: "none",
                label: "Tổng giá",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 120 },
                render: (row) => {
                    const totalPrice = row?.liquidations?.reduce((total, liquidation) => {
                        return total + (liquidation?.priceLiquidation * liquidation?.quantityLiquidation || 0);
                    }, 0);

                    return <Typography sx={{ mt: 0.5 }}>{formatPrice(totalPrice)}</Typography>;
                },
            },
            {
                id: "signatures",
                disablePadding: "none",
                label: "Trạng thái ký",
                align: "left",
                render: (row) => {
                    const signatures = row?.signatures || [];
                    let signatureText = "";
                    let textColor = ""; // Để lưu màu sắc

                    if (signatures.length >= 2) {
                        signatureText = `Hiệu trưởng đã ký`;
                        textColor = "green"; // Màu xanh lá cho trường hợp đã ký
                    } else if (signatures.includes("thủ thư")) {
                        signatureText = "Thủ thư ký";
                        textColor = "#de52cf"; // Màu cam cho trường hợp thủ thư ký
                    } else {
                        signatureText = "Chưa ký";
                        textColor = "red"; // Màu đỏ cho trường hợp chưa ký
                    }

                    return <Typography sx={{ mt: 0.5, color: textColor }}>{signatureText}</Typography>;
                },
            },
            {
                id: "action",
                disablePadding: "none",
                align: "center",
                label: "Hành động",
                render: (row) => {
                    const canDelete = row?.signatures?.length <= 1;
                    const canEdit = row?.signatures?.length < 1;
                    const hasFileSignature = row?.fileSignature != null;

                    return (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconEye size={20} stroke={1.5} onClick={() => handleViewDetails(row)} />

                            {canEdit && (
                                <IconPencil onClick={() => handleEditLiquidation(row)} size={20} stroke={1.5} />
                            )}

                            {canDelete && (
                                <IconTrash size={20} stroke={1.5} onClick={() => handleOpenConfirmDialog(row)} />
                            )}
                            {hasFileSignature && (
                                <Tooltip title="Đã tải file biên bản" arrow>
                                    <Box sx={{ cursor: "default" }}>
                                        <IconCheck size={20} stroke={1.5} color="#75ba75" />
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                    );
                },
            },
        ],
        [handleEditLiquidation, handleViewDetails, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TLiquidation, checked: boolean) => {
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
        setOpenConfirmDeleteMultiple(true);
    }, [checkedDelete]);

    const handleConfirmDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate();
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);

    const initialValues = useMemo(() => {
        if (selectedEdit) {
            return {
                note: selectedEdit.note,
                reason: selectedEdit.reason,
                status: selectedEdit.status,
            };
        }

        return {
            note: "",
            reason: "",
            status: "",
        };
    }, [selectedEdit]);

    const addLiquidation = () => {
        setOpenAddEdit(true);
    };

    useEffect(() => {
        if (!data || !data?.data || !data?.data?.result || data?.data?.result?.length === 0 || !liquidationDetails)
            return;

        const prevSelected = { ...liquidationDetails };
        const liquidationData = [...data.data.result];

        const findSelectedUpdated = liquidationData.find((item) => item._id === prevSelected._id);
        if (findSelectedUpdated) setLiquidationDetails(findSelectedUpdated);
    }, [data]);

    const handleSubmitConfirmSignature = (id: string, callbackCloseDialogConfirm: () => void) => {
        if (!liquidationDetails) return;

        mutationSignature.mutate(id, {
            onSuccess: () => {
                revalidate();
                toast.success("Xác nhận ký thành công.");

                callbackCloseDialogConfirm();
            },
            onError: (error) => {
                const errorMessages = (error?.messages || [error?.message]).flat();

                const errorText = errorMessages.map((msg, index) => `<strong>${index + 1}.</strong> ${capitalizeFirstLetter(msg)}`).join('\n');

                toast.error(<div dangerouslySetInnerHTML={{ __html: errorText }} />, {
                    autoClose: 5000,
                });
            },
        });
    };

    const handleExportLiquidationExcel = () => {
        // Tạo một workbook mới
        console.log(data);
        if (data) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Publications');

            // Thêm hàng tiêu đề chính
            worksheet.addRow(['Danh sách phiếu biên bản thanh lý']).font = { bold: true, size: 14 };
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
                'Thông tin thanh lý',
                'Vị trí',
                'Ngày tạo',
                'Ngày cập nhật',
                'Số lượng thanh lý',
                'Giá',
                'Tổng giá',
                'Trạng thái ký'
            ]).font = { bold: true };

            worksheet.getColumn('A').width = 15;
            worksheet.getColumn('B').width = 30;
            worksheet.getColumn('C').width = 30;
            worksheet.getColumn('D').width = 30;
            worksheet.getColumn('E').width = 30;
            worksheet.getColumn('F').width = 30;
            worksheet.getColumn('G').width = 20;
            worksheet.getColumn('H').width = 20;

            const LiquidationsData = data?.data?.result?.map((liquidation) => {
                const isAccepted = liquidation?.isAccept ? 'Đã ký' : 'Chưa ký';

                const liquiData = liquidation?.liquidations?.map((item) => {
                    return {
                        name: item?.name || '',
                        position: capitalizeFirstLetter(item?.position),
                        createdAt: liquidation?.createdAt ? new Date(liquidation?.createdAt) : null,
                        updatedAt: liquidation?.updatedAt ? new Date(liquidation?.updatedAt) : null,
                        quantityLiquidation: item?.quantityLiquidation || 0,
                        priceLiquidation: formatPrice(item?.priceLiquidation) || 0,
                        priceTotal: formatPrice(item?.priceLiquidation * item?.quantityLiquidation) || 0,
                        approve: isAccepted,
                    };
                });

                return liquiData;
            }).flat();

            LiquidationsData.sort((a: any, b: any) => {
                if (a.createdAt && b.createdAt) {
                    return a.createdAt.getTime() - b.createdAt.getTime();
                }
                return 0;
            });


            // Add the data to the worksheet
            LiquidationsData.forEach((dataRow) => {
                const row = worksheet.addRow([]);
                row.values = [
                    dataRow.name,
                    dataRow.position,
                    dataRow.createdAt,
                    dataRow.updatedAt,
                    dataRow.quantityLiquidation,
                    dataRow.priceLiquidation,
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
            const fileName = `PhieuBienBan_Thanhly_${formattedDate}.xlsx`;

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
        return [
            {
                label: "Xuất danh sách phiếu biên bản",
                icon: <IconFileExport size={20} stroke={1.5} />,
                onClick: handleExportLiquidationExcel,
            },
        ];
    }, [handleExportLiquidationExcel]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý kho ấn phẩm"
                mainProfile="Danh sách thanh lý"
                link="/quan-ly-kho/kho-an-pham"
            />

            {openAddEdit && (
                <FormAddEditLiquidation
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    liquidationRecord={selectedEdit}
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
                        {hasPermission([
                            { resource: "stockassets", action: "manage" },
                            { resource: "stockassets", action: "create" },
                        ]) && (
                                <Box>
                                    <StyledButton
                                        color="primary"
                                        size="small"
                                        startIcon={<IconPlus stroke={2} />}
                                        variant="contained"
                                        onClick={addLiquidation}
                                    >
                                        Tạo phiếu thanh lý
                                    </StyledButton>
                                </Box>
                            )}
                    </Box>
                </Stack>

                <ActionsForm isActive={false} actions={actionMenus} />

                <TableList
                    checked={checkedDelete}
                    columns={columns}
                    rows={data?.data?.result || []}
                    onChecked={handleCheckedDelete}
                    onToggleCheckedAll={handleCheckedDeleteAll}
                    checkedAll={checkedAll}
                    isLoading={isLoading || isFetching}
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
                        description={`Bạn có chắc chắn muốn xóa "${liquidationToDelete?._id}" ?`}
                    />
                )}

                {openConfirmDeleteMultiple && (
                    <ConfirmDeleteDialog
                        key={"deleteMultiple"}
                        open={openConfirmDeleteMultiple}
                        onClose={() => setOpenConfirmDeleteMultiple(false)}
                        onConfirm={handleConfirmDeleteMultiple}
                        title="Xác nhận xóa các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn xóa?`}
                    />
                )}

                {openViewDetail && (
                    <ViewDetailLiquidation
                        open={openViewDetail}
                        onClose={handleCloseViewDetail}
                        liquidationData={liquidationDetails}
                        onSubmitConfirmSignature={handleSubmitConfirmSignature}
                    />
                )}
            </MainCard>
        </div>
    );
};
export default LiquidationProductPage;
