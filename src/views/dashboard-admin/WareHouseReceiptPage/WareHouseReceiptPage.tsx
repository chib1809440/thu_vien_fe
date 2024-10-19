import { Button, Chip, Switch, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TWareHouseReceipt, TWareHouseReceiptCreate } from "../../../types/models/warehouse-receipt";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { useFetchWareHouseReceipt, useReFetchWareHouseReceipt } from "../../../hooks/services/warehouseReceipt/warehousereceipt-query";
import { useAcceptWareHouseReceipt, useAddWareHouseReceipt, useDeleteSoftManyWareHouseReceipt, useDeleteSoftWareHouseReceipt, useEditWareHouseReceipt } from "../../../hooks/services/warehouseReceipt/warehousereceipt-mutation";
import FormAddEditWareHouseReceipt from "./ui-components/FormAddEditWareHouseReceipt";
import { User } from "../../../interfaces/user";
import { TSupplier } from "../../../types/models/supplier.type";
import { TLoanSlip } from "../../../types/models/loanSlip.type";
import { useApprovalLoanSlip } from "../../../hooks/services/loanSlip/loanSlip-mutation";


const WareHouseReceiptPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const theme = useTheme();

    const { data, isLoading } = useFetchWareHouseReceipt({ limit, page, search });
    const mutationAdd = useAddWareHouseReceipt();
    const mutationEdit = useEditWareHouseReceipt();
    const mutationSoftDelete = useDeleteSoftWareHouseReceipt();
    const mutationSoftDeleteMany = useDeleteSoftManyWareHouseReceipt();
    const revalidate = useReFetchWareHouseReceipt();
    const mutationAccept = useAcceptWareHouseReceipt();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TWareHouseReceipt | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [wareHouseReceiptToDelete, setWareHouseReceiptToDelete] = useState<TWareHouseReceipt | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const addWareHouseReceipt = () => {
        setOpenAddEdit(true);
    };
    const handleAcceptWareHouseReceipt = (row: TWareHouseReceipt) => {
        mutationAccept.mutate(row._id, {
            onSuccess: () => {
                revalidate();
                toast.success('Duyệt phiếu nhập kho thành công.');
            },
        });
    };
    const handleEditWareHouseReceipt = (row: TWareHouseReceipt) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TWareHouseReceiptCreate) => {
        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id, supplierId: (selectedEdit.supplierId as TSupplier)._id },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success('Chỉnh sửa thành công.');
                        handleClose();
                    },
                }
            );
            return;
        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TWareHouseReceipt) => {
        setWareHouseReceiptToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (wareHouseReceiptToDelete) {
            mutationSoftDelete.mutate(wareHouseReceiptToDelete._id, {
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

    const columns: TColumn<TWareHouseReceipt>[] = useMemo(
        () => [
            {
                id: "barcode",
                disablePadding: "none",
                label: "Barcode",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "supplierId",
                disablePadding: "none",
                label: "Nhà cung cấp",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <>
                            {(row.supplierId as TSupplier).name}
                        </>
                    );
                },
            },
            {
                id: "createdAt",
                disablePadding: "none",
                label: "Ngày tạo",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "updatedAt",
                disablePadding: "none",
                label: "Ngày cập nhật",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "createBy",
                disablePadding: "none",
                label: "Người tạo",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <>
                            {(row.createBy as User).fullname}
                        </>
                    );
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
                            {
                                row.isAccept === true ? <>
                                    <Chip
                                        style={{ color: 'white', background: '#096A5E' }}
                                        label="Đã duyệt"
                                        variant="filled"
                                    />
                                </> : <>
                                    <Button variant="contained" sx={{ color: theme.palette.common.white, background: theme.palette.error.dark }} onClick={() => handleAcceptWareHouseReceipt(row)}>Chưa duyệt</Button>
                                </>
                            }
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
                            <IconPencil
                                onClick={() => handleEditWareHouseReceipt(row)}
                                size={20}
                                stroke={1.5}
                            />
                            {
                                !row.isAccept && <IconTrash
                                    size={20}
                                    stroke={1.5}
                                    onClick={() => handleOpenConfirmDialog(row)}
                                />
                            }

                        </Box>
                    );
                },
            },
        ],
        [handleEditWareHouseReceipt, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TWareHouseReceipt, checked: boolean) => {
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

    const actionMenus = useMemo((): TMenuOption[] => {
        return [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TWareHouseReceiptCreate => {
        if (selectedEdit) {
            return {
                note: selectedEdit.note,
                supplierId: (selectedEdit.supplierId as TSupplier)._id
            };
        }
        return {
            note: "",
            supplierId: "0"

        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý phiếu nhập kho"
                mainProfile="Danh sách phiếu nhập kho"
                link="/quan-ly-nhap-kho/phieu-nhap-kho"
            />

            {openAddEdit && (
                <FormAddEditWareHouseReceipt
                    open={openAddEdit}
                    wareHouseReceipt={selectedEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                />
            )}

            <MainCard>
                <Stack spacing={2} sx={{ paddingLeft: { xs: 4, sm: 4 }, paddingBottom: { xs: 2, sm: 2 }, width: '100%' }}>
                    <Box display="flex" flexWrap="wrap">
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

                        <Box>
                            <Link to="/quan-ly-nhap-kho/phieu-nhap-kho/danh-sach-xoa-phieu-nhap-kho" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    sx={{ background: "#de524a", color: "white", marginLeft: "10px" }}
                                    size="small"
                                    startIcon={<IconTrash stroke={2} />}
                                    variant="contained"
                                >
                                    Thùng rác
                                </StyledButton>
                            </Link>
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

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${wareHouseReceiptToDelete?._id}" ?`}
                />
                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmSoftDeleteMultiple}
                    onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                    onConfirm={handleConfirmSoftDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />
            </MainCard>
        </div>
    );
};
export default WareHouseReceiptPage;