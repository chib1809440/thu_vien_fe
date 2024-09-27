import { Switch } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { useMemo, useState } from "react";
import StyledButton from "../../../components/default/button/StyledButton";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAddGroup, useEditGroup } from "../../../hooks/services/group/group-mutation";
import { useFetchGroup, useReFetchGroup } from "../../../hooks/services/group/group-query";
import { TColumn } from "../../../types/common/table";
import { TGroup, TGroupCreate } from "../../../types/models/group.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditGroup from "./ui-components/FormAddEditGroup";
import useQueryString from "../../../hooks/services/useQueryString";
import TableList from "../../../components/custom/table-list/TableList";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";

const GroupPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchGroup({ limit, page, search });
    const mutationAdd = useAddGroup();
    const mutationEdit = useEditGroup();
    const revalidate = useReFetchGroup();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TGroup | null>(null);

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
                    revalidate();
                    toast.success('Cập nhật hiển thị thành công.');
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
                        revalidate();
                        toast.success('Chỉnh sửa thành công.');
                        handleClose();
                    },

                    onError: (error: any) => {
                        toast.error('Chỉnh sửa thất bại');
                        // alert("Lỗi khi chỉnh sửa: " + error?.response?.data?.message);
                    },
                }
            );
        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
                setOpenAddEdit(false);
            },
        });
    };

    const columns: TColumn<TGroup>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên nhóm",
                align: "left",
                // sxRow: { paddingRight: 4 },
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
                            // onClick={(e: any) => handleDeleteItem(e, row._id)}
                            />
                        </Box>
                    );
                },
            },
        ],
        [handleChangePublic, handleEditGroup]
    );

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

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý nhóm"
                mainProfile="Danh sách nhóm"
                link="/quan-ly-nhom"
            />

            {openAddEdit && (
                <FormAddEditGroup
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
                                onClick={addGroup}
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
            </MainCard>
        </div>
    );
};
export default GroupPage;