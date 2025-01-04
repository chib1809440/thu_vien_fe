import BackspaceIcon from "@mui/icons-material/Backspace";
import { Alert, Checkbox, Chip, Grid, IconButton, Paper, Switch, Tooltip, Typography, useTheme } from "@mui/material";
import { Box, Stack, useMediaQuery } from "@mui/system";
import { IconBook, IconFileExport, IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import {
    IconBuildingWarehouse,
    IconEye,
    IconFileDescription,
    IconFileDownload,
    IconFileUpload,
    IconFileWord,
    IconHomeLink,
    IconHomeOff,
    IconPdf,
    IconPhoto,
    IconPresentation,
    IconShareOff,
    IconTrashXFilled,
    IconVideo,
    IconWorldShare,
} from "@tabler/icons-react";
import ExcelJS from "exceljs";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import publicationsService from "../../../_apis/services/publications.service";
import ImageCard from "../../../components/custom/card/ImageCard";
import ActionsForm from "../../../components/custom/form/ActionForm";
import PaginationForm from "../../../components/custom/form/PaginationForm";
import StyledButton from "../../../components/default/button/StyledButton";
import StyledIconButton from "../../../components/default/button/StyledIconButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { useAuth } from "../../../contexts/JWTContext";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useFetchAuthor } from "../../../hooks/services/author/author-query";
import { useFetchCategory } from "../../../hooks/services/category/category-query";
import { useFetchLibrary } from "../../../hooks/services/library/library-query";
import { useFetchMaterial } from "../../../hooks/services/material/material-query";
import {
    useAddPublications,
    useDeleteSoftManyPublications,
    useDeleteSoftPublications,
    useEditPublications,
    useUpdateIsLink,
    useUpdateIsUnLink,
} from "../../../hooks/services/publications/publications-mutation";
import { useFetchPublications, useReFetchPublications } from "../../../hooks/services/publications/publications-query";
import { useFetchPublisher } from "../../../hooks/services/publisher/publisher-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { addInternalItem } from "../../../store/slices/cartInternalLoanSlip";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TLibrary } from "../../../types/models/library.type";
import { CreatePublication } from "../../../types/models/loanSlip.type";
import { TPublications, TPublicationsCreate } from "../../../types/models/publications.type";
import { TShelves } from "../../../types/models/shelves";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { statusOptions, typeOptions } from "../../../utils/constants.utils";
import usePermission from "../../../utils/hasPermission";
import { getLabelFromOptions, parserParams } from "../../../utils/object";
import DialogImportFile from "./ui-components/DialogImportFile";
import FilterByItems from "./ui-components/FilterByItems";
import FormAddEditPublications from "./ui-components/FormAddEditPublications";
import PublicationsDetailsDialog from "./ui-components/PublicationsDetailsDialog";
import GradientCircularProgressLoading from "../../../components/default/loading/GradientCircularProgressLoading/GradientCircularProgressLoading";

const BreakpointsColumn = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 4,
    xl: 3,
};

const MAX_ROWS = 3;

const PublicationsPage = () => {
    const theme = useTheme();

    const isMdScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const _limitDisplay = useMemo(() => {
        if (isMdScreen) {
            return (12 / BreakpointsColumn.md) * MAX_ROWS;
        } else {
            return 12
        }
    }, [isMdScreen]);

    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? _limitDisplay;
    const search = queryString?.q ?? "";

    const [selectedMaterial, setSelectedMaterial] = useState(0);
    const [selectedPublications, setSelectedPublications] = useState(0);
    const [selectedAuthor, setSelectedAuthor] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedPublisher, setSelectedPublisher] = useState(0);
    const [barcodeSearch, setBarcodeSearch] = useState("");
    const [selectedValuePublication, setSelectedValue] = useState("thuvien");
    const [selectedLibrary, setSelectedLibrary] = useState(0);

    const { user } = useAuth();
    const { hasPermission } = usePermission();

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
                { compare: 0, target: { libraryId: selectedLibrary } },
            ]),
        [
            selectedMaterial,
            selectedAuthor,
            selectedCategory,
            selectedPublisher,
            selectedPublications,
            selectedLibrary,
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

    // const filterByLibId = useMemo(
    //     () => parserParams([{ compare: 0, target: { libraryId: selectedLibrary } }]),
    //     [selectedLibrary]
    // );

    // const { data: categoryData } = useFetchCategory({
    //     limit,
    //     page,
    //     ...filterByLibId,
    // });
    // const { data: materialData } = useFetchMaterial({
    //     limit,
    //     page,
    //     ...filterByLibId,
    // });
    // const { data: authorData } = useFetchAuthor({
    //     limit,
    //     page,
    //     ...filterByLibId,
    // });
    // const { data: publisherData } = useFetchPublisher({
    //     limit,
    //     page,
    //     ...filterByLibId,
    // });

    const { data: categoryData } = useFetchCategory();
    const { data: materialData } = useFetchMaterial();
    const { data: authorData } = useFetchAuthor();
    const { data: publisherData } = useFetchPublisher();
    const { data: libraryData } = useFetchLibrary();

    const mutationAdd = useAddPublications();
    const mutationEdit = useEditPublications();
    const mutationEditIsLink = useUpdateIsLink();
    const mutationEditIsUnLink = useUpdateIsUnLink();
    const mutationSoftDelete = useDeleteSoftPublications();
    const mutationSoftDeleteMany = useDeleteSoftManyPublications();
    const revalidate = useReFetchPublications();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [openPublic, setOpenPublic] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TPublications | null>(null);
    const [selectedEditIsLink, setSelectedIsLink] = useState<TPublications | null>(null);
    const [selectedEditIsPublic, setSelectedIsPublic] = useState<TPublications | null>(null);
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

    const handleOpenConfirmLink = (row: TPublications) => {
        setSelectedIsLink(row);
        setOpenLink(true);
    };
    const handleCloseLink = () => {
        setOpenLink(false);
        setSelectedIsLink(null);
    };

    const handleChangeShareConnect = async () => {
        console.log(selectedEditIsLink);

        if (!selectedEditIsLink.isPublic) {
            toast.warn("Không thể thay đổi trạng thái liên thông vì chưa chia sẻ lên thư viện.");
            return;
        }
        if (selectedEditIsLink?.isLink === false) {
            mutationEditIsLink.mutate(selectedEditIsLink._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success("Chia sẻ liên thông thành công.");
                    handleCloseLink();
                },
            });
        } else {
            mutationEditIsUnLink.mutate(selectedEditIsLink._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success("Hủy chia sẻ liên thông.");
                    handleCloseLink();
                },
            });
        }
        return;
    };

    const handleOpenConfirmPublic = (row: TPublications) => {
        setSelectedIsPublic(row);
        setOpenPublic(true);
    };
    const handleClosePublic = () => {
        setOpenPublic(false);
        setSelectedIsPublic(null);
    };

    // const handleChangePublic = (row: TPublications, checked: boolean) => {
    //     // TODO: update
    //     mutationEdit.mutate(
    //         { isPublic: checked, _id: row._id },
    //         {
    //             onSuccess: (data) => {
    //                 revalidate();
    //                 toast.success("Cập nhật trạng thái thành công.");
    //             },
    //         }
    //     );
    //     return;
    // };
    const handleChangePublic = async () => {
        if (selectedEditIsPublic?.isPublic === false) {
            mutationEdit.mutate(
                { isPublic: !selectedEditIsPublic?.isPublic, _id: selectedEditIsPublic._id },
                {
                    onSuccess: (data) => {
                        revalidate();
                        toast.success("Chia sẻ lên thư viện thành công.");
                        handleClosePublic();
                    },
                }
            );
        } else {
            mutationEdit.mutate(
                { isPublic: !selectedEditIsPublic?.isPublic, _id: selectedEditIsPublic._id },
                {
                    onSuccess: (data) => {
                        revalidate();
                        toast.success("Hủy chia sẻ lên thư viên.");
                        handleClosePublic();
                    },
                }
            );
        }
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
        console.log(event.target.value);
    };

    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
    };

    const handleValuePublication = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleLibraryFilterChange = (event) => {
        setSelectedLibrary(event.target.value);
    };
    const dispatch = useDispatch();
    const items = useSelector((state: { cartLoanSlip: { items: CreatePublication[] } }) => state.cartLoanSlip.items);
    const handleAddItem = (item: TPublications & { libraryDetails?: TLibrary }) => {
        if (item.type === "ấn phẩm mềm") {
            toast.warning(`Không thể mượn ấn phẩm mềm`, {
                toastId: "2",
                position: "bottom-right", // Đặt vị trí ở góc dưới bên phải
                autoClose: 3000, // Thời gian tự động đóng (ms)
                hideProgressBar: false, // Hiện thanh tiến trình
                closeOnClick: true, // Cho phép đóng thông báo bằng cách nhấp
                pauseOnHover: true, // Tạm dừng khi di chuột
                draggable: true, // Cho phép kéo thả để đóng thông báo
            });
            return;
        }
        const createPublication: CreatePublication = {
            publicationId: item._id, // Giả định item có publicationId
            name: item.name, // Giả định item có name
            quantityLoan: 1, // Giả định item có quantityLoan
            quantity: item.quantity, // Giả định item có quantity
            shelvesQuantity: item.shelvesQuantity, // Giả định item có shelvesQuantity
            position: "trên kệ", // Giả định item có position
            quantityModify: 1, // Có thể có hoặc không
            barcode: item.barcode, // Giả định item có barcode
            libraryId: (item?.libraryDetails as TLibrary)?._id,
            libraryName: (item?.libraryDetails as TLibrary)?.name,
        };
        const duplicateItem = items.find((cartItem) => cartItem.libraryId === createPublication.libraryId);
        // if (!duplicateItem && items.length > 0) {
        //     const item = items[0];
        //     toast.warning(`Chỉ thêm sách của một thư viện là ${item.libraryName}`, {
        //         toastId: "1",
        //         position: "bottom-right", // Đặt vị trí ở góc dưới bên phải
        //         autoClose: 3000, // Thời gian tự động đóng (ms)
        //         hideProgressBar: false, // Hiện thanh tiến trình
        //         closeOnClick: true, // Cho phép đóng thông báo bằng cách nhấp
        //         pauseOnHover: true, // Tạm dừng khi di chuột
        //         draggable: true, // Cho phép kéo thả để đóng thông báo
        //     });
        //     return;
        // }
        // Dispatch action để thêm item vào giỏ hàng
        dispatch(addInternalItem(createPublication));
        toast.success("Thêm sản phẩm vào phiếu mượn thành công", {
            position: "bottom-right", // Đặt vị trí ở góc dưới bên phải
            autoClose: 3000, // Thời gian tự động đóng (ms)
            hideProgressBar: false, // Hiện thanh tiến trình
            closeOnClick: true, // Cho phép đóng thông báo bằng cách nhấp
            pauseOnHover: true, // Tạm dừng khi di chuột
            draggable: true, // Cho phép kéo thả để đóng thông báo
        });
    };
    const columns: TColumn<TPublications & { libraryId: TLibrary }>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên ấn phẩm",
                align: "left",
                sxRow: { px: 3, maxWidth: 150 },
                render: (row) => {
                    const hasWhitespace = /\s/.test(row?.name);
                    return <Typography noWrap={!hasWhitespace}>{capitalizeFirstLetter(row?.name)}</Typography>;
                },
            },
            {
                id: "type",
                disablePadding: "none",
                label: "Loại ấn phẩm",
                align: "left",
                sxRow: { px: 3, maxWidth: 150 },
                render: (row) => {
                    const selectedType = typeOptions.find((option) => option.value === row.type);

                    const chipColor = selectedType?.value === "ấn phẩm cứng" ? "#007e43" : "#fa7d70";

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
                            {userRole === "Super Admin" &&
                                (row?.libraryId !== null ? (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        Thư viện:{" "}
                                        <Typography ml={1} fontWeight={600}>
                                            {capitalizeFirstLetter((row?.libraryId as TLibrary)?.name)}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        Thư viện:{" "}
                                        <Typography ml={1} fontWeight={600}>
                                            Thư viện không tồn tại
                                        </Typography>
                                    </Box>
                                ))}
                            {row?.barcode && (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Barcode:{" "}
                                    <Typography ml={1} fontWeight={600}>
                                        {row?.barcode}
                                    </Typography>
                                </Box>
                            )}
                            {!(row?.type === "ấn phẩm cứng") && userRole !== "Student" && row?.createBy === userId && (
                                <Box>
                                    Chia sẻ lên thư viện:
                                    <Switch
                                        checked={row?.isPublic}
                                        value={row?.isPublic}
                                        // onChange={(event) =>
                                        //     handleChangePublic(row, event.target.checked)
                                        // }
                                        disabled={row?.isLink === true}
                                    />
                                </Box>
                            )}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                Trạng thái:{" "}
                                <Typography ml={1} fontWeight={600}>
                                    {getLabelFromOptions(statusOptions, row?.status)}
                                </Typography>
                            </Box>
                            <Box mt={1}>
                                {(!row?.mimetype ||
                                    ((row?.mimetype === "image/jpeg" ||
                                        row?.mimetype === "image/png" ||
                                        row?.mimetype === "image/gif" ||
                                        row?.mimetype === "image/bmp" ||
                                        row?.mimetype === "image/webp") &&
                                        row?.type === "ấn phẩm cứng")) && (
                                        <IconBook size={30} stroke={1.5} color="#007e43" />
                                    )}
                                {row?.mimetype === "application/pdf" && (
                                    <IconPdf size={30} stroke={1.5} color="#fd6033" />
                                )}
                                {(row?.mimetype === "application/msword" ||
                                    row?.mimetype ===
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && (
                                        <IconFileWord size={30} stroke={1.5} color="#007bff" />
                                    )}
                                {(row?.mimetype === "video/mp4" ||
                                    row?.mimetype === "video/x-msvideo" ||
                                    row?.mimetype === "video/x-matroska" ||
                                    row?.mimetype === "video/webm") && (
                                        <IconVideo size={30} stroke={1.5} color="#ff5733" />
                                    )}
                                {(row?.mimetype === "application/vnd.ms-powerpoint" ||
                                    row?.mimetype ===
                                    "application/vnd.openxmlformats-officedocument.presentationml.presentation") && (
                                        <IconPresentation size={30} stroke={1.5} color="#ffc107" />
                                    )}
                                {(row?.mimetype === "image/jpeg" ||
                                    row?.mimetype === "image/png" ||
                                    row?.mimetype === "image/gif" ||
                                    row?.mimetype === "image/bmp" ||
                                    row?.mimetype === "image/webp") &&
                                    row?.type === "ấn phẩm mềm" && <IconPhoto size={30} stroke={1.5} color="#28a745" />}
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
                    return (
                        <Switch
                            checked={row?.isLink}
                            onChange={() => handleOpenConfirmLink(row)}
                            value={row?.isLink}
                            disabled={userRole === "Super Admin" || userRole === "Student" ? true : false}
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
                    const canManagePublications = hasPermission([
                        { resource: "publications", action: "manage" },
                        { resource: "publications", action: "update" },
                    ]);
                    const canDeletePublications = hasPermission([
                        { resource: "publications", action: "manage" },
                        { resource: "publications", action: "delete" },
                    ]);

                    return (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            {row?.type === "ấn phẩm cứng" && (
                                <Tooltip title="Mượn ấn phẩm" arrow placement="top">
                                    <IconPlus size={25} stroke={1.5} onClick={() => handleAddItem(row)} />
                                </Tooltip>
                            )}
                            <IconEye size={20} stroke={1.5} onClick={() => handleViewDetails(row)} />
                            {canManagePublications && (
                                <IconPencil onClick={() => handleEditPublications(row)} size={20} stroke={1.5} />
                            )}
                            {userRole === "Teacher" && row?.createBy === userId && canDeletePublications && (
                                <IconTrash size={20} stroke={1.5} onClick={() => handleOpenConfirmDialog(row)} />
                            )}
                            {userRole !== "Teacher" && canDeletePublications && (
                                <IconTrash size={20} stroke={1.5} onClick={() => handleOpenConfirmDialog(row)} />
                            )}
                        </Box>
                    );
                },
            },
        ],
        [handleEditPublications, handleOpenConfirmDialog, handleChangeShareConnect, handleChangePublic]
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

    const handleImportExcel = () => {
        setOpenImportFile(true);
    };

    const handleCloseImportExcel = () => {
        setOpenImportFile(false);
    };

    const handleSubmitImportFile = async (file: File) => {
        try {
            const response = await publicationsService.importExcel(file);
            revalidate();
            const duplicateBarcodeErrors = response?.data?.errors.filter(
                (error) => error.error === "Barcode đã tồn tại!" || error.error === "tên ấn phẩm đã tồn tại!"
            );

            if (duplicateBarcodeErrors.length > 0) {
                const barcodeErrors = duplicateBarcodeErrors.filter((error) => error.error === "Barcode đã tồn tại!");
                const nameErrors = duplicateBarcodeErrors.filter((error) => error.error === "tên ấn phẩm đã tồn tại!");

                // Lấy các dòng bị lỗi
                const barcodeRows = barcodeErrors.map(({ row }) => row);
                const nameRows = nameErrors.map(({ row }) => row);

                const uniqueBarcodeRows = Array.from(new Set(barcodeRows)); // Loại bỏ dòng trùng lặp
                const uniqueNameRows = Array.from(new Set(nameRows)); // Loại bỏ dòng trùng lặp

                const barcodeRowList = uniqueBarcodeRows.join(", ");
                const nameRowList = uniqueNameRows.join(", ");

                if (barcodeErrors.length > 0) {
                    toast.error(
                        <span>
                            Barcode đã tồn tại ở dòng: <strong style={{ color: "red" }}>[ {barcodeRowList} ]</strong>.
                        </span>
                    );
                }

                // Hiển thị lỗi Tên ấn phẩm nếu có
                if (nameErrors.length > 0) {
                    toast.error(
                        <span>
                            Tên ấn phẩm đã tồn tại ở dòng: <strong style={{ color: "red" }}>[ {nameRowList} ]</strong>.
                        </span>
                    );
                }
            } else {
                // Nếu không có lỗi nào
                toast.success("Import file excel thành công");
            }

            setOpenImportFile(false);
        } catch (error) {
            toast.error(error?.message);
        }
    };

    const handleExportPublicationsExcel = () => {
        // Tạo một workbook mới
        console.log(data);
        if (data) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Publications");

            // Thêm hàng tiêu đề chính
            worksheet.addRow(["Danh sách ấn phẩm"]).font = { bold: true, size: 14 };
            worksheet.addRow([]);

            const currentDateTime = new Date();
            const formattedDateTime = currentDateTime.toLocaleString("vi-VN", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            });

            worksheet.addRow([`Ngày xuất file: ${formattedDateTime}`]).font = { bold: true };
            worksheet.addRow([]);

            worksheet.addRow([
                "Mã ấn phẩm",
                "Tên ấn phẩm",
                "Dạng học liệu",
                "Lĩnh vực",
                "Tác giả",
                "Nhà xuất bản",
                "Số lượng tồn kho",
                "Số lượng trên kệ",
                "Số lượng mượn",
                "Số lượng thanh lý",
                "Số lượng tổng",
                "Trạng thái",
                "Loại",
                "Ghi chú",
            ]).font = { bold: true };

            worksheet.getColumn("A").width = 15;
            worksheet.getColumn("B").width = 30;
            worksheet.getColumn("C").width = 30;
            worksheet.getColumn("D").width = 30;
            worksheet.getColumn("E").width = 30;
            worksheet.getColumn("F").width = 30;
            worksheet.getColumn("G").width = 20;
            worksheet.getColumn("H").width = 15;
            worksheet.getColumn("I").width = 15;
            worksheet.getColumn("J").width = 20;
            worksheet.getColumn("K").width = 15;
            worksheet.getColumn("L").width = 15;
            worksheet.getColumn("M").width = 30;
            worksheet.getColumn("N").width = 30;

            const publicationsData = data?.data?.result?.map((publication) => {
                const categoryNames = publication?.categoryIds
                    ? publication?.categoryIds.map((category) => category?.name).join(", ")
                    : "";
                const authorNames = publication?.authorIds
                    ? publication?.authorIds.map((author) => author?.name).join(", ")
                    : "";
                const materialNames = publication?.materialIds
                    ? publication?.materialIds.map((material) => material?.name).join(", ")
                    : "";
                const publisherNames = publication?.publisherIds
                    ? publication?.publisherIds.map((publisher) => publisher?.name).join(", ")
                    : "";
                return {
                    barcode: publication?.barcode,
                    name: publication?.name,
                    materialIds: materialNames,
                    categoryIds: categoryNames,
                    authorIds: authorNames,
                    publisherIds: publisherNames,
                    quantity: publication?.quantity,
                    shelvesQuantity: publication?.shelvesQuantity,
                    quantityLoan: publication?.quantityLoan,
                    quantityLiquidation: publication?.quantityLiquidation,
                    totalQuantity: publication?.totalQuantity,
                    status: capitalizeFirstLetter(publication?.status),
                    type: getLabelFromOptions(typeOptions, publication?.type),
                    note: publication?.note || "",
                };
            });

            publicationsData.forEach((dataRow) => {
                const row = worksheet.addRow([]);
                row.values = [
                    dataRow.barcode,
                    dataRow.name,
                    dataRow.materialIds,
                    dataRow.categoryIds,
                    dataRow.authorIds,
                    dataRow.publisherIds,
                    dataRow.quantity,
                    dataRow.shelvesQuantity,
                    dataRow.quantityLoan,
                    dataRow.quantityLiquidation,
                    dataRow.totalQuantity,
                    dataRow.status,
                    dataRow.type,
                    dataRow.note,
                ];
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            });

            const headerRow = worksheet.getRow(4);
            headerRow.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFCCCCCC" },
                };
                cell.font = {
                    bold: true,
                    color: { argb: "FF000000" },
                };
            });

            // Tạo file Excel và lưu
            const formattedDate = currentDateTime.toLocaleDateString("vi-VN");
            const fileName = `DanhSach_AnPhamTruyenThong_${formattedDate}.xlsx`;

            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: "application/octet-stream" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            });
        } else {
            toast.error("Không có dữ liệu để xuất excel");
        }
    };

    const actionMenus = useMemo((): TMenuOption[] => {
        return hasPermission([
            { resource: "publications", action: "manage" },
            { resource: "publications", action: "create" },
        ])
            ? [
                {
                    label: "Tải file mẫu",
                    icon: <IconFileDownload size={20} stroke={1.5} />,
                    component: (
                        <a
                            href={`${process.env.REACT_APP_BASE_API_FILE_URL}/default/mau_them_nhieu_an_pham.xlsx`}
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                color: "#616161",
                            }}
                        >
                            <IconFileDownload size={20} stroke={1.5} style={{ marginRight: 8 }} />
                            Tải file mẫu
                        </a>
                    ),
                },
                {
                    label: "Nhập file excel",
                    icon: <IconFileUpload size={20} stroke={1.5} />,
                    onClick: handleImportExcel,
                },
                {
                    label: "Xuất danh sách ấn phẩm",
                    icon: <IconFileExport size={20} stroke={1.5} />,
                    onClick: handleExportPublicationsExcel,
                },
                ...(userRole === "Admin" || userRole === "Owner"
                    ? [
                        {
                            label: "Xóa các dữ liệu đã chọn",
                            icon: <IconTrashXFilled size={20} stroke={1.5} />,
                            onClick: handleDeleteMultiple,
                        },
                    ]
                    : []),
            ]
            : [];
    }, [userRole, handleDeleteMultiple, handleImportExcel, handleExportPublicationsExcel]);

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
                mimetype: selectedEdit.mimetype,
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
            <IBreadcrumsCustom profile="Quản lý ấn phẩm" mainProfile="Danh sách ấn phẩm" link="/thu-vien/an-pham" />

            {openImportFile && (
                <DialogImportFile
                    open={openImportFile}
                    onClose={handleCloseImportExcel}
                    onSubmit={handleSubmitImportFile}
                    title={"Thêm mới thông tin ấn phẩm bằng excel"}
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
                <Stack
                    spacing={2}
                    sx={{
                        paddingLeft: { xs: 0, sm: 0, md: 4 },
                        paddingBottom: { xs: 2, sm: 2 },
                        width: "100%",
                    }}
                >
                    <Box display="flex" flexWrap="wrap">
                        <Box>
                            {hasPermission([
                                { resource: "publications", action: "manage" },
                                { resource: "publications", action: "create" },
                            ]) ? (
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addPublications}
                                >
                                    Thêm mới
                                </StyledButton>
                            ) : (
                                <></>
                            )}
                        </Box>

                        <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                            {hasPermission([{ resource: "publications", action: "manage" }]) ? (
                                <>
                                    {hasPermission([{ resource: "warehousereceipts", action: "manage" }]) && (
                                        <Link to="/quan-ly-kho/kho-tai-san" style={{ textDecoration: "none" }}>
                                            <StyledButton
                                                sx={{
                                                    background: "#a36e21",
                                                    color: "white",
                                                    marginLeft: "10px",
                                                }}
                                                size="small"
                                                startIcon={<IconBuildingWarehouse stroke={2} />}
                                                variant="contained"
                                            >
                                                Quản lý kho
                                            </StyledButton>
                                        </Link>
                                    )}
                                    {hasPermission([{ resource: "publications", action: "delete" }]) && (
                                        <Link to="/thu-vien/danh-sach-xoa-an-pham" style={{ textDecoration: "none" }}>
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
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </Box>
                </Stack>

                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                    // nếu người dùng là thủ thư hoặc giáo viên
                    {...(userRole === "Admin" || userRole === "Teacher" || userRole === "Owner"
                        ? {
                            selectedValuePublication: selectedValuePublication,
                            handleValuePublication: handleValuePublication,
                        }
                        : {})}
                    {...(userRole === "Super Admin"
                        ? {
                            selectedLibrary: selectedLibrary,
                            handleLibraryFilterChange: handleLibraryFilterChange,
                            libraryData: libraryData?.data?.result,
                        }
                        : {})}
                />

                <FilterByItems
                    selectedPublications={selectedPublications}
                    handlePublicationsFilterChange={handlePublicationsFilterChange}
                    typeOptions={typeOptions}
                    {...(userRole !== "Super Admin"
                        ? {
                            selectedMaterial: selectedMaterial,
                            handleMaterialFilterChange: handleMaterialFilterChange,
                            materialData: materialData,
                            selectedCategory: selectedCategory,
                            handleCategoryFilterChange: handleCategoryFilterChange,
                            categoryData: categoryData,
                            selectedAuthor: selectedAuthor,
                            handleAuthorFilterChange: handleAuthorFilterChange,
                            authorData: authorData,
                            selectedPublisher: selectedPublisher,
                            handlePublisherFilterChange: handlePublisherFilterChange,
                            publisherData: publisherData,
                        }
                        : {})}
                />
                {/* <TableList
                    checked={checkedDelete}
                    columns={columns}
                    rows={data?.data?.result || []}
                    onChecked={handleCheckedDelete}
                    onToggleCheckedAll={handleCheckedDeleteAll}
                    checkedAll={checkedAll}
                    isLoading={isLoading || isFetching}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                /> */}

                <Grid container spacing={2} sx={{ p: { xs: 0, sm: 0, md: "12px 32px" }, pt: 2 }}>
                    {data?.data?.result?.length > 0 && userRole !== "Student" && userRole !== "Teacher" && (
                        <Grid
                            item
                            xs={12}
                            p={0}
                            sx={{
                                display: { xs: "none", sm: "none", md: "flex" },
                                flexDirection: "column",
                                ml: -1,
                                mt: -3,
                            }}
                        >
                            <Box display={"flex"} alignItems={"center"}>
                                <Checkbox
                                    checked={checkedAll}
                                    onChange={(e) => handleCheckedDeleteAll(e.target.checked)}
                                />
                                <Typography>Chọn tất cả ấn phẩm</Typography>
                            </Box>
                            <Box sx={{ ml: 1 }}>
                                {checkedDelete && checkedDelete.length > 0 && (
                                    <Alert severity="info">
                                        Có{" "}
                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            {checkedDelete.length}
                                        </Typography>{" "}
                                        dữ liệu đã chọn
                                    </Alert>
                                )}
                            </Box>
                        </Grid>
                    )}

                    {isLoading || isFetching ? (
                        <Grid
                            item
                            xs={12}
                            p={0}
                        >

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}><GradientCircularProgressLoading /></Box>
                        </Grid>
                    ) : data?.data?.result?.length > 0 ? (
                        data?.data?.result.map((item, index) => (
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        border: `1px solid ${theme.palette.grey[300]}`,
                                        boxShadow: "0px 4px 6px rgba(86, 204, 242, 0.3)",
                                    }}
                                    elevation={0}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            height: "100%",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            position: "relative",
                                        }}
                                    >
                                        {userRole !== "Student" && userRole !== "Teacher" && (
                                            <Box
                                                sx={{
                                                    display: { xs: "none", sm: "none", md: "flex" },
                                                    position: "absolute",
                                                    zIndex: 99,
                                                    top: -25,
                                                    left: -25,
                                                }}
                                            >
                                                <Checkbox
                                                    checked={checkedDelete.includes(item._id)}
                                                    onChange={(e) => handleCheckedDelete(item, e.target.checked)}
                                                />
                                            </Box>
                                        )}

                                        <Paper sx={{ width: "100%", position: "relative" }}>
                                            <Box onClick={() => handleViewDetails(item)}>
                                                <ImageCard
                                                    id={item._id}
                                                    photo={
                                                        item?.priviewImage
                                                            ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${item.priviewImage}`
                                                            : item?.path
                                                                ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${item.path}`
                                                                : ""
                                                    }
                                                    aspectRatio={"16/9"}
                                                    objectFit="contain"
                                                />
                                            </Box>
                                            {userRole === "Teacher" &&
                                                item?.createBy === userId &&
                                                hasPermission([
                                                    { resource: "publications", action: "manage" },
                                                    { resource: "publications", action: "delete" },
                                                ]) && (
                                                    <StyledIconButton
                                                        disableHoverEffect
                                                        sx={{
                                                            position: "absolute",
                                                            zIndex: 999,
                                                            top: -30,
                                                            right: -30,
                                                            margin: "8px",
                                                            background: "none",
                                                            [theme.breakpoints.down("md")]: {
                                                                width: "10%",
                                                            },
                                                            [theme.breakpoints.down("sm")]: {
                                                                width: "10%",
                                                            },
                                                        }}
                                                    >
                                                        <BackspaceIcon
                                                            sx={{
                                                                color: theme.palette.error.dark,
                                                            }}
                                                            onClick={() => handleOpenConfirmDialog(item)}
                                                        />
                                                    </StyledIconButton>
                                                )}
                                            {userRole !== "Teacher" &&
                                                hasPermission([
                                                    { resource: "publications", action: "manage" },
                                                    { resource: "publications", action: "delete" },
                                                ]) && (
                                                    <StyledIconButton
                                                        disableHoverEffect
                                                        sx={{
                                                            position: "absolute",
                                                            zIndex: 999,
                                                            top: -30,
                                                            right: -30,
                                                            margin: "8px",
                                                            background: "none",
                                                            [theme.breakpoints.down("md")]: {
                                                                width: "10%",
                                                            },
                                                            [theme.breakpoints.down("sm")]: {
                                                                width: "10%",
                                                            },
                                                        }}
                                                    >
                                                        <BackspaceIcon
                                                            sx={{
                                                                color: theme.palette.error.dark,
                                                            }}
                                                            onClick={() => handleOpenConfirmDialog(item)}
                                                        />
                                                    </StyledIconButton>
                                                )}

                                            <Box sx={{ position: "relative" }}>
                                                <StyledIconButton
                                                    disableHoverEffect
                                                    sx={{
                                                        position: "absolute",
                                                        zIndex: 999,
                                                        bottom: -90,
                                                        left: -20,
                                                        background: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "start",
                                                        [theme.breakpoints.down("md")]: {
                                                            width: "20%",
                                                        },
                                                        [theme.breakpoints.down("sm")]: {
                                                            width: "40%",
                                                        },
                                                    }}
                                                >
                                                    {!(item?.type === "ấn phẩm cứng") &&
                                                        userRole !== "Student" &&
                                                        item?.createBy === userId &&
                                                        !item?.isLink && (
                                                            <Tooltip title="Chia sẻ lên thư viện" arrow placement="top">
                                                                <IconButton
                                                                    onClick={() => handleOpenConfirmPublic(item)}
                                                                >
                                                                    {item?.isPublic ? (
                                                                        <IconHomeOff
                                                                            stroke={2}
                                                                            color="green"
                                                                            size={24}
                                                                        />
                                                                    ) : (
                                                                        <IconHomeLink
                                                                            stroke={2}
                                                                            color="gray"
                                                                            size={24}
                                                                        />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                    {item?.isPublic && userRole !== "Student" && (
                                                        <Tooltip title="Chia sẻ liên thông" arrow placement="top">
                                                            <IconButton
                                                                onClick={() => handleOpenConfirmLink(item)}
                                                                disabled={
                                                                    userRole === "Super Admin" || userRole === "Student"
                                                                }
                                                            >
                                                                {item?.isLink ? (
                                                                    <IconShareOff stroke={2} color="blue" size={24} />
                                                                ) : (
                                                                    <IconWorldShare stroke={2} color="gray" size={24} />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </StyledIconButton>

                                                <StyledIconButton
                                                    disableHoverEffect
                                                    sx={{
                                                        position: "absolute",
                                                        zIndex: 999,
                                                        bottom: -90,
                                                        right:
                                                            userRole === "Super Admin" ||
                                                                userRole === "Student" ||
                                                                userRole === "Teacher"
                                                                ? -15
                                                                : 15,
                                                        margin: "8px",
                                                        background: "none",
                                                        [theme.breakpoints.down("sm")]: {
                                                            width: "7%",
                                                        },
                                                        [theme.breakpoints.down("md")]: {
                                                            width: "10%",
                                                        },
                                                    }}
                                                >
                                                    {item?.type === "ấn phẩm cứng" && (
                                                        <Tooltip
                                                            title={
                                                                item?.status === "có sẵn"
                                                                    ? "Mượn ấn phẩm"
                                                                    : "Ấn phẩm không có sẵn"
                                                            }
                                                            arrow
                                                            placement="top"
                                                        >
                                                            <Box
                                                                sx={{
                                                                    background:
                                                                        item?.status === "có sẵn" ? "green" : "gray",
                                                                    color: "white",
                                                                    borderRadius: 2,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    p: 0.5,
                                                                    // pointerEvents: item?.status === "có sẵn" ? "auto" : "none",
                                                                    opacity: item?.status === "có sẵn" ? 1 : 0.5,
                                                                }}
                                                            >
                                                                <IconFileDescription
                                                                    size={20}
                                                                    stroke={2}
                                                                    onClick={() => {
                                                                        if (item?.status === "có sẵn") {
                                                                            handleAddItem(item);
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                    )}
                                                </StyledIconButton>

                                                {userRole === "Teacher" &&
                                                    item?.createBy === userId &&
                                                    hasPermission([
                                                        { resource: "publications", action: "manage" },
                                                        { resource: "publications", action: "update" },
                                                    ]) && (
                                                        <StyledIconButton
                                                            disableHoverEffect
                                                            sx={{
                                                                position: "absolute",
                                                                zIndex: 999,
                                                                bottom: -90,
                                                                right: -15,
                                                                margin: "8px",
                                                                background: "none",
                                                                [theme.breakpoints.down("sm")]: {
                                                                    width: "7%",
                                                                },
                                                                [theme.breakpoints.down("md")]: {
                                                                    width: "10%",
                                                                },
                                                            }}
                                                        >
                                                            <Box
                                                                bgcolor={"red"}
                                                                sx={{
                                                                    background: "#3078ec",
                                                                    color: "white",
                                                                    borderRadius: 2,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    p: 0.5,
                                                                }}
                                                            >
                                                                <IconPencil
                                                                    onClick={() => handleEditPublications(item)}
                                                                    size={20}
                                                                    stroke={2}
                                                                />
                                                            </Box>
                                                        </StyledIconButton>
                                                    )}

                                                {userRole !== "Teacher" &&
                                                    hasPermission([
                                                        { resource: "publications", action: "manage" },
                                                        { resource: "publications", action: "update" },
                                                    ]) && (
                                                        <StyledIconButton
                                                            disableHoverEffect
                                                            sx={{
                                                                position: "absolute",
                                                                zIndex: 999,
                                                                bottom: -90,
                                                                right: -15,
                                                                margin: "8px",
                                                                background: "none",
                                                                [theme.breakpoints.down("sm")]: {
                                                                    width: "7%",
                                                                },
                                                                [theme.breakpoints.down("md")]: {
                                                                    width: "10%",
                                                                },
                                                            }}
                                                        >
                                                            <Box
                                                                bgcolor={"red"}
                                                                sx={{
                                                                    background: "#3078ec",
                                                                    color: "white",
                                                                    borderRadius: 2,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    p: 0.5,
                                                                }}
                                                            >
                                                                <IconPencil
                                                                    onClick={() => handleEditPublications(item)}
                                                                    size={20}
                                                                    stroke={2}
                                                                />
                                                            </Box>
                                                        </StyledIconButton>
                                                    )}
                                            </Box>
                                        </Paper>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                height: "100%",
                                                minHeight: "75px",
                                                width: "200px",
                                            }}
                                        >
                                            <Typography
                                                pt={2}
                                                color={theme.palette.info.dark}
                                                textAlign={"center"}
                                                variant="h6"
                                                fontSize={"16px !important"}
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    width: "100%",
                                                }}
                                            >
                                                {capitalizeFirstLetter(item?.name)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Typography>Chưa có ấn phẩm</Typography>
                        </Box>
                    )}

                    <Grid item xs={12}>
                        {data?.data?.meta && Object.keys(data?.data?.meta)?.length > 0 && (
                            <PaginationForm defaultLimit={_limitDisplay} pagination={data?.data?.meta} />
                        )}
                    </Grid>
                </Grid>

                {openConfirmDialog && (
                    <ConfirmDeleteDialog
                        key={"delete"}
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        onConfirm={handleConfirmDelete}
                        title="Xác nhận xóa thư viện"
                        description={`Bạn có chắc chắn muốn xóa "${publicationsToDelete?.name}" ?`}
                    />
                )}
                {openConfirmSoftDeleteMultiple && (
                    <ConfirmDeleteDialog
                        key={"deleteMultiple"}
                        open={openConfirmSoftDeleteMultiple}
                        onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                        onConfirm={handleConfirmSoftDeleteMultiple}
                        title="Xác nhận xóa các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn xóa?`}
                    />
                )}

                {selectedEditIsLink?.isLink === true ? (
                    <ConfirmDeleteDialog
                        key={"isUnLink"}
                        open={openLink}
                        onClose={() => setOpenLink(false)}
                        onConfirm={handleChangeShareConnect}
                        title="Xác nhận hủy chia sẻ?"
                        description={`Bạn có chắc chắn muốn hủy?`}
                    />
                ) : (
                    <ConfirmDeleteDialog
                        key={"isLink"}
                        open={openLink}
                        onClose={() => setOpenLink(false)}
                        onConfirm={handleChangeShareConnect}
                        title="Xác nhận liên thông?"
                        description={`Bạn có chắc chắn muốn chia sẻ?`}
                    />
                )}
                {selectedEditIsPublic?.isPublic === true ? (
                    <ConfirmDeleteDialog
                        key={"isUnPublic"}
                        open={openPublic}
                        onClose={() => setOpenPublic(false)}
                        onConfirm={handleChangePublic}
                        title="Xác nhận hủy chia sẻ lên thư viện?"
                        description={`Bạn có chắc chắn muốn hủy?`}
                    />
                ) : (
                    <ConfirmDeleteDialog
                        key={"isPublic"}
                        open={openPublic}
                        onClose={() => setOpenPublic(false)}
                        onConfirm={handleChangePublic}
                        title="Xác nhận chia sẻ thư viện?"
                        description={`Bạn có chắc chắn muốn chia sẻ?`}
                    />
                )}

                {openViewDetails && (
                    <PublicationsDetailsDialog
                        open={openViewDetails}
                        onClose={handleCloseViewDetails}
                        publications={publicationsDetails}
                    />
                )}
            </MainCard>
        </div>
    );
};
export default PublicationsPage;
