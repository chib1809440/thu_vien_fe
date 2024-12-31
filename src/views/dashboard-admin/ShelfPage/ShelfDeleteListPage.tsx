import { Box, Stack } from "@mui/system";
import { IconArrowBack, IconArrowBackUp, IconTrash } from "@tabler/icons";
import { IconRestore, IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useDeleteManyShelf, useDeleteShelf, useRestoreManyShelf } from "../../../hooks/services/shelf/shelf-mutation";
import { useFetchShelfDeleteList, useReFetchShelfDeleteList } from "../../../hooks/services/shelf/shelf-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TShelves } from "../../../types/models/shelves";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { Typography } from "@mui/material";


const ShelfDeleteListPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading, isFetching } = useFetchShelfDeleteList({ limit, page, search });

    const mutationDelete = useDeleteShelf();
    const mutationDeleteMany = useDeleteManyShelf();
    const mutationRestoreMany = useRestoreManyShelf();

    const revalidate = useReFetchShelfDeleteList();

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [shelfToDelete, setShelfToDelete] = useState<TShelves | null>(null);
    const [openConfirmRestoreDialog, setOpenConfirmRestoreDialog] = useState(false);
    const [shelfToRestore, setShelfToRestore] = useState<TShelves | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);
    const [openConfirmRestoreMultiple, setOpenConfirmRestoreMultiple] = useState(false);

    const handleOpenConfirmDialog = (row: TShelves) => {
        setShelfToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (shelfToDelete) {
            mutationDelete.mutate(shelfToDelete._id, {
                onSuccess: () => {
                    revalidate({ limit, page, search });
                    toast.success('Xóa tủ kệ thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    // Khôi phục 1
    const handleOpenConfirmRestoreDialog = (row: TShelves) => {
        setShelfToRestore(row);
        setOpenConfirmRestoreDialog(true);
    };

    const handleConfirmRestore = () => {
        if (shelfToRestore) {
            mutationRestoreMany.mutate([shelfToRestore._id], {
                onSuccess: () => {
                    revalidate({ limit, page, search });
                    toast.success('Khôi phục thành công.');
                    setOpenConfirmRestoreDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmRestoreDialog = () => {
        setOpenConfirmRestoreDialog(false);
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
                id: "description",
                disablePadding: "none",
                label: "Mô tả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "note",
                disablePadding: "none",
                label: "Ghi chú",
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
                            <IconTrash
                                size={20}
                                stroke={1.5}
                                onClick={() => handleOpenConfirmDialog(row)}
                            />
                            <IconRestore
                                size={20}
                                stroke={1.5}
                                onClick={() => handleOpenConfirmRestoreDialog(row)}
                            />

                        </Box>
                    );
                },
            },
        ],
        [handleOpenConfirmDialog, handleOpenConfirmRestoreDialog]
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

    // Hàm xóa nhiều vĩnh viễn
    const handleConfirmDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate({ limit, page, search });
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete, limit, page, search]);

    // Hàm mở dialog khôi phục
    const handleRestoreMultiple = useCallback(() => {
        if (checkedDelete.length === 0) {
            toast.error("Vui lòng chọn dữ liệu để khôi phục");
            return;
        }

        setOpenConfirmRestoreMultiple(true);
    }, [checkedDelete]);

    // Hàm xác nhận khôi phục nhiều
    const handleConfirmRestoreMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;

        mutationRestoreMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate({ limit, page, search });
                toast.success("Khôi phục các mục đã chọn thành công.");
                setOpenConfirmRestoreMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete, mutationRestoreMany, revalidate, limit, page, search]);

    const actionMenus = useMemo((): TMenuOption[] => {
        return [
            {
                label: "Xóa vĩnh viễn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
            {
                label: "Khôi phục dữ liệu",
                icon: <IconArrowBackUp size={20} stroke={1.5} />,
                onClick: handleRestoreMultiple,
            },
        ];
    }, [handleDeleteMultiple, handleRestoreMultiple]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý tủ kệ"
                mainProfile="Danh sách đã xóa"
                link="/tai-san-thu-vien/tu-ke"
            />

            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: { xs: 0, sm: 0, md: 4 }, mb: 2 }}>
                            <Link to="/tai-san-thu-vien/tu-ke" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconArrowBack stroke={2} />}
                                    variant="contained"
                                >
                                    Trở về
                                </StyledButton>
                            </Link>
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

                {openConfirmDialog &&
                    <ConfirmDeleteDialog
                        key={"delete"}
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        onConfirm={handleConfirmDelete}
                        title="Xác nhận xóa?"
                        description={`Bạn có chắc chắn muốn xóa "${shelfToDelete?.name}" ?`}
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

                {openConfirmRestoreDialog &&
                    <ConfirmDeleteDialog
                        key={"restore"}
                        open={openConfirmRestoreDialog}
                        onClose={handleCloseConfirmRestoreDialog}
                        onConfirm={handleConfirmRestore}
                        title="Xác nhận khôi phục?"
                        description={`Bạn có chắc chắn muốn khôi phục tủ kệ "${shelfToRestore?.name}"?`}
                    />
                }

                {openConfirmRestoreMultiple &&
                    <ConfirmDeleteDialog
                        key={"restoreMultiple"}
                        open={openConfirmRestoreMultiple}
                        onClose={() => setOpenConfirmRestoreMultiple(false)}
                        onConfirm={handleConfirmRestoreMultiple}
                        title="Xác nhận khôi phục các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn khôi phục các mục đã chọn?`}
                    />
                }

            </MainCard>
        </div>
    );
};
export default ShelfDeleteListPage;