import { Switch } from "@mui/material";
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
import { useAddLoanSlip, useDeleteSoftLoanSlip, useDeleteSoftManyLoanSlip, useEditLoanSlip } from "../../../hooks/services/loanSlip/loanSlip-mutation";
import { useFetchLoanSlip, useReFetchLoanSlip } from "../../../hooks/services/loanSlip/loanSlip-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TLoanSlip, TLoanSlipCreate } from "../../../types/models/loanSlip.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditLoanSlip from "./ui-components/FormAddEditLoanSlip";


const LoanSlipPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const { data, isLoading } = useFetchLoanSlip({ limit, page, search });
    const mutationAdd = useAddLoanSlip();
    const mutationEdit = useEditLoanSlip();
    const mutationSoftDelete = useDeleteSoftLoanSlip();
    const mutationSoftDeleteMany = useDeleteSoftManyLoanSlip();
    const revalidate = useReFetchLoanSlip();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLoanSlip | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loanSlipToDelete, setLoanSlipToDelete] = useState<TLoanSlip | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const addLoanSlip = () => {
        setOpenAddEdit(true);
    };

    const handleEditLoanSlip = (row: TLoanSlip) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TLoanSlipCreate) => {
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

    const handleOpenConfirmDialog = (row: TLoanSlip) => {
        setLoanSlipToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (loanSlipToDelete) {
            mutationSoftDelete.mutate(loanSlipToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa phiếu mượn thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };


    const columns: TColumn<TLoanSlip>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên phiếu mượn",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "description",
                disablePadding: "none",
                label: "Mô tả",
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
                            <IconPencil
                                onClick={() => handleEditLoanSlip(row)}
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
        [handleEditLoanSlip, handleOpenConfirmDialog]
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
        return [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TLoanSlipCreate => {
        if (selectedEdit) {
            return {
                note: selectedEdit.note,
                borrowedDay: selectedEdit.borrowedDay,
                returnDay: selectedEdit.returnDay,
                userId: ''
            };
        }

        return {
            note: "",
            borrowedDay: "",
            returnDay: "",
            userId: ''
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý phiếu mượn"
                mainProfile="Danh sách phiếu mượn"
                link="/quan-ly-muon-tra/phieu-muon"
            />

            {openAddEdit && (
                <FormAddEditLoanSlip
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                />
            )}

            <MainCard>
                <Stack spacing={2} sx={{ paddingLeft: { xs: 4, sm: 4 }, paddingBottom: { xs: 2, sm: 2 }, width: '100%' }}>
                    <Box display="flex" flexWrap="wrap">
                        <Box>
                            <StyledButton
                                color="primary"
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={addLoanSlip}
                            >
                                Thêm mới
                            </StyledButton>
                        </Box>

                        <Box>
                            <Link to="/quan-ly-muon-tra/phieu-muon/danh-sach-xoa-phieu-muon" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    sx={{ background: "#de524a", color: "white", marginLeft: "10px" }}
                                    size="small"
                                    startIcon={<IconTrash stroke={2} />}
                                    variant="contained"
                                >
                                    Thùng rác
                                </StyledButton>
                            </Link>
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
export default LoanSlipPage;