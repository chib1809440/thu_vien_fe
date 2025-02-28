import { Chip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { useAuth } from "../../../contexts/JWTContext";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useFetchLibrary } from "../../../hooks/services/library/library-query";
import { useAddTopic, useDeleteManyTopic, useDeleteTopic, useEditTopic } from "../../../hooks/services/topic/topic-mutation";
import { useFetchTopic, useReFetchTopic } from "../../../hooks/services/topic/topic-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TTopic, TTopicCreate } from "../../../types/models/topic";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import { parserParams } from "../../../utils/object";
import FormAddEditTopic from "./ui-components/FormAddEditTopic";
import { useFetchCategory } from "../../../hooks/services/category/category-query";


const TopicPage = () => {
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

    const { data, isLoading, isFetching } = useFetchTopic({
        limit,
        page,
        ...filter,
    });

    const { data: libraryData } = useFetchLibrary();
    const mutationAdd = useAddTopic();
    const mutationEdit = useEditTopic();
    const mutationDelete = useDeleteTopic();
    const mutationDeleteMany = useDeleteManyTopic();
    const revalidate = useReFetchTopic();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TTopic | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<TTopic | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);

    const { user } = useAuth();
    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);

    const addTopic = () => {
        setOpenAddEdit(true);
    };

    const handleEditTopic = (row: TTopic) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TTopicCreate) => {
        const categoryIds = values?.categoryIds.map(category => category._id);

        const payload = {
            ...values,
            categoryIds
        }

        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id, categoryIds },
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

        mutationAdd.mutate(payload, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TTopic) => {
        setTopicToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (topicToDelete) {
            mutationDelete.mutate(topicToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa chủ đề thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    // loc
    const handleLibraryFilterChange = (event) => {
        setSelectedLibrary(event.target.value);
    };

    const columns: TColumn<TTopic>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên chủ đề",
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
                id: "categoryIds",
                disablePadding: "none",
                label: "Thuộc lĩnh vực",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                            component="span"
                            sx={{
                                display: "block",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxWidth: "100%",
                                overflow: "hidden",
                            }}
                        >
                            {
                                row?.categoryIds && row?.categoryIds?.length > 0
                                    ? (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {row?.categoryIds.slice(0, 2).map((cate) => (
                                                <Chip
                                                    key={cate?._id}
                                                    label={capitalizeFirstLetter(cate?.name)}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                            {row?.categoryIds?.length > 2 && (
                                                <Chip
                                                    label={`+${row?.categoryIds?.length - 2} lĩnh vực khác`}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            )}
                                        </Box>
                                    )
                                    : "Chưa thuộc lĩnh vực nào"
                            }
                        </Box>
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
                                    { resource: "topics", action: "manage" },
                                    { resource: "topics", action: "update" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditTopic(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }
                            {
                                hasPermission([
                                    { resource: "topics", action: "manage" },
                                    { resource: "topics", action: "delete" },
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
        [handleEditTopic, handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TTopic, checked: boolean) => {
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
            { resource: "topics", action: "manage" },
            { resource: "topics", action: "create" },
        ]) ? [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TTopicCreate => {
        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                categoryIds: selectedEdit.categoryIds || []
            };
        }

        return {
            name: "",
            categoryIds: [],
        };
    }, [selectedEdit]);

    const { data: categoryData } = useFetchCategory();

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý chủ đề"
                mainProfile="Danh sách chủ đề"
                link="/quan-ly-danh-muc/linh-vuc"
            />

            {openAddEdit && (
                <FormAddEditTopic
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    cateOptions={categoryData?.data?.result || []}
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
                                { resource: "topics", action: "manage" },
                                { resource: "topics", action: "create" },
                            ]) &&
                            <Box>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addTopic}
                                >
                                    Thêm mới
                                </StyledButton>
                            </Box>
                        }
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
                        description={`Bạn có chắc chắn muốn xóa "${topicToDelete?.name}" ?`}
                    />
                }

                {openConfirmDeleteMultiple &&
                    <ConfirmDeleteDialog
                        key={"deleteMultiple"}
                        open={openConfirmDeleteMultiple}
                        onClose={() => setOpenConfirmDeleteMultiple(false)}
                        onConfirm={handleConfirmDeleteMultiple}
                        title="Xác nhận xóa các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn xóa?`}
                    />
                }
            </MainCard>
        </div>
    );
};
export default TopicPage;