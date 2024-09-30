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
import { useAddMaterial, useDeleteMaterial, useEditMaterial } from "../../../hooks/services/material/material-mutation";
import { useFetchMaterial, useReFetchMaterial } from "../../../hooks/services/material/material-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn } from "../../../types/common/table";
import { TMaterial, TMaterialCreate } from "../../../types/models/material";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditMaterial from "./ui-components/FormAddEditMaterial";


const MaterialPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchMaterial({ limit, page, search });
    const mutationAdd = useAddMaterial();
    const mutationEdit = useEditMaterial();
    const mutationDelete = useDeleteMaterial();
    const revalidate = useReFetchMaterial();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TMaterial | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState<TMaterial | null>(null);
    

    const addMaterial = () => {
        setOpenAddEdit(true);
    };

    const handleEditMaterial = (row: TMaterial) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TMaterialCreate) => {
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

    const handleOpenConfirmDialog = (row: TMaterial) => {
        setMaterialToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (materialToDelete) {
            mutationDelete.mutate(materialToDelete._id, {
                onSuccess: () => {
                    toast.success('Xóa dạng học liệu thành công.');
                    revalidate();
                    setOpenConfirmDialog(false);
                },
                onError: () => {
                    toast.error('Xóa dạng học liệu thất bại.');
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleChangePublic = (row: TMaterial, checked: boolean) => {
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

    const columns: TColumn<TMaterial>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên dạng học liệu",
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
                                onClick={() => handleEditMaterial(row)}
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
        [handleEditMaterial, handleOpenConfirmDialog]
    );

    const initialValues = useMemo((): TMaterialCreate => {
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
                profile="Quản lý dạng học liệu"
                mainProfile="Danh sách dạng học liệu"
                link="/quan-ly-danh-muc/dang-hoc-lieu"
            />

            {openAddEdit && (
                <FormAddEditMaterial
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
                                onClick={addMaterial}
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
                    description={`Bạn có chắc chắn muốn xóa "${materialToDelete?.name}" ?`}
                />
            </MainCard>
        </div>
    );
};
export default MaterialPage;