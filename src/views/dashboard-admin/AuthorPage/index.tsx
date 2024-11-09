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
import { useAddAuthor, useDeleteSoftAuthor, useDeleteSoftManyAuthor, useEditAuthor } from "../../../hooks/services/author/author-mutation";
import { useFetchAuthor, useReFetchAuthor } from "../../../hooks/services/author/author-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TAuthor, TAuthorCreate } from "../../../types/models/author";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditAuthor from "./ui-components/FormAddEditAuthor";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { parserParams } from "../../../utils/object";
import { useFetchLibrary } from "../../../hooks/services/library/library-query";
import { useAuth } from "../../../contexts/JWTContext";
import usePermission from "../../../utils/hasPermission";


const AuthorPage = () => {
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

    const { data, isLoading, isFetching } = useFetchAuthor({
        limit,
        page,
        ...filter,
    });
    const { data: libraryData } = useFetchLibrary();
    const mutationAdd = useAddAuthor();
    const mutationEdit = useEditAuthor();
    const mutationSoftDelete = useDeleteSoftAuthor();
    const mutationSoftDeleteMany = useDeleteSoftManyAuthor();
    const revalidate = useReFetchAuthor();
    const { hasPermission } = usePermission()
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TAuthor | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<TAuthor | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const { user } = useAuth();
    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);

    const addAuthor = () => {
        setOpenAddEdit(true);
    };

    const handleEditAuthor = (row: TAuthor) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TAuthorCreate) => {
        console.log(values);

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

    const handleOpenConfirmDialog = (row: TAuthor) => {
        setAuthorToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (authorToDelete) {
            mutationSoftDelete.mutate(authorToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa tác giả thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleChangeShareConnect = (row: TAuthor, checked: boolean) => {
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

    const columns: TColumn<TAuthor>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên tác giả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200, textTransform: "capitalize" },
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
                                { resource: "authors", action: "manage" },
                                { resource: "authors", action: "update" },
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
                                    { resource: "authors", action: "manage" },
                                    { resource: "authors", action: "update" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditAuthor(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }
                            {
                                hasPermission([
                                    { resource: "authors", action: "manage" },
                                    { resource: "authors", action: "delete" },
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
        [handleEditAuthor, handleOpenConfirmDialog, handleChangeShareConnect]
    );

    const handleCheckedDelete = useCallback((row: TAuthor, checked: boolean) => {
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
            { resource: "authors", action: "manage" },
            { resource: "authors", action: "delete" },
        ]) ? [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TAuthorCreate => {

        if (selectedEdit) {
            console.log(selectedEdit);

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
                profile="Quản lý tác giả"
                mainProfile="Danh sách tác giả"
                link="/quan-ly-danh-muc/tac-gia"
            />

            {openAddEdit && (
                <FormAddEditAuthor
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                />
            )}

            <MainCard>
                <Stack spacing={2} sx={{ paddingLeft: { xs: 4, sm: 4 }, paddingBottom: { xs: 2, sm: 2 }, width: '100%' }}>
                    <Box display="flex" flexWrap="wrap">
                        {
                            hasPermission([
                                { resource: "authors", action: "manage" },
                                { resource: "authors", action: "create" },
                            ]) &&
                            <Box>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addAuthor}
                                >
                                    Thêm mới
                                </StyledButton>
                            </Box>
                        }


                        <Box>
                            {
                                hasPermission([
                                    { resource: "authors", action: "manage" },
                                    { resource: "authors", action: "delete" },
                                ]) &&
                                <Link to="/quan-ly-danh-muc/danh-sach-xoa-tac-gia" style={{ textDecoration: 'none' }}>
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

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${authorToDelete?.name}" ?`}
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
export default AuthorPage;