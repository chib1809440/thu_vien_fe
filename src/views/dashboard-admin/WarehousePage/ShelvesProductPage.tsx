import { Box } from "@mui/system";
import { IconPencil } from "@tabler/icons";
import { IconFileExcel } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import {
    useEditPublications
} from "../../../hooks/services/publications/publications-mutation";
import {
    useFetchPublications,
    useReFetchPublications,
} from "../../../hooks/services/publications/publications-query";
import { useFetchShelf } from "../../../hooks/services/shelf/shelf-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TPublications, TPublicationsCreate } from "../../../types/models/publications.type";
import { TShelves } from "../../../types/models/shelves";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { parserParams } from "../../../utils/object";
import FormEditShelves from "./ui-components/FormEditShelves";

const ShelvesProductPage = () => {
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

    const { data, isLoading } = useFetchPublications({
        limit,
        page,
        ...filter,
    });
    const { data: shelfData } = useFetchShelf();
    const revalidate = useReFetchPublications();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TPublications | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const mutationEdit = useEditPublications();

    const handleEditWarehouse = (row: TPublications) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TPublicationsCreate) => {
        if (!selectedEdit) return;
        
        mutationEdit.mutate(
            { ...values, _id: selectedEdit._id },
            {
                onSuccess: () => {
                    revalidate();
                    toast.success("Chuyển tủ kệ thành công.");
                    handleClose();
                },
            }
        );

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
                label: "Mã(ISBN)",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "name",
                disablePadding: "none",
                label: "Tên ấn phẩm",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "shelvesName",
                disablePadding: "none",
                label: "Tên kệ",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => (row.shelvesId as TShelves)?.name,
            },
            {
                id: "shelvesQuantity",
                disablePadding: "none",
                label: "SL còn lại",
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
                                onClick={() => handleEditWarehouse(row)}
                                size={20}
                                stroke={1.5}
                            />
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
                shelvesId: ((selectedEdit.shelvesId as TShelves)?._id),
                shelvesQuantity: selectedEdit.shelvesQuantity,
                quantityLoan: selectedEdit.quantityLoan,
            };
        }

        return {
            name: "",
            quantity: 0,
            shelvesQuantity: 0,
            shelvesId: "",
            quantityLoan: 0,
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý kho"
                mainProfile="Danh sách tủ kệ"
                link="/quan-ly-kho/kho"
            />

            {openAddEdit && (
                <FormEditShelves
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    shelfOptions={shelfData?.data?.result || []}
                    isFetching={mutationEdit?.isPending}
                />
            )}

            <MainCard>
                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                />

                <TableList
                    checked={checkedDelete}
                    columns={columns}
                    rows={data?.data?.result?.filter((t) => t.shelvesId !== null && t.shelvesId !== undefined) || []}
                    onChecked={handleCheckedDelete}
                    onToggleCheckedAll={handleCheckedDeleteAll}
                    checkedAll={checkedAll}
                    isLoading={isLoading}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />
            </MainCard>
        </div>
    );
};
export default ShelvesProductPage;
