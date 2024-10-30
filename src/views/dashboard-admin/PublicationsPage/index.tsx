import { Chip, Switch, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconBook, IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconEye, IconFileDownload, IconFileUpload, IconFileWord, IconPdf, IconPhoto, IconPresentation, IconTrashXFilled, IconVideo } from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import publicationsService from "../../../_apis/services/publications.service";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { useAuth } from "../../../contexts/JWTContext";
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
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TPublications, TPublicationsCreate } from "../../../types/models/publications.type";
import { TShelves } from "../../../types/models/shelves";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { statusOptions, typeOptions } from "../../../utils/constants.utils";
import { getLabelFromOptions, parserParams } from "../../../utils/object";
import DialogImportFile from "./ui-components/DialogImportFile ";
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
    const [selectedValuePublication, setSelectedValue] = useState("thuvien");

    const { user } = useAuth();

    const userId = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?._id;
    }, [user]);

    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);

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

    const { data, isLoading, isFetching } = useFetchPublications({
        limit,
        page,
        ...filter,
        ...(selectedValuePublication === "thuvien"
            ? { isPublic: true }
            : selectedValuePublication !== "all"
                ? { isPublic: false, createBy: userId }
                : {}),
    });

    const { data: categoryData } = useFetchCategory();
    const { data: materialData } = useFetchMaterial();
    const { data: authorData } = useFetchAuthor();
    const { data: publisherData } = useFetchPublisher();

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
    const [openImportFile, setOpenImportFile] = useState(false);

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

    const handleValuePublication = (event) => {
        setSelectedValue(event.target.value);
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
                label: "Thông tin ấn phẩm",
                align: "left",
                sxRow: {
                    px: 4,
                    maxWidth: 300,
                },
                render: (row) => {
                    return (
                        <>
                            {
                                row?.barcode && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        Barcode: <Typography ml={1} fontWeight={600}>{row?.barcode}</Typography>
                                    </Box>
                                )
                            }
                            {
                                !(row?.type === "ấn phẩm cứng") && (userRole !== "Student") && (row?.createBy === userId) && (
                                    <Box>
                                        Chia sẻ lên thư viện:
                                        <Switch
                                            checked={row?.isPublic}
                                            value={row?.isPublic}
                                            onChange={(event) => handleChangePublic(row, event.target.checked)}
                                            disabled={row?.isLink === true}
                                        />
                                    </Box>
                                )
                            }
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                Trạng thái: <Typography ml={1} fontWeight={600}>{getLabelFromOptions(statusOptions, row?.status)}</Typography>
                            </Box>
                            <Box mt={1}>
                                {
                                    (!row?.mimetype) && (
                                        <IconBook
                                            size={30}
                                            stroke={1.5}
                                            color="#007e43"
                                        />
                                    )
                                }
                                {
                                    (row?.mimetype === "application/pdf") && (
                                        <IconPdf
                                            size={30}
                                            stroke={1.5}
                                            color="#fd6033"
                                        />
                                    )
                                }
                                {
                                    (row?.mimetype === "application/msword" || row?.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && (
                                        <IconFileWord
                                            size={30}
                                            stroke={1.5}
                                            color="#007bff"
                                        />
                                    )
                                }
                                {
                                    (row?.mimetype === "video/mp4" || row?.mimetype === "video/x-msvideo" || row?.mimetype === "video/x-matroska" || row?.mimetype === "video/webm") && (
                                        <IconVideo
                                            size={30}
                                            stroke={1.5}
                                            color="#ff5733"
                                        />
                                    )
                                }
                                {
                                    (row?.mimetype === "application/vnd.ms-powerpoint" ||
                                        row?.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") && (
                                        <IconPresentation
                                            size={30}
                                            stroke={1.5}
                                            color="#ffc107"
                                        />
                                    )
                                }
                                {
                                    (row?.mimetype === "image/jpeg" ||
                                        row?.mimetype === "image/png" ||
                                        row?.mimetype === "image/gif" ||
                                        row?.mimetype === "image/bmp" ||
                                        row?.mimetype === "image/webp") && (
                                        <IconPhoto
                                            size={30}
                                            stroke={1.5}
                                            color="#28a745"
                                        />
                                    )
                                }
                            </Box>

                        </>
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
                    if (userRole === "Student") {
                        return null;
                    }

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
                            {
                                (userRole !== "Student") ?
                                    <>
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
                                    </>
                                    : <></>
                            }

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

    const handleDownloadTemplate = async () => {
        const filePath = "http://localhost:28040/assets/template/template-publication.xlsx";
        const fileName = "file mẫu.xlsx";
        try {
            const response = await axios.get(filePath, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const handleImportExcel = () => {
        setOpenImportFile(true);
    };

    const handleCloseImportExcel = () => {
        setOpenImportFile(false);
    };

    const handleSubmitImportFile = async (file: File) => {
        try {
            await publicationsService.importExcel(file);

            revalidate();
            toast.success("Import file excel thành công");
            setOpenImportFile(false);
        } catch (error) {
            toast.error(error?.message);
        }
    };

    const actionMenus = useMemo((): TMenuOption[] => {
        if (userRole === "Student") {
            return []; 
        }

        return [
            {
                label: "Tải file mẫu",
                icon: <IconFileDownload size={20} stroke={1.5} />,
                onClick: handleDownloadTemplate,
            },
            {
                label: "Import file excel",
                icon: <IconFileUpload size={20} stroke={1.5} />,
                onClick: handleImportExcel,
            },
            {
                label: "Xóa các dữ liệu đã chọn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [userRole, handleDeleteMultiple, handleDownloadTemplate, handleImportExcel]);

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
                shelvesId: (selectedEdit.shelvesId as TShelves)?._id || null,
                publisherIds: selectedEdit.publisherIds || [],
                materialIds: selectedEdit.materialIds || [],
                mimetype: selectedEdit.mimetype
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
            isPublic: true,
            isLink: false,
            file: "",
            categoryIds: [],
            authorIds: [],
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

            {openImportFile && (
                <DialogImportFile
                    open={openImportFile}
                    onClose={handleCloseImportExcel}
                    onSubmit={handleSubmitImportFile}
                />
            )}

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
                    imageUrl={
                        selectedEdit?.priviewImage
                            ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.priviewImage}`
                            : selectedEdit?.path
                                ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.path}`
                                : ""
                    }
                    isFetching={mutationAdd.isPending || mutationEdit.isPending}
                />
            )}

            <MainCard>
                {
                    (userRole !== "Student") ?
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
                        : <></>
                }


                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                    // nếu người dùng là thủ thư hoặc giáo viên
                    {...((userRole === "Admin" || userRole === "Teacher") ? {
                        selectedValuePublication: selectedValuePublication,
                        handleValuePublication: handleValuePublication
                    } : {})}
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
