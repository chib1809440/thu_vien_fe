import { Switch } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAddAuthor, useDeleteAuthor, useEditAuthor } from "../../../hooks/services/author/author-mutation";
import { useFetchAuthor, useReFetchAuthor } from "../../../hooks/services/author/author-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn } from "../../../types/common/table";
import { TAuthor, TAuthorCreate } from "../../../types/models/author";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditAuthor from "./ui-components/FormAddEditAuthor";


const AuthorPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchAuthor({ limit, page, search });
    const mutationAdd = useAddAuthor();
    const mutationEdit = useEditAuthor();
    const mutationDelete = useDeleteAuthor();
    const revalidate = useReFetchAuthor();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TAuthor | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<TAuthor | null>(null);
    

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

    const handleOpenConfirmDialog = (row: TAuthor) => {
        setAuthorToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (authorToDelete) {
            mutationDelete.mutate(authorToDelete._id, {
                onSuccess: () => {
                    toast.success('Xóa tác giả thành công.');
                    revalidate();
                    setOpenConfirmDialog(false);
                },
                onError: () => {
                    toast.error('Xóa tác giả thất bại.');
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleChangePublic = (row: TAuthor, checked: boolean) => {
        // TODO: update
        mutationEdit.mutate(
            { isPublic: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    revalidate();
                    toast.success('Cập nhật trạng thái thành công.');
                },
            }
        );
        return;
    };

    const columns: TColumn<TAuthor>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên tác giả",
                align: "left",
            },
            {
                id: "description",
                disablePadding: "none",
                label: "Mô tả",
                align: "left",
            },

            {
                id: "isPublic",
                disablePadding: "none",
                label: "Chia sẽ liên thông",
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
                                onClick={() => handleEditAuthor(row)}
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
        [handleEditAuthor, handleOpenConfirmDialog]
    );

    const initialValues = useMemo((): TAuthorCreate => {
        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                description: selectedEdit.description,
                isPublic: selectedEdit.isPublic,
            };
        }

        return {
            name: "",
            description: "",
            isPublic: false,
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
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb: 2 }}>
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
                    </CsFlexRowBetween>
                </Stack>

                <ActionsForm />

                <TableList
                    columns={columns}
                    rows={data?.data?.result || []}
                    isLoading={isLoading}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />

                <ConfirmDeleteDialog
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa"
                    description={`Bạn có chắc chắn muốn xóa "${authorToDelete?.name}" ?`}
                />
            </MainCard>
        </div>
    );
};
export default AuthorPage;