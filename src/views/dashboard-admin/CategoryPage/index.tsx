import { Switch, Typography } from "@mui/material";
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
import { useAddCategory, useDeleteSoftCategory, useDeleteSoftManyCategory, useEditCategory } from "../../../hooks/services/category/category-mutation";
import { useFetchCategory, useReFetchCategory } from "../../../hooks/services/category/category-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TCategory, TCategoryCreate } from "../../../types/models/category";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditCategory from "./ui-components/FormAddEditCategory";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { parserParams } from "../../../utils/object";
import { useFetchLibrary } from "../../../hooks/services/library/library-query";
import { useAuth } from "../../../contexts/JWTContext";
import usePermission from "../../../utils/hasPermission";


const CategoryPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const [selectedLibrary, setSelectedLibrary] = useState(0);
    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
                { compare: 0, target: { libraryId: selectedLibrary } },
            ]),
        [
            selectedLibrary,
            search,
        ]
    );

    const { data, isLoading, isFetching } = useFetchCategory({
        limit,
        page,
        ...filter,
    });
    const { data: libraryData } = useFetchLibrary();
    const mutationAdd = useAddCategory();
    const mutationEdit = useEditCategory();
    const mutationSoftDelete = useDeleteSoftCategory();
    const mutationSoftDeleteMany = useDeleteSoftManyCategory();
    const revalidate = useReFetchCategory();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TCategory | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<TCategory | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const { user } = useAuth();
    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);

    const addCategory = () => {
        setOpenAddEdit(true);
    };

    const handleEditCategory = (row: TCategory) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TCategoryCreate) => {
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

    const handleOpenConfirmDialog = (row: TCategory) => {
        setCategoryToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            mutationSoftDelete.mutate(categoryToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa lĩnh vực thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleChangeShareConnect = (row: TCategory, checked: boolean) => {
        // TODO: update
        mutationEdit.mutate(
            { isLink: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    revalidate();
                    toast.success('Cập nhật trạng thái thành công.');
                },
            }
        );
        return;
    };

    // loc
    const handleLibraryFilterChange = (event) => {
        setSelectedLibrary(event.target.value);
    };

    const columns: TColumn<TCategory>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên lĩnh vực",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    const hasWhitespace = /\s/.test(row?.name);
                    return (
                        <Typography noWrap={!hasWhitespace}>
                            {capitalizeFirstLetter(row?.name)}
                        </Typography>
                    );
                },
            },
            {
                id: "description",
                disablePadding: "none",
                label: "Mô tả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },

            {
                id: "isLink",
                disablePadding: "none",
                label: "Chia sẻ liên thông",
                sxRow: { paddingRight: 4 },
                render: (row) => {
                    return (
                        <Switch
                            checked={row?.isLink}
                            value={row?.isLink}
                            onChange={(event) => handleChangeShareConnect(row, event.target.checked)}
                            disabled={hasPermission([
                                { resource: "categories", action: "manage" },
                                { resource: "categories", action: "update" },
                            ]) ? false : true}
                        />
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
                            {
                                hasPermission([
                                    { resource: "categories", action: "manage" },
                                    { resource: "categories", action: "update" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditCategory(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }
                            {
                                hasPermission([
                                    { resource: "categories", action: "manage" },
                                    { resource: "categories", action: "delete" },
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
        [handleEditCategory, handleOpenConfirmDialog, handleChangeShareConnect]
    );

    const handleCheckedDelete = useCallback((row: TCategory, checked: boolean) => {
        setCheckedDelete((prev) => {
            if (prev.includes(row._id)) {
                return prev.filter((t) => t !== row._id);
            }
            return [...prev, row._id];
        })
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
            { resource: "categories", action: "manage" },
            { resource: "categories", action: "create" },
        ]) ? [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TCategoryCreate => {
        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                description: selectedEdit.description,
                isLink: selectedEdit.isLink,
            };
        }

        return {
            name: "",
            description: "",
            isLink: false,
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý lĩnh vực"
                mainProfile="Danh sách lĩnh vực"
                link="/quan-ly-danh-muc/linh-vuc"
            />

            {openAddEdit && (
                <FormAddEditCategory
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
                        {
                            hasPermission([
                                { resource: "categories", action: "manage" },
                                { resource: "categories", action: "create" },
                            ]) &&
                            <Box>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addCategory}
                                >
                                    Thêm mới
                                </StyledButton>
                            </Box>
                        }


                        <Box>
                            {
                                hasPermission([
                                    { resource: "categories", action: "manage" },
                                    { resource: "categories", action: "delete" },
                                ]) &&

                                <Link to="/quan-ly-danh-muc/danh-sach-xoa-linh-vuc" style={{ textDecoration: 'none' }}>
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

                <ActionsForm actions={actionMenus}
                    {...((userRole === "Super Admin") ? {
                        selectedLibrary: selectedLibrary,
                        handleLibraryFilterChange: handleLibraryFilterChange,
                        libraryData: libraryData?.data?.result

                    } : {})}
                />

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

                {openConfirmDialog &&
                    <ConfirmDeleteDialog
                        key={"delete"}
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        onConfirm={handleConfirmDelete}
                        title="Xác nhận xóa?"
                        description={`Bạn có chắc chắn muốn xóa "${categoryToDelete?.name}" ?`}
                    />
                }

                {openConfirmSoftDeleteMultiple &&
                    <ConfirmDeleteDialog
                        key={"deleteMultiple"}
                        open={openConfirmSoftDeleteMultiple}
                        onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                        onConfirm={handleConfirmSoftDeleteMultiple}
                        title="Xác nhận xóa các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn xóa?`}
                    />
                }
            </MainCard>
        </div>
    );
};
export default CategoryPage;