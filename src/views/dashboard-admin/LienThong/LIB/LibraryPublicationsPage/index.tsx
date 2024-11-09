import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IconBook } from "@tabler/icons";
import { IconEye, IconFileWord, IconPdf, IconPhoto, IconPlus, IconPlusMinus, IconPresentation, IconVideo } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import ActionsForm from "../../../../../components/custom/form/ActionForm";
import TableList from "../../../../../components/custom/table-list/TableList";
import { useFetchAuthorLink } from "../../../../../hooks/services/author/author-query";
import { useFetchCategoryLink } from "../../../../../hooks/services/category/category-query";
import { useFetchMaterialLink } from "../../../../../hooks/services/material/material-query";
import { useFetchPublicationsLink } from "../../../../../hooks/services/publications/publications-query";
import { useFetchPublisherLink } from "../../../../../hooks/services/publisher/publisher-query";
import useQueryString from "../../../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../../../types/common/table";
import { TPublications } from "../../../../../types/models/publications.type";
import IBreadcrumsCustom from "../../../../../ui-component/breadcrums";
import MainCard from "../../../../../ui-component/cards/MainCard";
import { statusOptions, typeOptions } from "../../../../../utils/constants.utils";
import { getLabelFromOptions, parserParams } from "../../../../../utils/object";
import FilterByItems from "../../../PublicationsPage/ui-components/FilterByItems";
import PublicationsDetailsDialog from "../../../PublicationsPage/ui-components/PublicationsDetailsDialog";
import { TLibrary } from "../../../../../types/models/library.type";
import { useFetchLibrariesFromGroup } from "../../../../../hooks/services/group/group-query";
import { capitalizeFirstLetter } from "../../../../../helpers/capitalizeFirstLetter";
import { useDispatch, useSelector } from "react-redux";
import { CreatePublication } from "../../../../../types/models/loanSlip.type";
import { addItem } from "../../../../../store/slices/cartLoanSlip";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../contexts/JWTContext";

const LibraryPublicationsPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const [selectedLibrary, setSelectedLibrary] = useState(0);
    const [selectedMaterial, setSelectedMaterial] = useState(0);
    const [selectedPublications, setSelectedPublications] = useState(0);
    const [selectedAuthor, setSelectedAuthor] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedPublisher, setSelectedPublisher] = useState(0);
    const [barcodeSearch, setBarcodeSearch] = useState("");
    const items = useSelector((state: { cartLoanSlip: { items: CreatePublication[] } }) => state.cartLoanSlip.items);
    const { logout, user } = useAuth();

    const libraryId = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.libraryId;
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
            barcodeSearch,
            search,
            selectedLibrary
        ]
    );
    const { data, isLoading, isFetching } = useFetchPublicationsLink({
        limit,
        page,
        ...filter,
    });
    const { data: libraryData } = useFetchLibrariesFromGroup();
    const { data: categoryData } = useFetchCategoryLink();
    const { data: materialData } = useFetchMaterialLink();
    const { data: authorData } = useFetchAuthorLink();
    const { data: publisherData } = useFetchPublisherLink();
    const [openViewDetails, setOpenViewDetails] = useState(false);
    const [publicationsDetails, setPublicationsDetails] = useState<TPublications | null>(null);
    const dispatch = useDispatch();
    const handleViewDetails = (row: TPublications) => {
        setPublicationsDetails(row);
        setOpenViewDetails(true);
    };

    const handleCloseViewDetails = () => {
        setOpenViewDetails(false);
        setPublicationsDetails(null);
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

    const handleLibraryFilterChange = (event) => {
        setSelectedLibrary(event.target.value);
    };
    const handleAddItem = (item: TPublications & { libraryDetails?: TLibrary }) => {
        if (item.type === "ấn phẩm mềm") {
            toast.warning(`Không thể mượn ấn phẩm mềm`, {
                toastId: '2',
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
        const duplicateItem = items.find(cartItem => cartItem.libraryId === createPublication.libraryId);

        if (!duplicateItem && items.length > 0) {
            const item = items[0];
            toast.warning(`Chi thêm sách của một thư viện là ${item.libraryName}`, {
                toastId: '1',
                position: "bottom-right", // Đặt vị trí ở góc dưới bên phải
                autoClose: 3000, // Thời gian tự động đóng (ms)
                hideProgressBar: false, // Hiện thanh tiến trình
                closeOnClick: true, // Cho phép đóng thông báo bằng cách nhấp
                pauseOnHover: true, // Tạm dừng khi di chuột
                draggable: true, // Cho phép kéo thả để đóng thông báo

            });
            return;
        }
        // Dispatch action để thêm item vào giỏ hàng
        dispatch(addItem(createPublication));
        toast.success("Thêm sản phẩm vào phiếu mượn thành công", {
            position: "bottom-right", // Đặt vị trí ở góc dưới bên phải
            autoClose: 3000, // Thời gian tự động đóng (ms)
            hideProgressBar: false, // Hiện thanh tiến trình
            closeOnClick: true, // Cho phép đóng thông báo bằng cách nhấp
            pauseOnHover: true, // Tạm dừng khi di chuột
            draggable: true, // Cho phép kéo thả để đóng thông báo
        })
    };
    const columns: TColumn<TPublications & { libraryDetails?: TLibrary }>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên ấn phẩm",
                align: "left",
                sxRow: { px: 3, maxWidth: 150 },
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
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                Thư viện:  <Typography textTransform={"capitalize"} ml={1} fontWeight={600}>{(row?.libraryDetails as TLibrary)?.name}</Typography>
                            </Box>

                            {
                                row?.barcode && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        Barcode: <Typography ml={1} fontWeight={600}>{row?.barcode}</Typography>
                                    </Box>
                                )
                            }
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                Trạng thái: <Typography ml={1} fontWeight={600}>{getLabelFromOptions(statusOptions, row?.status)}</Typography>
                            </Box>
                            <Box mt={1}>
                                {
                                    (!row?.mimetype || (row?.mimetype === "image/jpeg" ||
                                        row?.mimetype === "image/png" ||
                                        row?.mimetype === "image/gif" ||
                                        row?.mimetype === "image/bmp" ||
                                        row?.mimetype === "image/webp") && row?.type === "ấn phẩm cứng") && (
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
                                        row?.mimetype === "image/webp") && row?.type === "ấn phẩm mềm" && (
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
                                size={25}
                                stroke={1.5}
                                onClick={() => handleViewDetails(row)}
                            />
                            {
                                row?.libraryDetails && row.libraryDetails._id !== libraryId && (
                                    <IconPlus
                                        size={25}
                                        stroke={1.5}
                                        onClick={() => handleAddItem(row)}
                                    />
                                )
                            }
                        </Box>
                    );
                },
            },
        ],
        [handleViewDetails]
    );


    const actionMenus = useMemo((): TMenuOption[] => {
        return [];
    }, []);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Chia sẻ ấn phẩm"
                mainProfile="Danh sách ấn phẩm"
                link="/lien-thong"
            />

            {openViewDetails && (
                <PublicationsDetailsDialog
                    open={openViewDetails}
                    onClose={handleCloseViewDetails}
                    publications={publicationsDetails}
                    openLT={true}
                />
            )}

            <MainCard>

                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                    selectedLibrary={selectedLibrary}
                    handleLibraryFilterChange={handleLibraryFilterChange}
                    libraryData={libraryData?.data?.result?.libraries}
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
                    columns={columns}
                    rows={data?.data?.result || []}
                    isLoading={isLoading || isFetching}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />
            </MainCard>
        </div>
    );
};
export default LibraryPublicationsPage;
