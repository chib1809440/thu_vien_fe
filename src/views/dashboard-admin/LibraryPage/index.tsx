import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAddLibrary, useDeleteLibrary, useDeleteManyLibrary, useEditLibrary } from "../../../hooks/services/library/library-mutation";
import { useFetchLibrary, useReFetchLibrary } from "../../../hooks/services/library/library-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TLibrary, TLibraryCreate } from "../../../types/models/library.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditLibrary from "./ui-components/FormAddEditLibrary";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { TGroup } from "../../../types/models/group.type";


const LibraryPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading, isFetching } = useFetchLibrary({ limit, page, search });
    const mutationAdd = useAddLibrary();
    const mutationEdit = useEditLibrary();
    const mutationDelete = useDeleteLibrary();
    const mutationDeleteMany = useDeleteManyLibrary();
    const revalidate = useReFetchLibrary();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLibrary | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [libraryToDelete, setLibraryToDelete] = useState<TLibrary | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);


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

    const handleOpenConfirmDialog = (row: TLibrary) => {
        setLibraryToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (libraryToDelete) {
            mutationDelete.mutate(libraryToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa thư viện thành công.');
                    setOpenConfirmDialog(false);
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
                sxRow: { maxWidth: 200 },
                render: (row) => (capitalizeFirstLetter(row?.name)),
            },
            {
                id: "group",
                disablePadding: "none",
                label: "Nhóm",
                align: "left",
                sxRow: { maxWidth: 100 },
                render: (row) => {
                    return (
                        <Box>
                            {row?.groupId !== null ? "Đã có nhóm" : "Chưa có nhóm"}
                        </Box>
                    )
                },
            },
            {
                id: "address",
                disablePadding: "none",
                label: "Địa chỉ",
                align: "left",
                sxRow: {maxWidth: 150 },
            },
           
            {
                id: "phoneNumber",
                disablePadding: "none",
                label: "Số điện thoại",
                align: "left",
            },
            {
                id: "email",
                disablePadding: "none",
                label: "Email",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 150 },
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

    const handleCheckedDelete = useCallback((row: TLibrary, checked: boolean) => {
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
        return [
            {
                label: "Xóa các dữ liệu đã chọn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [handleDeleteMultiple]);

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
                    title="Xác nhận xóa thư viện"
                    description={`Bạn có chắc chắn muốn xóa "${libraryToDelete?.name}" ?`}
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
export default LibraryPage;