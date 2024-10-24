import { Box, Stack } from "@mui/material";
import { IconLink } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../../../components/custom/form/ActionForm";
import TableList from "../../../../../components/custom/table-list/TableList";
import StyledButton from "../../../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../../../components/default/dialog/ConfirmDeleteDialog";
import { useAddAuthorPullLink } from "../../../../../hooks/services/author/author-mutation";
import { useFetchAuthorLink, useReFetchAuthorLink } from "../../../../../hooks/services/author/author-query";
import { useFetchLibrariesFromGroup } from "../../../../../hooks/services/group/group-query";
import useQueryString from "../../../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../../../types/common/table";
import { TAuthor } from "../../../../../types/models/author";
import { TLibrary } from "../../../../../types/models/library.type";
import IBreadcrumsCustom from "../../../../../ui-component/breadcrums";
import MainCard from "../../../../../ui-component/cards/MainCard";
import { parserParams } from "../../../../../utils/object";


const LibAuthorPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const [selectedLibrary, setSelectedLibrary] = useState(0);

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
                { compare: 0, target: { libraryId: selectedLibrary } },
            ]),
        [
            search, selectedLibrary
        ]
    );
    const { data, isLoading } = useFetchAuthorLink({
        limit,
        page,
        ...filter,
    });
    const { data: libraryData } = useFetchLibrariesFromGroup();
    const mutationPullLink = useAddAuthorPullLink();
    const revalidate = useReFetchAuthorLink();
    const [openConfirmPullLinkMultiple, setOpenConfirmPullLinkMultiple] = useState(false);
    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [authorPullLink, setAuthorPullLink] = useState<TAuthor | null>(null);
    const [openConfirmPullLink, setOpenConfirmPullLink] = useState(false);

    // liên thông 1
    const handleOneConfirmPullLink = (row: TAuthor) => {
        setAuthorPullLink(row);
        setOpenConfirmPullLink(true);
    };

    const handleConfirmPullLink = () => {
        if (authorPullLink) {
            mutationPullLink.mutate({
                isPublic: false,
                note: "",
                ids: [authorPullLink?._id]
            }, {
                onSuccess: () => {
                    revalidate({ limit, page, search });
                    toast.success('Liên thông thành công.');
                    setOpenConfirmPullLink(false);
                },
                onError: (error: any) => {
                    toast.error(error.message);
                },
            });
        }
    };

    const handleCloseConfirmRestoreDialog = () => {
        setOpenConfirmPullLink(false);
    };

    // lọc
    const handleLibraryFilterChange = (event) => {
        setSelectedLibrary(event.target.value);
    };

    const columns: TColumn<TAuthor & { libraryDetails?: TLibrary }>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên tác giả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "libraryDetails",
                disablePadding: "none",
                label: "Thư viện",
                sxRow: { paddingRight: 4 },
                render: (row) => (row.libraryDetails as TLibrary)?.name,
            },
            {
                id: "action",
                disablePadding: "none",
                align: "center",
                label: "Liên thông mục",
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
                            <IconLink
                                size={25}
                                stroke={1.5}
                                onClick={() => handleOneConfirmPullLink(row)}
                            />

                        </Box>
                    );
                },
            },
        ],
        [handleOneConfirmPullLink]
    );

    const handleCheckedDelete = useCallback((row: TAuthor, checked: boolean) => {
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

    // Hàm mở dialog liên thông
    const handlePullLinkMultiple = useCallback(() => {
        if (checkedDelete.length === 0) {
            toast.error("Vui lòng chọn dữ liệu để liên thông");
            return;
        }
        setOpenConfirmPullLinkMultiple(true);
    }, [checkedDelete]);

    // Hàm xác nhận liên thông nhiều ấn phẩm
    const handleConfirmPullLinkMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationPullLink.mutate({
            ids: checkedDelete,
            isPublic: false,
            note: ""
        }, {
            onSuccess: () => {
                revalidate({ limit, page, search });
                toast.success("Liên thông các mục đã chọn thành công.");
                setOpenConfirmPullLinkMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete, mutationPullLink, revalidate, limit, page, search]);

    const actionMenus = useMemo((): TMenuOption[] => {
        return [
            {
                label: "Liên thông dữ liệu đã chọn",
                icon: <IconLink size={20} stroke={1.5} />,
                onClick: handlePullLinkMultiple,
            },
        ];
    }, [handlePullLinkMultiple]);

    const handleLinkAll = useCallback(() => {
        if (data?.data?.result?.length === 0) return;

        const allCheckedIds = data.data.result.map(item => item._id);
        setCheckedDelete(allCheckedIds);
        setOpenConfirmPullLinkMultiple(true);
    }, [data]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Chia sẻ danh mục"
                mainProfile="Danh sách tác giả"
                link="/lien-thong/chia-se-danh-muc/tac-gia"
            />

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
                                startIcon={<IconLink stroke={2} />}
                                variant="contained"
                                onClick={handleLinkAll}
                            >
                                Liên thông tất cả
                            </StyledButton>
                        </Box>
                    </Box>
                </Stack>

                <ActionsForm actions={actionMenus}
                    selectedLibrary={selectedLibrary}
                    handleLibraryFilterChange={handleLibraryFilterChange}
                    libraryData={libraryData?.data?.result[0]?.libraries}
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
                    key={"pullLink"}
                    open={openConfirmPullLink}
                    onClose={handleCloseConfirmRestoreDialog}
                    onConfirm={handleConfirmPullLink}
                    title="Xác nhận liên thông?"
                    description={`Bạn có chắc chắn muốn liên thông mục "${authorPullLink?.name}"?`}
                />

                <ConfirmDeleteDialog
                    key={"pullLinkMultiple"}
                    open={openConfirmPullLinkMultiple}
                    onClose={() => setOpenConfirmPullLinkMultiple(false)}
                    onConfirm={handleConfirmPullLinkMultiple}
                    title="Xác nhận liên thông các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn liên thông các mục đã chọn?`}
                />
            </MainCard>
        </div>
    );
};
export default LibAuthorPage;