import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus } from "@tabler/icons";
import { IconDoorExit, IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useFetchAsset } from "../../../hooks/react-query/assetData";
import { useAddShelf, useDeleteManyShelf, useDeleteShelf, useEditShelf } from "../../../hooks/services/shelf/shelf-mutation";
import { useFetchShelf, useReFetchShelf } from "../../../hooks/services/shelf/shelf-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { Asset } from "../../../interfaces/asset";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TShelves, TShelvesCreate } from "../../../types/models/shelves";
import { TTypeAsset } from "../../../types/models/type-asset";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import { parserParams } from "../../../utils/object";
import FilterByItems from "../PublicationsPage/ui-components/FilterByItems";
import FormAddEditShelf from "./ui-components/FormAddEditShelf";


const ShelfPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const [selectedBelongAsset, setSelectedBelongAsset] = useState(0);

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
                { compare: 0, target: { assetId: selectedBelongAsset } },
            ]),
        [search, selectedBelongAsset]
    );

    const { data, isLoading, isFetching } = useFetchShelf({
        limit,
        page,
        ...filter,
    });
    const mutationAdd = useAddShelf();
    const mutationEdit = useEditShelf();
    const mutationDelete = useDeleteShelf();
    const mutationDeleteMany = useDeleteManyShelf();
    const revalidate = useReFetchShelf();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TShelves | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [shelfToDelete, setShelfToDelete] = useState<TShelves | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);

    const { data: assetData } = useFetchAsset();

    const addShelf = () => {
        setOpenAddEdit(true);
    };

    const handleEditShelf = (row: TShelves) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TShelvesCreate) => {
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

    const handleOpenConfirmDialog = (row: TShelves) => {
        setShelfToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (shelfToDelete) {
            mutationDelete.mutate(shelfToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa tủ kệ thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const columns: TColumn<TShelves>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên tủ kệ",
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
                id: "assetId",
                disablePadding: "none",
                label: "Thuộc tài sản",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => (row.assetId as Asset)?.name,
            },
            {
                id: "description",
                disablePadding: "none",
                label: "Mô tả",
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
                            {hasPermission([
                                { resource: "shelves", action: "manage" },
                                { resource: "shelves", action: "update" },
                            ]) &&
                                <IconPencil
                                    onClick={() => handleEditShelf(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }
                            {hasPermission([
                                { resource: "shelves", action: "manage" },
                                { resource: "shelves", action: "delete" },
                            ]) &&
                                <IconDoorExit
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
        [handleEditShelf, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TShelves, checked: boolean) => {
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

    const actionMenus = useMemo((): TMenuOption[] => {
        return hasPermission([
            { resource: "shelves", action: "manage" },
            { resource: "shelves", action: "delete" },
        ]) ? [
            {
                label: "Xóa các dữ liệu đã chọn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TShelvesCreate => {
        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                description: selectedEdit.description,
                note: selectedEdit.note,
                assetId: (selectedEdit.assetId as Asset)?._id || null,
            };
        }

        return {
            name: "",
            description: "",
            note: "",
            assetId: null,
        };
    }, [selectedEdit]);

    const filteredData = assetData?.data?.result?.filter(item => (item?.typeAssetId as TTypeAsset)?.name === "tủ kệ");
    // loc
    const handleAssetsFilterChange = (event) => {
        setSelectedBelongAsset(event.target.value);
    };

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý tủ kệ"
                mainProfile="Danh sách tủ kệ"
                link="/tai-san-thu-vien/tu-ke"
            />

            {openAddEdit && (
                <FormAddEditShelf
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    assetData={filteredData}
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
                                { resource: "shelves", action: "manage" },
                                { resource: "shelves", action: "create" },
                            ]) &&
                            <Box>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addShelf}
                                >
                                    Thêm mới
                                </StyledButton>
                            </Box>
                        }
                    </Box>
                </Stack>

                <ActionsForm actions={actionMenus} />

                <FilterByItems
                    selectedBelongAsset={selectedBelongAsset}
                    handleBelongAssetFilterChange={handleAssetsFilterChange}
                    assetData={filteredData}
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

                {
                    openConfirmDialog &&
                    <ConfirmDeleteDialog
                        key={"removeStock"}
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        onConfirm={handleConfirmDelete}
                        title="Chuyển xuống kho?"
                        description={`Bạn có chắc chắn muốn chuyển tủ kệ "${shelfToDelete?.name}" xuống kho?`}
                    />
                }
                {
                    openConfirmDeleteMultiple &&
                    <ConfirmDeleteDialog
                        key={"removeStockMultiple"}
                        open={openConfirmDeleteMultiple}
                        onClose={() => setOpenConfirmDeleteMultiple(false)}
                        onConfirm={handleConfirmDeleteMultiple}
                        title="Xác nhận chuyển các mục đã chọn xuống kho?"
                        description={`Bạn có chắc chắn muốn chuyển xuống kho?`}
                    />
                }
            </MainCard>
        </div>
    );
};
export default ShelfPage;