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
import { useAddTypeVoice, useDeleteSoftManyTypeVoice, useDeleteSoftTypeVoice, useEditTypeVoice } from "../../../hooks/services/type-voice/type-voice-mutation";
import { useFetchTypeVoice, useReFetchTypeVoice } from "../../../hooks/services/type-voice/type-voice-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TTypeVoice, TTypeVoiceCreate } from "../../../types/models/type-voice";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditTypeVoice from "./ui-components/FormAddEditTypeVoice";
import usePermission from "../../../utils/hasPermission";


const TypeVoicePage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading, isFetching } = useFetchTypeVoice({ limit, page, search });
    const mutationAdd = useAddTypeVoice();
    const mutationEdit = useEditTypeVoice();
    const mutationSoftDelete = useDeleteSoftTypeVoice();
    const mutationSoftDeleteMany = useDeleteSoftManyTypeVoice();
    const revalidate = useReFetchTypeVoice();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TTypeVoice | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [typeVoiceToDelete, setTypeVoiceToDelete] = useState<TTypeVoice | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const addTypeVoice = () => {
        setOpenAddEdit(true);
    };

    const handleEditTypeVoice = (row: TTypeVoice) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TTypeVoiceCreate) => {
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

    const handleOpenConfirmDialog = (row: TTypeVoice) => {
        setTypeVoiceToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (typeVoiceToDelete) {
            mutationSoftDelete.mutate(typeVoiceToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa loại voice thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const columns: TColumn<TTypeVoice>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên loại voice",
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
                                    { resource: "typevoices", action: "manage" },
                                    { resource: "typevoices", action: "update" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditTypeVoice(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }
                            {
                                hasPermission([
                                    { resource: "typevoices", action: "manage" },
                                    { resource: "typevoices", action: "delete" },
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
        [handleEditTypeVoice, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TTypeVoice, checked: boolean) => {
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
            { resource: "typevoices", action: "manage" },
            { resource: "typevoices", action: "delete" },
        ]) ? [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TTypeVoiceCreate => {

        if (selectedEdit) {
            return {
                name: selectedEdit.name
            };
        }

        return {
            name: "",
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý loại voice"
                mainProfile="Danh sách loại voice"
                link="/quan-ly-danh-muc/loai-voice"
            />

            {openAddEdit && (
                <FormAddEditTypeVoice
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    isFetching={mutationAdd.isPending || mutationEdit.isPending}
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
                                { resource: "typevoices", action: "manage" },
                                { resource: "typevoices", action: "create" },
                            ]) &&
                            <Box>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addTypeVoice}
                                >
                                    Thêm mới
                                </StyledButton>
                            </Box>
                        }

                        <Box>
                            {
                                hasPermission([
                                    { resource: "typevoices", action: "manage" },
                                    { resource: "typevoices", action: "delete" },
                                ]) &&
                                <Link to="/quan-ly-danh-muc/danh-sach-xoa-loai-voice" style={{ textDecoration: 'none' }}>
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
                    description={`Bạn có chắc chắn muốn xóa "${typeVoiceToDelete?.name}" ?`}
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
export default TypeVoicePage;