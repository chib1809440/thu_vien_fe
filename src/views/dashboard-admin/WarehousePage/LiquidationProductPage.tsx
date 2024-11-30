import { Box } from "@mui/system";
import { IconPencil } from "@tabler/icons";
import { IconFileExcel } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import { useEditLiquidation } from "../../../hooks/services/liquidation/liquidation-mutation";
import {
    useFetchLiquidation,
    useReFetchLiquidation,
} from "../../../hooks/services/liquidation/liquidation-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TLiquidation, TLiquidationCreate, TPositionLiquidation } from "../../../types/models/liquidation.type";
import { TPublications } from "../../../types/models/publications.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { parserParams } from "../../../utils/object";
import FormEditLiquidation from "./ui-components/FormEditLiquidation";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import usePermission from "../../../utils/hasPermission";
import { Typography } from "@mui/material";

const LiquidationProductPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const type = "";
    const status = "";

    const [barcodeSearch, setBarcodeSearch] = useState("");

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
                { compare: "", target: { barcode: barcodeSearch } },
            ]),
        [barcodeSearch, search, type, status]
    );

    const { data, isLoading, isFetching } = useFetchLiquidation({
        limit,
        page,
        ...filter
    });

    const mutationUpdateLiquidation = useEditLiquidation();
    const revalidate = useReFetchLiquidation();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLiquidation | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);

    const handleEditLiquidation = (row: TLiquidation) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TLiquidationCreate & { liquidationQuantity?: number }) => {

        if (selectedEdit) {

            mutationUpdateLiquidation.mutate(
                {
                    position: values.position as TPositionLiquidation,
                    publicationId: (values.publicationId as TPublications)?._id,
                    quantity: values.liquidationQuantity,
                    status: "thanh lý",
                    reason: values.reason,
                    _id: selectedEdit._id
                },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success("Chuyển số lượng sách thanh lý thành công");
                        handleClose();
                    },
                }
            );
            return;
        }
    };

    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
    };

    const columns: TColumn<TLiquidation>[] = useMemo(
        () => [
            {
                id: "barcode",
                disablePadding: "none",
                label: "Mã(ISBN)",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => (row.publicationId as TPublications)?.barcode,
            },
            {
                id: "name",
                disablePadding: "none",
                label: "Thông tin ấn phẩm",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box>
                            <Box sx={{ pt: 1 }}>
                                <Typography>Tên: <strong>{capitalizeFirstLetter((row.publicationId as TPublications)?.name)}</strong></Typography>
                            </Box>
                            <Box sx={{ pt: 1 }}>
                                <Typography>Vị trí: <strong>{row?.position}</strong></Typography>
                            </Box>
                            <Box sx={{ pt: 1 }}>
                                <Typography>Lý do thanh lý: <strong>{row?.reason}</strong></Typography>
                            </Box>
                        </Box>
                    )
                },
            },
            {
                id: "quantity",
                disablePadding: "none",
                label: "SL sách hư hỏng",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 120 },
                render: (row) => {
                    return row.status === 'thanh lý' ? 0 : row.quantity || 0;
                },
            },
            {
                id: "quantity",
                disablePadding: "none",
                label: "SL sách thanh lý",
                align: "left",
                render: (row) => {
                    return row.status === 'hư hỏng' ? 0 : row.quantity || 0;
                },
            },
            {
                id: "quantity",
                disablePadding: "none",
                label: "SL tổng",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 120 },
            },
            {
                id: "action",
                disablePadding: "none",
                align: "center",
                label: "Hành động",
                render: (row) => {
                    if (row.status === 'thanh lý') {
                        return null;
                    }

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
                                    { resource: "publications", action: "manage" },
                                    { resource: "publications", action: "create" },
                                    { resource: "publications", action: "update" },
                                    { resource: "publications", action: "delete" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditLiquidation(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }
                        </Box>
                    );
                },
            },
        ],
        [handleEditLiquidation]
    );

    const handleCheckedDelete = useCallback((row: TLiquidation, checked: boolean) => {
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

    const actionMenus = useMemo((): TMenuOption[] => {
        return [];
    }, []);

    const initialValues = useMemo((): TLiquidationCreate => {
        if (selectedEdit) {

            return {
                note: selectedEdit.note,
                quantity: selectedEdit.quantity,
                reason: selectedEdit.reason,
                status: selectedEdit.status,
                position: selectedEdit.position,
                publicationId: (selectedEdit.publicationId as string),
            };
        }

        return {
            note: "",
            quantity: 0,
            status: "hư hỏng",
            reason: "",
            position: "trong kho",
            publicationId: "",
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý kho"
                mainProfile="Danh sách thanh lý - hư hỏng"
                link="/quan-ly-kho/kho"
            />

            {openAddEdit && (
                <FormEditLiquidation
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                />
            )}

            <MainCard>
                {/* <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                /> */}

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
            </MainCard>
        </div>
    );
};
export default LiquidationProductPage;
