import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IconPencil } from "@tabler/icons";
import { IconTransferIn } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import {
    useUpdateShelvesQuantity,
    useUpdateStockQuantity
} from "../../../hooks/services/publications/publications-mutation";
import {
    useFetchPublications,
    useReFetchPublications,
} from "../../../hooks/services/publications/publications-query";
import { useFetchShelf } from "../../../hooks/services/shelf/shelf-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TPositionLiquidation } from "../../../types/models/liquidation.type";
import { TPublications, TPublicationsCreate } from "../../../types/models/publications.type";
import { TShelves } from "../../../types/models/shelves";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import { parserParams } from "../../../utils/object";
import FormEditWarehouse from "./ui-components/FormEditWarehouse";

const StockProductPage = () => {
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
                { compare: "", target: { type: "ấn phẩm cứng" } },
                { compare: "", target: { status: "có sẵn" } },
            ]),
        [barcodeSearch, search, type, status]
    );

    const { data, isLoading, isFetching } = useFetchPublications({
        limit,
        page,
        ...filter,
    });
    const { data: shelfData } = useFetchShelf();
    const revalidate = useReFetchPublications();
    const { hasPermission } = usePermission();
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TPublications | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const mutationUpdateShelvesQty = useUpdateShelvesQuantity();
    const mutationUpdateStockQty = useUpdateStockQuantity();
    // const mutationCreateLiquidation = useAddLiquidation();

    const handleEditWarehouse = (row: TPublications) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TPublicationsCreate & { operation: string, statusWarehouse: string, position?: TPositionLiquidation, reason?: string }) => {
        if (!selectedEdit) return;

        const payload = { ...values, id: selectedEdit?._id, };
        console.log(payload);

        if (values.statusWarehouse === "trên kệ") {

            if (values.operation === "add") {
                mutationUpdateShelvesQty.mutate(
                    {
                        id: payload.id,
                        quantity: payload.shelvesQuantity,
                        shelvesId: payload.shelvesId as string,
                    },
                    {
                        onSuccess: () => {
                            revalidate();
                            toast.success("Chuyển sách lên kệ thành công.");
                            handleClose();
                        },
                    }
                );
            } else {
                mutationUpdateStockQty.mutate(
                    {
                        quantity: payload.shelvesQuantity,
                        id: payload.id,
                    },
                    {
                        onSuccess: () => {
                            revalidate();
                            toast.success("Giảm số lượng trên kệ vào kho");
                            handleClose();
                        },
                    }
                );
            }
        }
        // else if (values.statusWarehouse === "thanh lý") {
        //     mutationCreateLiquidation.mutate(
        //         {
        //             position: payload.position as TPositionLiquidation,
        //             publicationId: payload.id,
        //             quantity: payload.quantityLiquidation,
        //             status: "thanh lý",
        //             reason: payload.reason
        //         },
        //         {
        //             onSuccess: () => {
        //                 revalidate();
        //                 toast.success("Chuyển số lượng sách thanh lý thành công");
        //                 handleClose();
        //             },
        //         }
        //     );
        // } else if (values.statusWarehouse === "hư hỏng") {
        //     mutationCreateLiquidation.mutate(
        //         {
        //             position: payload.position as TPositionLiquidation,
        //             publicationId: payload.id,
        //             quantity: payload.quantityLiquidation,
        //             status: "hư hỏng",
        //             reason: payload.reason
        //         },
        //         {
        //             onSuccess: () => {
        //                 revalidate();
        //                 toast.success("Chuyển số lượng sách hư hỏng thành công");
        //                 handleClose();
        //             },
        //         }
        //     );
        // }
        return;
    };

    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
    };

    const columns: TColumn<TPublications>[] = useMemo(
        () => [
            {
                id: "barcode",
                disablePadding: "none",
                label: "Mã ấn phẩm",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "name",
                disablePadding: "none",
                label: "Tên ấn phẩm",
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
                id: "quantity",
                disablePadding: "none",
                label: "SL tồn kho",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "shelvesQuantity",
                disablePadding: "none",
                label: "SL trên kệ",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "quantityLoan",
                disablePadding: "none",
                label: "SL mượn",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "quantityLiquidation",
                disablePadding: "none",
                label: "SL thanh lý",
                align: "center",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Typography>{row.quantityLiquidation ?? 0}</Typography>
                    )
                },
            },
            {
                id: "totalQuantity",
                disablePadding: "none",
                label: "SL tổng",
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
                            {
                                hasPermission([
                                    { resource: "publications", action: "manage" },
                                ]) &&
                                <IconPencil
                                    onClick={() => handleEditWarehouse(row)}
                                    size={20}
                                    stroke={1.5}
                                />
                            }

                        </Box>
                    );
                },
            },
        ],
        [handleEditWarehouse]
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

    const actionMenus = useMemo((): TMenuOption[] => {
        return [];
    }, []);

    const initialValues = useMemo((): TPublicationsCreate => {
        if (selectedEdit) {
            return {
                name: selectedEdit.name,
                quantity: selectedEdit.quantity,
                shelvesId: ((selectedEdit.shelvesId as TShelves)?._id) || null,
                shelvesQuantity: selectedEdit.shelvesQuantity,
                quantityLiquidation: selectedEdit.quantityLiquidation,
                quantityDamaged: selectedEdit.quantityDamaged,
                totalQuantity: selectedEdit.totalQuantity,
                quantityLoan: selectedEdit.quantityLoan,
            };
        }

        return {
            name: "",
            quantity: 0,
            shelvesQuantity: 0,
            quantityLiquidation: 0,
            quantityDamaged: 0,
            quantityLoan: 0,
            totalQuantity: 0,
            shelvesId: null,
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý kho ấn phẩm"
                mainProfile="Danh sách kho ấn phẩm"
                link="/quan-ly-kho/kho-an-pham"
            />

            {openAddEdit && (
                <FormEditWarehouse
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    shelfOptions={shelfData?.data?.result || []}
                />
            )}

            <MainCard>
                <Stack
                    spacing={2}
                >
                    <CsFlexRowBetween>
                        <Box sx={{ ml: { xs: 0, sm: 0, md: 3 }, mb: { xs: 0, sm: 0, md: 2 } }}>
                            <Link to="/quan-ly-nhap-kho/phieu-nhap-an-pham" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    sx={{
                                        background: "#a36e21", color: "white",
                                        //@ts-ignore
                                        marginLeft: { xs: 0, sm: 0, md: "10px" },
                                        //@ts-ignore
                                        marginTop: { xs: 1, sm: 1, md: 0 }
                                    }}
                                    size="small"
                                    startIcon={<IconTransferIn stroke={2} />}
                                    variant="contained"
                                >
                                    Quản lý nhập ấn phẩm
                                </StyledButton>
                            </Link>
                        </Box>

                    </CsFlexRowBetween>

                </Stack>

                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
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
            </MainCard>
        </div>
    );
};
export default StockProductPage;
