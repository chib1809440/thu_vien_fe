import { Chip, Switch } from "@mui/material";
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
import { useDeleteManyPublications, useDeletePublications, useRestoreManyPublications } from "../../../hooks/services/publications/publications-mutation";
import { useFetchPublicationsDeleteList, useReFetchPublicationsDeleteList } from "../../../hooks/services/publications/publications-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TPublications } from "../../../types/models/publications.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { typeOptions } from "../../../utils/constants.utils";


const PublicationsDeleteListPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading, isFetching } = useFetchPublicationsDeleteList({ limit, page, search });

    const mutationDelete = useDeletePublications();
    const mutationDeleteMany = useDeleteManyPublications();
    const mutationRestoreMany = useRestoreManyPublications();

    const revalidate = useReFetchPublicationsDeleteList();

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [publicationsToDelete, setPublicationsToDelete] = useState<TPublications | null>(null);
    const [openConfirmRestoreDialog, setOpenConfirmRestoreDialog] = useState(false);
    const [publicationsToRestore, setPublicationsToRestore] = useState<TPublications | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);
    const [openConfirmRestoreMultiple, setOpenConfirmRestoreMultiple] = useState(false);

    const handleOpenConfirmDialog = (row: TPublications) => {
        setPublicationsToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (publicationsToDelete) {
            mutationDelete.mutate(publicationsToDelete._id, {
                onSuccess: () => {
                    revalidate({ limit, page, search });
                    toast.success('Xóa ấn phẩm thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    // Khôi phục 1
    const handleOpenConfirmRestoreDialog = (row: TPublications) => {
        setPublicationsToRestore(row);
        setOpenConfirmRestoreDialog(true);
    };

    const handleConfirmRestore = () => {
        if (publicationsToRestore) {
            mutationRestoreMany.mutate([publicationsToRestore._id], {
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

    const columns: TColumn<TPublications>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên ấn phẩm",
                align: "left",
                sxRow: { px: 3, maxWidth: 150 },
            },
            {
                id: "barcode",
                disablePadding: "none",
                label: "Mã (ISBN)",
                align: "left",
                sxRow: { px: 3, maxWidth: 200 },
            },
            {
                id: "type",
                disablePadding: "none",
                label: "Loại",
                align: "left",
                sxRow: { px: 3, maxWidth: 150 },
                render: (row) => {
                    const selectedType = typeOptions.find(option => option.value === row.type);

                    const chipColor = selectedType?.value === 'ấn phẩm cứng' ? '#007e43' : '#fa7d70';

                    return (
                        selectedType ? (
                            <Chip
                                label={selectedType.label}
                                style={{ backgroundColor: chipColor, color: '#fff' }}
                                variant="filled"
                            />
                        ) : null
                    );
                },
            },

            {
                id: "isPublic",
                disablePadding: "none",
                label: "Chia sẻ lên thư viện",
                align: "center",
                sxRow: {
                    px: 4,
                    maxWidth: 100,
                },
                render: (row) => {
                    return (
                        <Switch
                            checked={row?.isPublic}
                            value={row?.isPublic}
                            disabled
                        />
                    );
                },
            },
            {
                id: "isLink",
                disablePadding: "none",
                label: "Liên thông",
                align: "center",
                sxRow: {
                    px: 3,
                    maxWidth: 100,
                },
                render: (row) => {
                    return (
                        <Switch
                            checked={row?.isLink}
                            value={row?.isLink}
                            disabled
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
        [handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TPublications, checked: boolean) => {
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

    // Hàm xác nhận khôi phục nhiều ấn phẩm
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
                profile="Quản lý ấn phẩm"
                mainProfile="Danh sách đã xóa"
                link="/thu-vien/an-pham"
            />

            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb: 2 }}>
                            <Link to="/thu-vien/an-pham" style={{ textDecoration: 'none' }}>
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

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${publicationsToDelete?.name}" ?`}
                />

                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmDeleteMultiple}
                    onClose={() => setOpenConfirmDeleteMultiple(false)}
                    onConfirm={handleConfirmDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />

                <ConfirmDeleteDialog
                    key={"restore"}
                    open={openConfirmRestoreDialog}
                    onClose={handleCloseConfirmRestoreDialog}
                    onConfirm={handleConfirmRestore}
                    title="Xác nhận khôi phục?"
                    description={`Bạn có chắc chắn muốn khôi phục ấn phẩm "${publicationsToRestore?.name}"?`}
                />

                <ConfirmDeleteDialog
                    key={"restoreMultiple"}
                    open={openConfirmRestoreMultiple}
                    onClose={() => setOpenConfirmRestoreMultiple(false)}
                    onConfirm={handleConfirmRestoreMultiple}
                    title="Xác nhận khôi phục các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn khôi phục các mục đã chọn?`}
                />

            </MainCard>
        </div>
    );
};
export default PublicationsDeleteListPage;