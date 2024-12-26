import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { IconEye, IconPencil } from "@tabler/icons";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useAddLiquidation, useDeleteLiquidation, useDeleteManyLiquidation, useEditLiquidation } from "../../../hooks/services/liquidation/liquidation-mutation";
import {
    useFetchLiquidation,
    useReFetchLiquidation,
} from "../../../hooks/services/liquidation/liquidation-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn } from "../../../types/common/table";
import { CreateLiquidation, TLiquidation } from "../../../types/models/liquidation.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import { parserParams } from "../../../utils/object";
import FormAddEditLiquidation from "./ui-components/FormAddEditLiquidation";
import ViewDetailLiquidation from "./ui-components/ViewDetailLiquidation";

const LiquidationProductPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
            ]),
        [search]
    );

    const { data, isLoading, isFetching } = useFetchLiquidation({
        limit,
        page,
        ...filter
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

    const handleEditLiquidation = (row: TLiquidation) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: CreateLiquidation) => {
        console.log("value", values);
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
                    toast.success('Xóa phiếu nhập kho thành công.');
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
                            <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                <Typography>Chi tiết thanh lý</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    {/* Lặp qua từng phần tử trong liquidations */}
                                    {liquidations.map((liquidation, index) => (
                                        <Box key={index}>
                                            {/* Kiểm tra liquidation.type để hiển thị tên tài sản hoặc tên ấn phẩm */}
                                            {liquidation.type === "Asset" ? (
                                                <Box>
                                                    <Typography sx={{ mt: 0.5 }}>
                                                        Tên tài sản: <strong>{liquidation?.name || "Không có tên tài sản"}</strong>
                                                    </Typography>
                                                </Box>
                                            ) : liquidation.type === "Publication" ? (
                                                <Box>
                                                    <Typography sx={{ mt: 0.5 }}>
                                                        Tên ấn phẩm: <strong>{liquidation?.name || "Không có tên ấn phẩm"}</strong>
                                                    </Typography>
                                                </Box>
                                            ) : null}

                                            {/* Hiển thị số lượng thanh lý */}
                                            <Typography sx={{ mt: 0.5 }}>
                                                SL thanh lý: <strong>{liquidation?.quantityLiquidation || "Không có số lượng"}</strong>
                                            </Typography>

                                            {/* Định dạng giá */}
                                            <Typography sx={{ mt: 0.5 }}>
                                                Giá: <strong>
                                                    {liquidation?.priceLiquidation
                                                        ? new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(liquidation.priceLiquidation)
                                                        : "Không có giá"
                                                    }
                                                </strong>
                                            </Typography>
                                            <Typography sx={{ mt: 0.5 }}>
                                                Vị trí: <strong>
                                                    {capitalizeFirstLetter(liquidation?.position)}
                                                </strong>
                                            </Typography>

                                            {/* Đường gạch ngang giữa các phần tử, trừ phần tử cuối */}
                                            {index < liquidations.length - 1 && (
                                                <Divider sx={{ my: 1 }} />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    );
                }
            },
            {
                id: "reason",
                disablePadding: "none",
                label: "Lý do thanh lý",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 150 },
                render: (row) => { return capitalizeFirstLetter(row?.reason) }
                ,
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
                    return (
                        <Typography sx={{ mt: 0.5 }}>{totalQuantity}</Typography>
                    )
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

                    // Định dạng giá trị tiền tệ
                    const formattedPrice = totalPrice ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(totalPrice) : "0 VND";

                    return (
                        <Typography sx={{ mt: 0.5 }}>{formattedPrice}</Typography>
                    );
                },
            },
            {
                id: "signatures",
                disablePadding: "none",
                label: "Trạng thái ký",
                align: "left",
                render: (row) => {
                    const signatures = row?.signatures || [];
                    let signatureText = '';

                    if (signatures.length === 2) {
                        signatureText = `Hiệu trưởng đã ký`;
                    } else if (signatures.includes('thủ thư')) {
                        signatureText = 'Thủ thư ký';
                    } else {
                        signatureText = 'Chưa ký';
                    }

                    return (
                        <Typography sx={{ mt: 0.5 }}>
                            {signatureText}
                        </Typography>
                    );
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

                    return (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconEye
                                size={20}
                                stroke={1.5}
                                onClick={() => handleViewDetails(row)}
                            />

                            {canEdit && (
                                <IconPencil
                                    onClick={() => handleEditLiquidation(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            )}

                            {canDelete && (
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
            status: ""
        };
    }, [selectedEdit]);

    const addLiquidation = () => {
        setOpenAddEdit(true);
    };

    console.log(selectedEdit);
    

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
                                    onClick={addLiquidation}
                                >
                                    Tạo phiếu thanh lý
                                </StyledButton>
                            </Box>
                        }
                    </Box>
                </Stack>

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

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${liquidationToDelete?._id}" ?`}
                />
                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmDeleteMultiple}
                    onClose={() => setOpenConfirmDeleteMultiple(false)}
                    onConfirm={handleConfirmDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />

                {openViewDetail && (
                    <ViewDetailLiquidation
                        open={openViewDetail}
                        onClose={handleCloseViewDetail}
                        liquidationData={liquidationDetails}
                    />
                )}
            </MainCard>
        </div>
    );
};
export default LiquidationProductPage;
