import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAddLibrary, useDeleteLibrary, useEditLibrary } from "../../../hooks/services/library/library-mutation";
import { useFetchLibrary, useReFetchLibrary } from "../../../hooks/services/library/library-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn } from "../../../types/common/table";
import { TLibrary, TLibraryCreate } from "../../../types/models/library.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditLibrary from "./ui-components/FormAddEditLibrary";


const LibraryPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchLibrary({ limit, page, search });
    const mutationAdd = useAddLibrary();
    const mutationEdit = useEditLibrary();
    const mutationDelete = useDeleteLibrary();
    const revalidate = useReFetchLibrary();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLibrary | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [libraryToDelete, setLibraryToDelete] = useState<TLibrary | null>(null);
    console.log(libraryToDelete);
    

    const addLibrary = () => {
        setOpenAddEdit(true);
    };

    const handleEditLibrary = (row: TLibrary) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TLibraryCreate) => {
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

    const handleOpenConfirmDialog = (row: TLibrary) => {
        setLibraryToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (libraryToDelete) {
            mutationDelete.mutate(libraryToDelete._id, {
                onSuccess: () => {
                    toast.success('Xóa thư viện thành công.');
                    revalidate();
                    setOpenConfirmDialog(false);
                },
                onError: () => {
                    toast.error('Xóa thư viện thất bại.');
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const columns: TColumn<TLibrary>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên thư viện",
                align: "left",
                // sxRow: { paddingRight: 4 },
            },
            {
                id: "address",
                disablePadding: "none",
                label: "Địa chỉ",
                align: "left",
                // sxRow: { paddingRight: 4 },
            },
            {
                id: "phoneNumber",
                disablePadding: "none",
                label: "Số điện thoại",
                align: "left",
                // sxRow: { paddingRight: 4 },
            },
            {
                id: "email",
                disablePadding: "none",
                label: "Email",
                align: "left",
                // sxRow: { paddingRight: 4 },
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
                                onClick={() => handleEditLibrary(row)}
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
        [handleEditLibrary, handleOpenConfirmDialog]
    );

    const initialValues = useMemo((): TLibraryCreate => {
        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                address: selectedEdit.address,
                managementAgency: selectedEdit.managementAgency,
                phoneNumber: selectedEdit.phoneNumber,
                email: selectedEdit.email,
                facebook: selectedEdit.facebook
            };
        }

        return {
            name: "",
            address: "",
            managementAgency: "",
            phoneNumber: "",
            email: "",
            facebook: ""
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý thư viện"
                mainProfile="Danh sách thư viện"
                link="/he-thong/quan-ly-thu-vien"
            />

            {openAddEdit && (
                <FormAddEditLibrary
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
                                onClick={addLibrary}
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
                    title="Xác nhận xóa thư viện"
                    description={`Bạn có chắc chắn muốn xóa "${libraryToDelete?.name}" ? Hành động này không thể hoàn tác.`}
                />
            </MainCard>
        </div>
    );
};
export default LibraryPage;