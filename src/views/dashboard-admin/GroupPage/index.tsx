import { Switch } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { useCallback, useMemo, useState } from "react";
import StyledButton from "../../../components/default/button/StyledButton";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAddGroup, useDeleteGroup, useDeleteManyGroup, useEditGroup } from "../../../hooks/services/group/group-mutation";
import { useFetchGroup, useReFetchGroup } from "../../../hooks/services/group/group-query";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TGroup, TGroupCreate } from "../../../types/models/group.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditGroup from "./ui-components/FormAddEditGroup";
import useQueryString from "../../../hooks/services/useQueryString";
import TableList from "../../../components/custom/table-list/TableList";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import { useFetchLibrary } from "../../../hooks/services/library/library-query";
import { TLibrary } from "../../../types/models/library.type";
import { IconTrashXFilled } from "@tabler/icons-react";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";

const GroupPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchGroup({ limit, page, search });
    const { data: libs } = useFetchLibrary();

    const mutationAdd = useAddGroup();
    const mutationEdit = useEditGroup();
    const mutationDelete = useDeleteGroup();
    const mutationDeleteMany = useDeleteManyGroup();
    const revalidate = useReFetchGroup();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TGroup | null>(null);
    const [selectedLib, setSelectedLib] = useState<TLibrary[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<TGroup | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);

    const addGroup = () => {
        setOpenAddEdit(true);
    };

    const handleEditGroup = (row: TGroup) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleChangePublic = (row: TGroup, checked: boolean) => {
        // TODO: update
        mutationEdit.mutate(
            { isPublic: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    toast.success('Cập nhật hiển thị thành công.');
                    revalidate();
                },
            }
        );
        return;
    };

    const handleSubmit = (values: TGroupCreate) => {
        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        toast.success('Chỉnh sửa thành công.');
                        revalidate();
                        handleClose();
                    },
                }
            );

            return;

        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                toast.success('Thêm thành công.');
                revalidate();
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TGroup) => {
        setGroupToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (groupToDelete) {
            mutationDelete.mutate(groupToDelete._id, {
                onSuccess: () => {
                    toast.success('Xóa nhóm thành công.');
                    revalidate();
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const columns: TColumn<TGroup>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên nhóm",
                align: "left",
            },
            {
                id: "mainLibrary",
                disablePadding: "none",
                label: "Thư viện",
                sxRow: { paddingRight: 4 },
                render: (row) => {
                    return (
                        <span>
                            {row.mainLibrary ? row.mainLibrary.name : "Chưa có thư viện"}
                        </span>
                    );
                },
            },
            {
                id: "isPublic",
                disablePadding: "none",
                label: "Hiển thị",
                sxRow: { paddingRight: 4 },
                render: (row) => {
                    return (
                        <Switch
                            checked={row?.isPublic}
                            value={row?.isPublic}
                            onChange={(event) => handleChangePublic(row, event.target.checked)}
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
                            <IconPencil
                                onClick={() => handleEditGroup(row)}
                                size={20}
                                stroke={1.5}
                            />
                            <IconTrash
                                size={20}
                                stroke={1.5}
                                onClick={() => handleOpenConfirmDialog(row)}
                            />
                        </Box>
                    );
                },
            },
        ],
        [handleChangePublic, handleEditGroup, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TGroup, checked: boolean) => {
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
        return data.data.result.some((t) => checkedDelete.includes(t._id));
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
                toast.success("Xóa các mục đã chọn thành công.");
                revalidate();
                setOpenConfirmDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);

    const actionMenus = useMemo((): TMenuOption[] => {
        return [
            {
                label: "Xóa các dữ liệu đã chọn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TGroupCreate => {
        if (selectedEdit) {
            return {
                isPublic: selectedEdit.isPublic,
                name: selectedEdit.name,
            };
        }

        return {
            isPublic: false,
            name: "",
        };
    }, [selectedEdit]);

    const handleOnSelectedLibs = useCallback((libs: TLibrary[]) => {
        setSelectedLib(libs);
    }, []);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý nhóm"
                mainProfile="Danh sách nhóm"
                link="/he-thong/quan-ly-nhom"
            />

            {openAddEdit && (
                <FormAddEditGroup
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    libOptions={libs?.data?.result || []}
                    onSelectedLibs={handleOnSelectedLibs}
                    selectedLib={selectedLib}
                />
            )}

            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb: 2 }}>
                            <StyledButton
                                color="primary"
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={addGroup}
                            >
                                Thêm mới
                            </StyledButton>
                        </Box>
                    </CsFlexRowBetween>
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
                    title="Xác nhận xóa thư viện"
                    description={`Bạn có chắc chắn muốn xóa "${groupToDelete?.name}" ?`}
                />
                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmDeleteMultiple}
                    onClose={() => setOpenConfirmDeleteMultiple(false)}
                    onConfirm={handleConfirmDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />
            </MainCard>
        </div>
    );
};
export default GroupPage;