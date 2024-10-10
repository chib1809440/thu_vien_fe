import { Chip, Switch } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconEye, IconFileDownload, IconFileUpload, IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { useFetchAuthor } from "../../../hooks/services/author/author-query";
import { useFetchCategory } from "../../../hooks/services/category/category-query";
import { useFetchMaterial } from "../../../hooks/services/material/material-query";
import {
    useAddPublications,
    useDeleteSoftManyPublications,
    useDeleteSoftPublications,
    useEditPublications,
} from "../../../hooks/services/publications/publications-mutation";
import {
    useFetchPublications,
    useReFetchPublications,
} from "../../../hooks/services/publications/publications-query";
import { useFetchPublisher } from "../../../hooks/services/publisher/publisher-query";
import { useFetchShelf } from "../../../hooks/services/shelf/shelf-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TPublications, TPublicationsCreate } from "../../../types/models/publications.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { typeOptions } from "../../../utils/constants.utils";
import { parserParams } from "../../../utils/object";
import FilterByItems from "./ui-components/FilterByItems";
import FormAddEditPublications from "./ui-components/FormAddEditPublications";
import PublicationsDetailsDialog from "./ui-components/PublicationsDetailsDialog";

const PublicationsPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const [selectedMaterial, setSelectedMaterial] = useState(0);
    const [selectedPublications, setSelectedPublications] = useState(0);
    const [selectedAuthor, setSelectedAuthor] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedPublisher, setSelectedPublisher] = useState(0);
    const [barcodeSearch, setBarcodeSearch] = useState("");

    const filter = useMemo(
        () =>
            parserParams([
                { compare: 0, target: { materialIds: selectedMaterial } },
                { compare: 0, target: { authorIds: selectedAuthor } },
                { compare: 0, target: { categoryIds: selectedCategory } },
                { compare: 0, target: { publisherIds: selectedPublisher } },
                { compare: "", target: { search } },
                { compare: 0, target: { type: selectedPublications } },
                { compare: "", target: { barcode: barcodeSearch } },
            ]),
        [
            selectedMaterial,
            selectedAuthor,
            selectedCategory,
            selectedPublisher,
            selectedPublications,
            barcodeSearch,
            search,
        ]
    );

    const { data, isLoading } = useFetchPublications({
        limit,
        page,
        ...filter,
    });

    const { data: categoryData } = useFetchCategory();
    const { data: materialData } = useFetchMaterial();
    const { data: authorData } = useFetchAuthor();
    const { data: publisherData } = useFetchPublisher();
    const { data: shelfData } = useFetchShelf();

    const mutationAdd = useAddPublications();
    const mutationEdit = useEditPublications();
    const mutationSoftDelete = useDeleteSoftPublications();
    const mutationSoftDeleteMany = useDeleteSoftManyPublications();
    const revalidate = useReFetchPublications();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TPublications | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [publicationsToDelete, setPublicationsToDelete] = useState<TPublications | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);
    const [openViewDetails, setOpenViewDetails] = useState(false);
    const [publicationsDetails, setPublicationsDetails] = useState<TPublications | null>(null);

    const addPublications = () => {
        setOpenAddEdit(true);
    };

    const handleEditPublications = (row: TPublications) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleViewDetails = (row: TPublications) => {
        setPublicationsDetails(row);
        setOpenViewDetails(true);
    };

    const handleCloseViewDetails = () => {
        setOpenViewDetails(false);
        setPublicationsDetails(null);
    };

    const handleSubmit = (values: TPublicationsCreate) => {
        const payload = {
            ...values,
            categoryIds: values.categoryIds.map((t: any) => t?._id),
            materialIds: values.materialIds.map((t: any) => t?._id),
            authorIds: values.authorIds.map((t: any) => t?._id),
            publisherIds: values.publisherIds.map((t: any) => t?._id),
        };

        if (selectedEdit) {
            console.log(selectedEdit);

            mutationEdit.mutate(
                { ...payload, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success("Chỉnh sửa thành công.");
                        handleClose();
                    },
                }
            );

            return;
        }

        mutationAdd.mutate(payload, {
            onSuccess: (data) => {
                revalidate();
                toast.success("Thêm thành công.");
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TPublications) => {
        setPublicationsToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (publicationsToDelete) {
            mutationSoftDelete.mutate(publicationsToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success("Xóa ấn phẩm thành công.");
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleChangeShareConnect = (row: TPublications, checked: boolean) => {
        if (!row.isPublic) {
            toast.warn("Không thể thay đổi trạng thái liên thông vì chưa chia sẻ lên thư viện.");
            return;
        }

        // TODO: update
        mutationEdit.mutate(
            { isLink: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    revalidate();
                    toast.success("Cập nhật trạng thái thành công.");
                },
            }
        );
        return;
    };

    const handleChangePublic = (row: TPublications, checked: boolean) => {
        // TODO: update
        mutationEdit.mutate(
            { isPublic: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    revalidate();
                    toast.success("Cập nhật trạng thái thành công.");
                },
            }
        );
        return;
    };

    // lọc
    const handlePublicationsFilterChange = (event) => {
        setSelectedPublications(event.target.value);
    };
    const handleMaterialFilterChange = (event) => {
        setSelectedMaterial(event.target.value);
    };

    const handleAuthorFilterChange = (event) => {
        setSelectedAuthor(event.target.value);
    };

    const handleCategoryFilterChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handlePublisherFilterChange = (event) => {
        setSelectedPublisher(event.target.value);
    };

    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
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
                label: "Loại ấn phẩm",
                align: "left",
                sxRow: { px: 3, maxWidth: 150 },
                render: (row) => {
                    const selectedType = typeOptions.find((option) => option.value === row.type);

                    const chipColor =
                        selectedType?.value === "ấn phẩm cứng" ? "#007e43" : "#fa7d70";

                    return selectedType ? (
                        <Chip
                            label={selectedType.label}
                            style={{ backgroundColor: chipColor, color: "#fff" }}
                            variant="filled"
                        />
                    ) : null;
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
                            onChange={(event) => handleChangePublic(row, event.target.checked)}
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
                            onChange={(event) =>
                                handleChangeShareConnect(row, event.target.checked)
                            }
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
                            <IconEye
                                size={20}
                                stroke={1.5}
                                onClick={() => handleViewDetails(row)}
                            />
                            <IconPencil
                                onClick={() => handleEditPublications(row)}
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
        [
            handleEditPublications,
            handleOpenConfirmDialog,
            handleChangeShareConnect,
            handleChangePublic,
        ]
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
                label: "Tải file mẫu",
                icon: <IconFileDownload size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
            {
                label: "Import file excel",
                icon: <IconFileUpload size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
            {
                label: "Xóa các dữ liệu đã chọn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TPublicationsCreate => {
        if (selectedEdit) {            
            return {
                name: selectedEdit.name,
                barcode: selectedEdit.barcode,
                description: selectedEdit.description,
                quantity: selectedEdit.quantity,
                shelvesQuantity: selectedEdit.shelvesQuantity,
                status: selectedEdit.status,
                type: selectedEdit.type,
                isPublic: selectedEdit.isPublic,
                isLink: selectedEdit.isLink,
                file: selectedEdit.file || "",
                categoryIds: selectedEdit.categoryIds || [],
                authorIds: selectedEdit.authorIds || [],
                shelvesId: (selectedEdit.shelvesId as string) || "",
                publisherIds: selectedEdit.publisherIds || [],
                materialIds: selectedEdit.materialIds || [],
            };
        }

        return {
            name: "",
            barcode: "",
            description: "",
            quantity: 0,
            shelvesQuantity: 0,
            status: "không có sẵn",
            type: "ấn phẩm cứng",
            isPublic: false,
            isLink: false,
            file: "",
            categoryIds: [],
            authorIds: [],
            shelvesId: "",
            publisherIds: [],
            materialIds: [],
        };
    }, [selectedEdit]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý ấn phẩm"
                mainProfile="Danh sách ấn phẩm"
                link="/thu-vien/an-pham"
            />

            {openAddEdit && (
                <FormAddEditPublications
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    cateOptions={categoryData?.data?.result || []}
                    authorOptions={authorData?.data?.result || []}
                    materialOptions={materialData?.data?.result || []}
                    publisherOptions={publisherData?.data?.result || []}
                    shelfOptions={shelfData?.data?.result || []}
                    imageUrl={
                        selectedEdit?.priviewImage
                            ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.priviewImage}`
                            : selectedEdit?.path
                            ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.path}`
                            : ""
                    }
                />
            )}

            <MainCard>
                <Stack
                    spacing={2}
                    sx={{
                        paddingLeft: { xs: 4, sm: 4 },
                        paddingBottom: { xs: 2, sm: 2 },
                        width: "100%",
                    }}
                >
                    <Box display="flex" flexWrap="wrap">
                        <Box>
                            <StyledButton
                                color="primary"
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={addPublications}
                            >
                                Thêm mới
                            </StyledButton>
                        </Box>

                        <Box>
                            <Link
                                to="/thu-vien/danh-sach-xoa-an-pham"
                                style={{ textDecoration: "none" }}
                            >
                                <StyledButton
                                    sx={{
                                        background: "#de524a",
                                        color: "white",
                                        marginLeft: "10px",
                                    }}
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

                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                />

                <FilterByItems
                    selectedPublications={selectedPublications}
                    handlePublicationsFilterChange={handlePublicationsFilterChange}
                    typeOptions={typeOptions}
                    selectedMaterial={selectedMaterial}
                    handleMaterialFilterChange={handleMaterialFilterChange}
                    materialData={materialData}
                    selectedCategory={selectedCategory}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    categoryData={categoryData}
                    selectedAuthor={selectedAuthor}
                    handleAuthorFilterChange={handleAuthorFilterChange}
                    authorData={authorData}
                    selectedPublisher={selectedPublisher}
                    handlePublisherFilterChange={handlePublisherFilterChange}
                    publisherData={publisherData}
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
                    isLoading={isLoading}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa thư viện"
                    description={`Bạn có chắc chắn muốn xóa "${publicationsToDelete?.name}" ?`}
                />
                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmSoftDeleteMultiple}
                    onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                    onConfirm={handleConfirmSoftDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />

                <PublicationsDetailsDialog
                    open={openViewDetails}
                    onClose={handleCloseViewDetails}
                    publications={publicationsDetails}
                />
            </MainCard>
        </div>
    );
};
export default PublicationsPage;
