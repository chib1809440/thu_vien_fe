import { Chip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconArrowBack } from "@tabler/icons";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAuth } from "../../../contexts/JWTContext";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useEditRequestGroup } from "../../../hooks/services/request-group/request-group-mutation";
import { useFetchRequestGroup, useReFetchRequestGroup } from "../../../hooks/services/request-group/request-group-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TGroup } from "../../../types/models/group.type";
import { TLibrary } from "../../../types/models/library.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";

const JoinGroup = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const { data, isLoading, isFetching } = useFetchRequestGroup({ limit, page, search });
    const mutationApproveJoinGroup = useEditRequestGroup();
    const revalidateJoinGroup = useReFetchRequestGroup();
    const [selectedEdit, setSelectedEdit] = useState<TGroup | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const { refreshUser } = useAuth();

    const handleApproveJoinGroup = (row: TGroup) => {
        setSelectedEdit(row);
        setOpenConfirmDialog(true);
    }

    const handleSubmit = (values: TGroup) => {
        console.log(values);
        mutationApproveJoinGroup.mutate(
            { _id: values._id },
            {
                onSuccess: async () => {
                    revalidateJoinGroup();
                    // await refreshUser();
                    
                    toast.success('Đã duyệt thành công.');
                    setOpenConfirmDialog(false);
                },
            }
        );
    }

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const columns: TColumn<TGroup & { groupId?: TGroup, mainLibraryId?: TLibrary, libraryId?: TLibrary }>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên nhóm",
                align: "left",
                sxRow: { paddingRight: 4, maxWidth: 200 },
                render: (row) => (capitalizeFirstLetter((row?.groupId as TGroup)?.name)),
            },
            {
                id: "mainLibrary",
                disablePadding: "none",
                label: "Trưởng nhóm",
                sxRow: { paddingRight: 4, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                            component="span"
                            sx={{
                                display: "block",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxWidth: "100%",
                                overflow: "hidden",
                            }}
                        >
                            {row?.mainLibraryId ? capitalizeFirstLetter((row?.mainLibraryId as TGroup)?.name) : "Chưa có trưởng có trưởng nhóm"}
                        </Box>
                    );
                },
            },
            {
                id: "libraryId",
                disablePadding: "none",
                label: "Thư viện yêu cầu vào nhóm",
                sxRow: { paddingRight: 4, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                            component="span"
                            sx={{
                                display: "block",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxWidth: "100%",
                                overflow: "hidden",
                            }}
                        >
                            {
                                row?.libraryId &&
                                (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <Chip
                                            label={capitalizeFirstLetter((row?.libraryId as TLibrary)?.name)}
                                            variant="outlined"
                                            color="primary"
                                        />
                                    </Box>
                                )
                            }
                        </Box>
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
                            <StyledButton
                                sx={{ background: "#de524a", color: "white" }}
                                size="small"
                                variant="contained"
                                onClick={() => handleApproveJoinGroup(row)}
                            >
                                Duyệt yêu cầu
                            </StyledButton>

                        </Box>
                    );
                },
            },
        ],
        [handleApproveJoinGroup]
    );

    const actionMenus = useMemo((): TMenuOption[] => {
        return [];
    }, []);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý nhóm"
                mainProfile="Danh sách duyệt yêu cầu vào nhóm"
                link="/he-thong/quan-ly-nhom"
            />

            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb: 2 }}>
                            <Link to="/he-thong/quan-ly-nhom" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconArrowBack stroke={2} />}
                                    variant="contained"
                                >
                                    Trở về
                                </StyledButton>
                            </Link>
                        </Box>
                    </CsFlexRowBetween>
                </Stack>

                <ActionsForm actions={actionMenus} />

                <TableList
                    columns={columns}
                    rows={data?.data?.result || []}
                    isLoading={isLoading || isFetching}
                    keyChecked="_id"
                    pagination={data?.data?.meta}
                />

                <ConfirmDeleteDialog
                    key={"approve"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={() => handleSubmit(selectedEdit)}
                    title="Xác nhận tham gia nhóm"
                    description={`Bạn có chắc chắn muốn duyệt ?`}
                />
            </MainCard>
        </div>
    );
};
export default JoinGroup;