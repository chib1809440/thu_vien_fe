import { Switch } from "@mui/material";
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
import { useAddSupplier, useDeleteSoftSupplier, useDeleteSoftManySupplier, useEditSupplier } from "../../../hooks/services/supplier/supplier-mutation";
import { useFetchSupplier, useReFetchSupplier } from "../../../hooks/services/supplier/supplier-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TSupplier, TSupplierCreate } from "../../../types/models/supplier.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditSupplier from "./ui-components/FormAddEditSupplier";
import usePermission from "../../../utils/hasPermission";


const SupplierPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchSupplier({ limit, page, search });
    const mutationAdd = useAddSupplier();
    const mutationEdit = useEditSupplier();
    const mutationSoftDelete = useDeleteSoftSupplier();
    const mutationSoftDeleteMany = useDeleteSoftManySupplier();
    const revalidate = useReFetchSupplier();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TSupplier | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState<TSupplier | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const addSupplier = () => {
        setOpenAddEdit(true);
    };

    const handleEditSupplier = (row: TSupplier) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TSupplierCreate) => {
        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id },
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

    const handleOpenConfirmDialog = (row: TSupplier) => {
        setSupplierToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (supplierToDelete) {
            mutationSoftDelete.mutate(supplierToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa nhà cung cấp thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };


    const columns: TColumn<TSupplier>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên nhà cung cấp",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "email",
                disablePadding: "none",
                label: "Email",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "phoneNumber",
                disablePadding: "none",
                label: "Số điện thoại",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "address",
                disablePadding: "none",
                label: "Địa chỉ",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
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
                            {
                                hasPermission([
                                    { resource: "suppliers", action: "manage" },
                                    { resource: "suppliers", action: "update" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditSupplier(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }

                            {

                                hasPermission([
                                    { resource: "suppliers", action: "manage" },
                                    { resource: "suppliers", action: "delete" },
                                ]) &&
                                <IconTrash
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
        [handleEditSupplier, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TSupplier, checked: boolean) => {
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
        return hasPermission([
            { resource: "suppliers", action: "manage" },
            { resource: "suppliers", action: "delete" },
        ]) ? [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TSupplierCreate => {

        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                phoneNumber: selectedEdit.phoneNumber,
                email: selectedEdit.email,
                address: selectedEdit.address,
                note: selectedEdit.note,
            };
        }

        return {
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
            note: "",
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý nhà cung cấp"
                mainProfile="Danh sách nhà cung cấp"
                link="/quan-ly-phieu-nhap-kho/nha-cung-cap"
            />

            {openAddEdit && (
                <FormAddEditSupplier
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                />
            )}

            <MainCard>
                <Stack spacing={2} sx={{
                    paddingLeft: { xs: 0, sm: 0, md: 4 },
                    paddingBottom: { xs: 2, sm: 2 },
                    width: '100%'
                }}>
                    <Box display="flex" flexWrap="wrap">
                        <Box>
                            {
                                hasPermission([
                                    { resource: "suppliers", action: "manage" },
                                    { resource: "suppliers", action: "create" },
                                ]) &&
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addSupplier}
                                >
                                    Thêm mới
                                </StyledButton>
                            }

                        </Box>

                        <Box>
                            {
                                hasPermission([
                                    { resource: "suppliers", action: "manage" },
                                    { resource: "suppliers", action: "delete" },
                                ]) &&
                                <Link to="/quan-ly-nhap-kho/nha-cung-cap/danh-sach-xoa-nha-cung-cap" style={{ textDecoration: 'none' }}>
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

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${supplierToDelete?.name}" ?`}
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
export default SupplierPage;