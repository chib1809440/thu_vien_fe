import { Button, Chip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconEye, IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import groupService from "../../../_apis/services/group.service";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { CsFlexRowBetween } from "../../../components/default/flex";
import { useAuth } from "../../../contexts/JWTContext";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useAddGroup, useDeleteGroup, useDeleteManyGroup, useEditGroup } from "../../../hooks/services/group/group-mutation";
import { useFetchGroup, useReFetchGroup } from "../../../hooks/services/group/group-query";
import { useFetchLibrary, useReFetchLibrary } from "../../../hooks/services/library/library-query";
import { useAddRequestGroup } from "../../../hooks/services/request-group/request-group-mutation";
import { useFetchRequestGroup, useFetchRequestGroupFromAdmin, useReFetchRequestGroup, useReFetchRequestGroupFromAdmin } from "../../../hooks/services/request-group/request-group-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { TGroup, TGroupCreate } from "../../../types/models/group.type";
import { TLibrary } from "../../../types/models/library.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import usePermission from "../../../utils/hasPermission";
import FormAddEditGroup from "./ui-components/FormAddEditGroup";
import GroupDetailsDialog from "./ui-components/GroupDetailsDialog";

const GroupPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const groupId = "";

    const { data, isLoading, isFetching } = useFetchGroup({ limit, page, search });
    const { data: libsGroup } = useFetchLibrary({ groupId });
    const { data: listRequestGroupFromAdmin } = useFetchRequestGroupFromAdmin();
    const [combinedLibraries, setCombinedLibraries] = useState<TLibrary[]>([]);

    const mutationAdd = useAddGroup();
    const mutationEdit = useEditGroup();
    const mutationDelete = useDeleteGroup();
    const mutationDeleteMany = useDeleteManyGroup();
    const revalidate = useReFetchGroup();
    const revalidateLibs = useReFetchLibrary();
    const mutationJoinGroup = useAddRequestGroup();
    const revalidateJoinGroup = useReFetchRequestGroup();
    const revalidateRequestGroupFromAdmin = useReFetchRequestGroupFromAdmin();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TGroup | null>(null);
    const [selectedJoin, setSelectedJoin] = useState<TGroup | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmJoinDialog, setOpenConfirmJoinDialog] = useState(false);
    const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<TGroup | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);
    const [openViewDetails, setOpenViewDetails] = useState(false);
    const [groupDetails, setGroupDetails] = useState<TGroup | null>(null);

    const { user, refreshUser } = useAuth();
    const { hasPermission } = usePermission();
    console.log(user);


    const libId = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.libraryDetail?._id;
    }, [user]);

    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);
    const { data: requestGroup } = useFetchRequestGroup();

    // Chỉ sử dụng requestGroup nếu userRole là "Owner"
    const requestGroupData = userRole === "Owner" ? requestGroup : null;

    const addGroup = () => {
        setOpenAddEdit(true);
    };

    const handleEditGroup = (row: TGroup) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TGroupCreate) => {
        const payload = {
            ...values,
            libraries: values.libraries.map((t: any) => t?._id),
        };

        if (selectedEdit) {
            mutationEdit.mutate(
                { ...payload, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        revalidate();
                        revalidateLibs();
                        toast.success('Chỉnh sửa thành công.');
                        handleClose();
                    },
                }
            );
            return;
        }

        mutationAdd.mutate(payload, {
            onSuccess: (data) => {
                revalidate();
                revalidateLibs();
                toast.success('Thêm thành công.');
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TGroup) => {
        setGroupToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (groupToDelete) {
            mutationDelete.mutate(groupToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa nhóm thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };
    const handleCloseConfirmLeaveDialog = () => {
        setOpenConfirmLeaveDialog(false);
    };
    const handleCloseConfirmJoinDialog = () => {
        setOpenConfirmJoinDialog(false);
    };

    const handleViewDetails = (row: TGroup) => {
        setGroupDetails(row);
        setOpenViewDetails(true);
    };

    const handleCloseViewDetails = () => {
        setOpenViewDetails(false);
        setGroupDetails(null);
    };

    const handleLeaveGroup = async () => {
        const response = await groupService.leaveGroup();
        revalidate();
        revalidateLibs();
        toast.success("Rời nhóm thành công.");
        setOpenConfirmLeaveDialog(false);
        // await refreshUser();
        return response;
        
    }
    const handleOpenLeaveGroup = (row: TGroup) => {
        setOpenConfirmLeaveDialog(true);
    }

    const handleOpenJoinGroup = (row: TGroup) => {
        setSelectedJoin(row);
        setOpenConfirmJoinDialog(true);
    }
    const handleJoinGroup = (row: TGroup) => {
        mutationJoinGroup.mutate(row._id, {
            onSuccess: () => {
                revalidateJoinGroup();
                revalidateRequestGroupFromAdmin();
                setOpenConfirmJoinDialog(false);
                toast.success('Yêu cầu tham gia nhóm thành công.');
            },
        });
    }

    const columns: TColumn<TGroup>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên nhóm",
                align: "left",
                sxRow: { paddingRight: 4, maxWidth: 200 },
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
                            {row.mainLibrary ? capitalizeFirstLetter(row.mainLibrary.name) : "Chưa có trưởng có trưởng nhóm"}
                        </Box>
                    );
                },
            },
            {
                id: "libraries",
                disablePadding: "none",
                label: "Thư viện trong nhóm",
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
                                row.libraries && row.libraries.length > 0
                                    ? (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {row.libraries.slice(0, 2).map((lib) => (
                                                <Chip
                                                    key={lib._id}
                                                    label={capitalizeFirstLetter(lib.name)}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                            {row.libraries.length > 2 && (
                                                <Chip
                                                    label={`+${row.libraries.length - 2} thư viện khác`}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            )}
                                        </Box>
                                    )
                                    : "Chưa có thư viện"
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
                    const groupIdsRequest = listRequestGroupFromAdmin?.data?.result?.map(item => (item?.groupId)?._id);
                    const isGroupRequested = groupIdsRequest?.some((item) => item === row?._id);
                    const canManageGroups = hasPermission([
                        { resource: "all", action: "manage" },
                        { resource: "groups", action: "manage" },
                        { resource: "groups", action: "update" },
                    ]);
                    const canDeleteGroup = hasPermission([
                        { resource: "all", action: "manage" },
                        { resource: "groups", action: "manage" },
                        { resource: "groups", action: "delete" },
                    ]);
                    const groupLibraryIds = data?.data?.result?.flatMap(group =>
                        group?.libraries?.map((lib: TLibrary) => lib._id) || []
                    ) || [];

                    const shouldShowLeaveButton = libId && groupLibraryIds.includes(libId);

                    const renderActions = () => (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                            <IconEye size={20} stroke={1.5} onClick={() => handleViewDetails(row)} />

                            {canManageGroups && (
                                <IconPencil size={20} stroke={1.5} onClick={() => handleEditGroup(row)} />
                            )}

                            {canDeleteGroup && (
                                <IconTrash size={20} stroke={1.5} onClick={() => handleOpenConfirmDialog(row)} />
                            )}

                            {!shouldShowLeaveButton && userRole === "Admin" && (
                                <StyledButton
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleOpenJoinGroup(row)}
                                    sx={{ background: isGroupRequested ? "#53a828" : "#3078ec", color: "white" }}
                                    disabled={isGroupRequested}
                                >
                                    {isGroupRequested ? "Đã Yêu cầu" : "Yêu cầu vào nhóm"}
                                </StyledButton>
                            )}

                            {shouldShowLeaveButton && userRole === "Admin" && (
                                <StyledButton
                                    color="primary"
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleOpenLeaveGroup(row)}
                                >
                                    Rời nhóm
                                </StyledButton>
                            )}
                        </Box>
                    );
                    return renderActions();
                },
            },
        ],
        [handleViewDetails, handleEditGroup, handleOpenConfirmDialog, handleOpenLeaveGroup, handleOpenJoinGroup]
    );

    const handleCheckedDelete = useCallback((row: TGroup, checked: boolean) => {
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
        setOpenConfirmDeleteMultiple(true);
    }, [checkedDelete]);

    const handleConfirmDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate();
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);

    const actionMenus = useMemo((): TMenuOption[] => {
        return hasPermission([
            { resource: "all", action: "manage" }
        ]) ? [
            {
                label: "Xóa các dữ liệu đã chọn",
                icon: <IconTrashXFilled size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ] : [];
    }, [handleDeleteMultiple]);

    const initialValues = useMemo((): TGroupCreate => {
        if (selectedEdit) {
            const libraries = [];

            if (selectedEdit?.libraries?.length === 0 && selectedEdit?.mainLibrary) {
                libraries.push(selectedEdit?.mainLibrary);
            } else {
                libraries.push(...selectedEdit?.libraries);
            }

            return {
                mainLibrary: selectedEdit.mainLibrary?._id || null,
                name: selectedEdit.name,
                libraries,
            };
        }

        return {
            mainLibrary: "",
            name: "",
            libraries: [],
        };
    }, [selectedEdit]);

    useEffect(() => {
        const libraries = [
            ...(libsGroup?.data?.result || []),
            ...(initialValues?.libraries || [])
        ].filter((item): item is TLibrary => typeof item !== 'string' && item !== null);

        setCombinedLibraries(libraries);
    }, [libsGroup, initialValues]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý nhóm"
                mainProfile="Danh sách nhóm"
                link="/he-thong/quan-ly-nhom"
            />

            {openAddEdit && (
                <FormAddEditGroup
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                    libOptions={combinedLibraries}
                    userRole={userRole}
                />
            )}

            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb: 2 }}>
                            {
                                hasPermission([
                                    { resource: "all", action: "manage" },
                                    { resource: "groups", action: "manage" },
                                    { resource: "groups", action: "create" },
                                ]) && <StyledButton
                                    color="primary"
                                    size="small"
                                    startIcon={<IconPlus stroke={2} />}
                                    variant="contained"
                                    onClick={addGroup}
                                >
                                    Thêm mới
                                </StyledButton>
                            }

                            {
                                userRole === "Owner" && (

                                    <Link to="/he-thong/quan-ly-tham-gia-nhom" style={{ textDecoration: 'none' }}>
                                        <Button
                                            sx={{
                                                background: "#a36e21",
                                                color: "white",
                                                marginLeft: "10px",
                                                paddingTop: 1,
                                                paddingBottom: 1,
                                                position: "relative",
                                                borderRadius: "8px",
                                                "&:hover": {
                                                    background: "#a36e21",
                                                }
                                            }}
                                            size="small"
                                            variant="contained"
                                        >
                                            Danh sách yêu cầu vào nhóm
                                            {requestGroupData?.data?.meta?.itemCount > 0 && (
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        top: "-10px",
                                                        right: "-10px",
                                                        backgroundColor: "#f44336",
                                                        color: "white",
                                                        borderRadius: "50%",
                                                        width: 25,
                                                        height: 25,
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    {requestGroupData?.data?.meta?.itemCount}
                                                </span>
                                            )}
                                        </Button>
                                    </Link>
                                )
                            }
                        </Box>
                    </CsFlexRowBetween>
                </Stack>

                <ActionsForm actions={actionMenus} />

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
                    description={`Bạn có chắc chắn muốn xóa "${groupToDelete?.name}" ?`}
                />
                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmDeleteMultiple}
                    onClose={() => setOpenConfirmDeleteMultiple(false)}
                    onConfirm={handleConfirmDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />

                <GroupDetailsDialog
                    open={openViewDetails}
                    onClose={handleCloseViewDetails}
                    group={groupDetails}
                />

                 <ConfirmDeleteDialog
                    key={"leave"}
                    open={openConfirmLeaveDialog}
                    onClose={handleCloseConfirmLeaveDialog}
                    onConfirm={handleLeaveGroup}
                    title="Xác nhận rời nhóm"
                    description={`Bạn có chắc chắn muốn rời nhóm ?`}
                />
                 <ConfirmDeleteDialog
                    key={"join"}
                    open={openConfirmJoinDialog}
                    onClose={handleCloseConfirmJoinDialog}
                    onConfirm={()=>handleJoinGroup(selectedJoin)}
                    title="Xác nhận yêu cầu vào nhóm"
                    description={`Bạn có chắc chắn muốn yêu cầu nhóm ?`}
                />
            </MainCard>
        </div>
    );
};
export default GroupPage;