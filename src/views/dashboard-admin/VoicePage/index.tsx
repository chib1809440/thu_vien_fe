import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconTrash } from "@tabler/icons";
import { IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { useFetchTypeVoice } from "../../../hooks/services/type-voice/type-voice-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { useDeleteSoftManyVoice, useDeleteSoftVoice } from "../../../hooks/services/voice/voice-mutation";
import { useFetchVoice, useReFetchVoice } from "../../../hooks/services/voice/voice-query";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TPublications } from "../../../types/models/publications.type";
import { TTypeVoice } from "../../../types/models/type-voice";
import { TVoice } from "../../../types/models/voice";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import { statusVoiceImage } from "../../../utils/constants.utils";
import usePermission from "../../../utils/hasPermission";
import { getLabelFromOptions, parserParams } from "../../../utils/object";
import FilterByItems from "../PublicationsPage/ui-components/FilterByItems";


const VoicePage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const [barcodeSearch, setBarcodeSearch] = useState("");
    const [selectedTypeVoice, setSelectedTypeVoice] = useState(0);

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
                { compare: 0, target: { typeVoiceId: selectedTypeVoice } },
            ]),
        [search, selectedTypeVoice]
    );

    const { data, isLoading, isFetching } = useFetchVoice({
        limit,
        page,
        ...filter,
    });
    const { data: typeVoiceData } = useFetchTypeVoice();
    const mutationSoftDelete = useDeleteSoftVoice();
    const mutationSoftDeleteMany = useDeleteSoftManyVoice();
    const revalidate = useReFetchVoice();
    const { hasPermission } = usePermission();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [voiceToDelete, setVoiceToDelete] = useState<TVoice | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const handleOpenConfirmDialog = (row: TVoice) => {
        setVoiceToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (voiceToDelete) {
            mutationSoftDelete.mutate(voiceToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa voice thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
    };

    // loc
    const handleTypeVoiceFilterChange = (event) => {
        setSelectedTypeVoice(event.target.value);
    };

    const columns: TColumn<TVoice>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên voice",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 150 },
                render: (row) => row?.name?.replace(/\.mp3$/, "") || "",
            },
            {
                id: "type",
                disablePadding: "none",
                label: "Loại",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                Loại voice: <Typography ml={1} fontWeight={600}>{(row.typeVoiceId as TTypeVoice)?.name}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                Loại hội thoại: <Typography ml={1} fontWeight={600}>{getLabelFromOptions(statusVoiceImage, row?.isPrivate)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                TT: <Typography ml={1} fontWeight={600}>{row?.order}</Typography>
                            </Box>
                        </Box>
                    );
                },
            },
            {
                id: "publicationId",
                disablePadding: "none",
                label: "Thông tin ấn phẩm tranh",
                align: "left",
                sxRow: {
                    px: 4,
                    maxWidth: 300,
                },
                render: (row) => {
                    return (
                        <>
                            {
                                (row?.publicationId as TPublications)?.name && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        Tên ấn phẩm: <Typography ml={1} fontWeight={600}>{(row?.publicationId as TPublications)?.name}</Typography>
                                    </Box>
                                )
                            }
                            {
                                (row?.publicationId as TPublications)?.barcode && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        Barcode: <Typography ml={1} fontWeight={600}>{(row?.publicationId as TPublications)?.barcode}</Typography>
                                    </Box>
                                )
                            }
                            {/* {
                                hasPermission([
                                    { resource: "voices", action: "manage" },
                                    { resource: "voices", action: "update" },
                                ]) && (row?.createBy === userId) && (
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
                            } */}


                        </>
                    );
                },
            },
            // {
            //     id: "isLink",
            //     disablePadding: "none",
            //     label: "Liên thông",
            //     align: "center",
            //     sxRow: {
            //         px: 3,
            //         maxWidth: 100,
            //     },
            //     render: (row) => {
            //         return (
            //             <Switch
            //                 checked={row?.isLink}
            //                 value={row?.isLink}
            //                 onChange={(event) =>
            //                     handleChangeShareConnect(row, event.target.checked)
            //                 }
            //                 disabled={hasPermission([
            //                     { resource: "voices", action: "manage" },
            //                     { resource: "voices", action: "update" },
            //                 ]) ? false : true}
            //             />
            //         );
            //     },
            // },
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
                                    { resource: "voices", action: "manage" },
                                    { resource: "voices", action: "delete" },
                                ]) &&
                                <IconTrash
                                    size={20}
                                    stroke={1.5}
                                    onClick={() => handleOpenConfirmDialog(row)}
                                />
                            }

                        </Box>
                    );
                },
            },
        ],
        [handleOpenConfirmDialog]
    );

    const handleCheckedDelete = useCallback((row: TVoice, checked: boolean) => {
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
        return hasPermission([
            { resource: "voices", action: "manage" },
            { resource: "voices", action: "delete" },
        ]) ? [
            {
                label: "Xóa các dữ liệu vào thùng rác",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý voice"
                mainProfile="Danh sách voice"
                link="/quan-ly-danh-muc/voice"
            />

            <MainCard>
                <Stack spacing={2} sx={{
                    paddingLeft: { xs: 0, sm: 0, md: 4 },
                    paddingBottom: { xs: 2, sm: 2 },
                    width: '100%'
                }}>
                    <Box display="flex" flexWrap="wrap">
                        {
                            hasPermission([
                                { resource: "voices", action: "manage" },
                                { resource: "voices", action: "delete" },
                            ]) &&
                            <Box>
                                <Link to="/quan-ly-danh-muc/danh-sach-xoa-voice" style={{ textDecoration: 'none' }}>
                                    <StyledButton
                                        sx={{ background: "#de524a", color: "white" }}
                                        size="small"
                                        startIcon={<IconTrash stroke={2} />}
                                        variant="contained"
                                    >
                                        Thùng rác
                                    </StyledButton>
                                </Link>
                            </Box>
                        }
                    </Box>
                </Stack>

                <ActionsForm
                    actions={actionMenus}
                    barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch}
                />

                <FilterByItems
                    selectedTypeVoice={selectedTypeVoice}
                    handleTypeVoiceFilterChange={handleTypeVoiceFilterChange}
                    typeVoiceData={typeVoiceData}
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
                {
                    openConfirmDialog &&
                    <ConfirmDeleteDialog
                        key={"delete"}
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        onConfirm={handleConfirmDelete}
                        title="Xác nhận xóa?"
                        description={`Bạn có chắc chắn muốn xóa voice giọng"${(voiceToDelete?.typeVoiceId as TTypeVoice)?.name}" ?`}
                    />
                }

                {
                    openConfirmSoftDeleteMultiple &&
                    <ConfirmDeleteDialog
                        key={"deleteMultiple"}
                        open={openConfirmSoftDeleteMultiple}
                        onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                        onConfirm={handleConfirmSoftDeleteMultiple}
                        title="Xác nhận xóa các mục đã chọn?"
                        description={`Bạn có chắc chắn muốn xóa?`}
                    />
                }
            </MainCard>
        </div>
    );
};
export default VoicePage;