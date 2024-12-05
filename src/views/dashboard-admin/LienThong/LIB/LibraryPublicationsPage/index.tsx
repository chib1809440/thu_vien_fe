import { Button, Grid, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { IconBook } from "@tabler/icons";
import { IconFileDescription, IconFileWord, IconPdf, IconPhoto, IconPresentation, IconShoppingBag, IconVideo } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageCard from "../../../../../components/custom/card/ImageCard";
import ActionsForm from "../../../../../components/custom/form/ActionForm";
import PaginationForm from "../../../../../components/custom/form/PaginationForm";
import StyledIconButton from "../../../../../components/default/button/StyledIconButton";
import { capitalizeFirstLetter } from "../../../../../helpers/capitalizeFirstLetter";
import { useFetchAuthorLink } from "../../../../../hooks/services/author/author-query";
import { useFetchCategoryLink } from "../../../../../hooks/services/category/category-query";
import { useFetchLibrariesFromGroup } from "../../../../../hooks/services/group/group-query";
import { useFetchMaterialLink } from "../../../../../hooks/services/material/material-query";
import { useFetchPublicationsLink } from "../../../../../hooks/services/publications/publications-query";
import { useFetchPublisherLink } from "../../../../../hooks/services/publisher/publisher-query";
import useQueryString from "../../../../../hooks/services/useQueryString";
import { addItem } from "../../../../../store/slices/cartLoanSlip";
import { TMenuOption } from "../../../../../types/common/table";
import { TLibrary } from "../../../../../types/models/library.type";
import { CreatePublication } from "../../../../../types/models/loanSlip.type";
import { TPublications } from "../../../../../types/models/publications.type";
import IBreadcrumsCustom from "../../../../../ui-component/breadcrums";
import MainCard from "../../../../../ui-component/cards/MainCard";
import { colorType, typeOptions } from "../../../../../utils/constants.utils";
import { parserParams } from "../../../../../utils/object";
import FilterByItems from "../../../PublicationsPage/ui-components/FilterByItems";
import PublicationsDetailsDialog from "../../../PublicationsPage/ui-components/PublicationsDetailsDialog";
import { useAuth } from "../../../../../contexts/JWTContext";
import { Role } from "../../../../../interfaces/role";

const LibraryPublicationsPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const theme = useTheme();

    const [selectedLibrary, setSelectedLibrary] = useState(0);
    const [selectedMaterial, setSelectedMaterial] = useState(0);
    const [selectedPublications, setSelectedPublications] = useState(0);
    const [selectedAuthor, setSelectedAuthor] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedPublisher, setSelectedPublisher] = useState(0);
    const [barcodeSearch, setBarcodeSearch] = useState("");
    const items = useSelector((state: { cartLoanSlip: { items: CreatePublication[] } }) => state.cartLoanSlip.items);
    const { user } = useAuth();

    const libraryId = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.libraryId;
    }, [user]);

    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return (_user?.data?.roleId as Role)?.name;
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
    const filterByLibId = useMemo(
        () =>
            parserParams([
                { compare: 0, target: { libraryId: selectedLibrary } },
            ]),
        [selectedLibrary]
    );

    const { data: libraryData } = useFetchLibrariesFromGroup();
    const { data: categoryData } = useFetchCategoryLink({
        limit,
        page, ...filterByLibId
    });
    const { data: materialData } = useFetchMaterialLink({
        limit,
        page, ...filterByLibId
    });
    const { data: authorData } = useFetchAuthorLink({
        limit,
        page, ...filterByLibId
    });
    const { data: publisherData } = useFetchPublisherLink({
        limit,
        page, ...filterByLibId
    });
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
            toast.warning(`Chỉ thêm sách của một thư viện là ${item.libraryName}`, {
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

    const actionMenus = useMemo((): TMenuOption[] => {
        return [];
    }, []);

    const dataLibPublications = data?.data?.result as (TPublications & { libraryDetails?: TLibrary })[] | [];

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
                    {...(selectedLibrary !== 0 && {
                        selectedMaterial,
                        handleMaterialFilterChange,
                        materialData,
                        selectedCategory,
                        handleCategoryFilterChange,
                        categoryData,
                        selectedAuthor,
                        handleAuthorFilterChange,
                        authorData,
                        selectedPublisher,
                        handlePublisherFilterChange,
                        publisherData,
                    })}
                />
                {/* <TableList
                    columns={columns}
                    rows={data?.data?.result || []}
                    isLoading={isLoading || isFetching}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                /> */}

                <Grid container spacing={2} sx={{ p: { xs: 0, sm: 0, md: "12px 32px" }, pt: 2 }}>
                    {
                        isLoading === false && isFetching === false && dataLibPublications.length > 0 ? (
                            dataLibPublications.map((item, index) => (
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} >
                                    <Paper sx={{ p: 2, height: "100%", border: `1px solid ${theme.palette.grey[300]}`, }} elevation={0}>
                                        <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                                            <Paper sx={{ width: "100%", position: "relative" }}>
                                                <Box onClick={() => handleViewDetails(item)}>
                                                    <ImageCard id={item._id} photo={item?.priviewImage
                                                        ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${item.priviewImage}`
                                                        : item?.path
                                                            ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${item.path}`
                                                            : ""} aspectRatio={"16/9"} objectFit="contain" />
                                                </Box>
                                                <Button
                                                    onClick={() => handleViewDetails(item)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 0,
                                                        minWidth: 35, height: 35,
                                                        // margin: "8px",
                                                        background: colorType(item?.mimetype),
                                                        boxShadow: "5px 5px 7px rgba(0.1, 0.1, 0.1, 0.1)",

                                                    }}
                                                >
                                                    {
                                                        (!item?.mimetype || [
                                                            "image/jpeg",
                                                            "image/png",
                                                            "image/gif",
                                                            "image/bmp",
                                                            "image/webp",
                                                        ].includes(item?.mimetype) && item?.type === "ấn phẩm cứng") && (
                                                            <IconBook
                                                                size={25}
                                                                stroke={1.5}
                                                                color="white"
                                                            />
                                                        )
                                                    }
                                                    {
                                                        (item?.mimetype === "application/pdf") && (
                                                            <IconPdf
                                                                size={25}
                                                                stroke={1.5}
                                                                color="white"
                                                            />
                                                        )
                                                    }
                                                    {
                                                        [
                                                            "application/msword",
                                                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                        ].includes(item?.mimetype) && (
                                                            <IconFileWord
                                                                size={25}
                                                                stroke={1.5}
                                                                color="white"
                                                            />
                                                        )
                                                    }
                                                    {
                                                        [
                                                            "video/mp4",
                                                            "video/x-matroska",
                                                            "video/webm",
                                                            "video/x-msvideo",
                                                        ].includes(item?.mimetype) && (
                                                            <IconVideo
                                                                size={25}
                                                                stroke={1.5}
                                                                color="white"
                                                            />
                                                        )
                                                    }
                                                    {
                                                        [
                                                            "application/vnd.ms-powerpoint",
                                                            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                        ].includes(item?.mimetype) && (
                                                            <IconPresentation
                                                                size={25}
                                                                stroke={1.5}
                                                                color="white"
                                                            />
                                                        )
                                                    }
                                                    {
                                                        [
                                                            "image/jpeg",
                                                            "image/png",
                                                            "image/gif",
                                                            "image/bmp",
                                                            "image/webp",
                                                        ].includes(item?.mimetype) && (
                                                            <IconPhoto
                                                                size={25}
                                                                stroke={1.5}
                                                                color="white"
                                                            />
                                                        )
                                                    }
                                                </Button>

                                                <Box>

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
                                                        {
                                                            userRole !== "Student" && item?.type === "ấn phẩm cứng" && item?.libraryDetails && item?.libraryDetails?._id !== libraryId && (
                                                                <Tooltip title={item?.status === "có sẵn" ? "Mượn ấn phẩm" : "Ấn phẩm không có sẵn"} arrow placement="top">
                                                                    <Box
                                                                        sx={{
                                                                            background: item?.status === "có sẵn" ? "green" : "gray",
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
                                                            )
                                                        }
                                                    </StyledIconButton>

                                                </Box>
                                            </Paper>
                                            <Box sx={{ display: "flex", alignItems: "flex-start", height: "100%", minHeight: "75px", width: "200px" }}>
                                                <Typography pt={2} color={theme.palette.info.dark} textAlign={"center"} variant="h6" fontSize={"16px !important"}
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        width: "100%"
                                                    }}
                                                >{capitalizeFirstLetter(item.name)}</Typography>
                                            </Box>

                                        </Box>
                                    </Paper>
                                </Grid>

                            ))) : (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                <Typography>Chưa có ấn phẩm</Typography>
                            </Box>
                        )

                    }
                    < Grid item xs={12}>
                        {data?.data?.meta && Object.keys(data?.data?.meta).length > 0 && (
                            <PaginationForm pagination={data?.data?.meta} />
                        )}
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
};
export default LibraryPublicationsPage;
