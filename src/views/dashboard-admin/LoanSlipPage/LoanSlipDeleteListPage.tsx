import { Button, Chip, Switch, useTheme } from "@mui/material";
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
import { useApprovalLoanSlip, useDeleteLoanSlip, useDeleteManyLoanSlip, useRestoreManyLoanSlip } from "../../../hooks/services/loanSlip/loanSlip-mutation";
import { useFetchLoanSlipDeleteList, useReFetchLoanSlipDeleteList } from "../../../hooks/services/loanSlip/loanSlip-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TLoanSlip } from "../../../types/models/loanSlip.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { formatDate } from "../../../helpers/formatDate";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";


const LoanSlipDeleteListPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchLoanSlipDeleteList({ limit, page, search });

    const mutationDelete = useDeleteLoanSlip();
    const mutationDeleteMany = useDeleteManyLoanSlip();
    const mutationRestoreMany = useRestoreManyLoanSlip();
    const theme = useTheme();

    const revalidate = useReFetchLoanSlipDeleteList();

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loanSlipToDelete, setLoanSlipToDelete] = useState<TLoanSlip | null>(null);
    const [openConfirmRestoreDialog, setOpenConfirmRestoreDialog] = useState(false);
    const [loanSlipToRestore, setLoanSlipToRestore] = useState<TLoanSlip | null>(null);
    const mutationApproval = useApprovalLoanSlip();

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);
    const [openConfirmRestoreMultiple, setOpenConfirmRestoreMultiple] = useState(false);

    const handleOpenConfirmDialog = (row: TLoanSlip) => {
        setLoanSlipToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (loanSlipToDelete) {
            mutationDelete.mutate(loanSlipToDelete._id, {
                onSuccess: () => {
                    revalidate({ limit, page, search });
                    toast.success('Xóa phiếu mượn thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    // Khôi phục 1
    const handleOpenConfirmRestoreDialog = (row: TLoanSlip) => {
        setLoanSlipToRestore(row);
        setOpenConfirmRestoreDialog(true);
    };

    const handleConfirmRestore = () => {
        if (loanSlipToRestore) {
            mutationRestoreMany.mutate([loanSlipToRestore._id], {
                onSuccess: () => {
                    revalidate({ limit, page, search });
                    toast.success('Khôi phục thành công.');
                    setOpenConfirmRestoreDialog(false);
                },
            });
        }
    };
    const getStatusStyles = (status) => {
        switch (status) {
            case "đang mượn":
                return { color: 'white', background: '#FF9800' }; // Màu cho "Đang mượn"
            case "quá hạn":
                return { color: 'white', background: '#F44336' }; // Màu cho "Quá hạn"
            case "đã trả":
                return { color: 'white', background: '#4CAF50' }; // Màu cho "Đã trả"
            default:
                return { color: 'black', background: '#E0E0E0' }; // Màu mặc định nếu không có trạng thái phù hợp
        }
    };
    const handleCloseConfirmRestoreDialog = () => {
        setOpenConfirmRestoreDialog(false);
    };
    const handleApprovalLoanSlip = (row: TLoanSlip) => {
        mutationApproval.mutate(row._id, {
            onSuccess: () => {
                revalidate();
                toast.success('Duyệt phiếu mượn thành công.');
            },
        });
    };
    const columns: TColumn<TLoanSlip>[] = useMemo(
        () => [
            {
                id: "barcode",
                disablePadding: "none",
                label: "Barcode",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "borrowedDay",
                disablePadding: "none",
                label: "Ngày mượn",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {formatDate(row.borrowedDay)}
                        </Box>
                    );
                },
            },
            {
                id: "returnDay",
                disablePadding: "none",
                label: "Ngày trả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {formatDate(row.returnDay)}
                        </Box>
                    );
                },
            },
            {
                id: "isReturn",
                disablePadding: "none",
                label: "Tình trạng trả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {/* {
                                row.isReturn === true && <Chip
                                    style={{ color: 'white', background: '#096A5E' }}
                                    label="Đã trả"
                                    variant="filled"
                                />
                            }
                            {row.isReturn === false && (
                                <>
                                    {new Date(row.returnDay).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? (
                                        <Chip
                                            style={getStatusStyles(row.isAgree)}// Màu cho "Đang mượn"
                                            label={row.isAgree === true ? 'Đang mượn' : 'Đang xử lý'}
                                            variant="filled"
                                        />
                                    ) : (
                                        <Chip
                                            style={{ color: 'white', background: theme.palette.error.dark }} // Màu cho "Quá hạn"
                                            label="Quá hạn"
                                            variant="filled"
                                        />
                                    )}
                                </>
                            )} */}
                            <Chip
                                style={getStatusStyles(row.status)} // Màu cho "Quá hạn"
                                label={capitalizeFirstLetter(row.status)}
                                variant="filled"
                            />
                        </Box>
                    );
                },
            },
            {
                id: "isAgree",
                disablePadding: "none",
                label: "Duyệt",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {
                                row.isAgree === true ? <>
                                    <Chip
                                        style={{ color: 'white', background: '#096A5E' }}
                                        label="Đã duyệt"
                                        variant="filled"
                                    />
                                </> : <>
                                    <Button variant="contained" sx={{ color: theme.palette.common.white, background: theme.palette.error.dark }} onClick={() => handleApprovalLoanSlip(row)}>Chưa duyệt</Button>
                                </>
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

    const handleCheckedDelete = useCallback((row: TLoanSlip, checked: boolean) => {
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

    // Hàm xác nhận khôi phục nhiều phiếu mượn
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
                profile="Quản lý phiếu mượn"
                mainProfile="Danh sách đã xóa"
                link="/quan-ly-danh-muc/tac-gia"
            />

            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb: 2 }}>
                            <Link to="/quan-ly-muon-tra/phieu-muon" style={{ textDecoration: 'none' }}>
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
                    isLoading={isLoading}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${loanSlipToDelete?._id}" ?`}
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
                    description={`Bạn có chắc chắn muốn khôi phục phiếu mượn "${loanSlipToRestore?._id}"?`}
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
export default LoanSlipDeleteListPage;