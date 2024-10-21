import { Box, Stack, Switch } from "@mui/material";
import { IconLink } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ActionsForm from "../../../../../components/custom/form/ActionForm";
import TableList from "../../../../../components/custom/table-list/TableList";
import { useAddMaterial, useDeleteSoftManyMaterial, useDeleteSoftMaterial } from "../../../../../hooks/services/material/material-mutation";
import { useFetchMaterial, useReFetchMaterial } from "../../../../../hooks/services/material/material-query";
import useQueryString from "../../../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../../../types/common/table";
import { TMaterial } from "../../../../../types/models/material";
import IBreadcrumsCustom from "../../../../../ui-component/breadcrums";
import MainCard from "../../../../../ui-component/cards/MainCard";
import { parserParams } from "../../../../../utils/object";
import StyledButton from "../../../../../components/default/button/StyledButton";


const LibPublisherPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
            ]),
        [
            search,
        ]
    );
    const { data, isLoading } = useFetchMaterial({
        limit,
        page,
        ...filter,
    });
    const mutationAdd = useAddMaterial();
    const mutationSoftDelete = useDeleteSoftMaterial();
    const mutationSoftDeleteMany = useDeleteSoftManyMaterial();
    const revalidate = useReFetchMaterial();

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState<TMaterial | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmDeleteMultiple, setOpenConfirmDeleteMultiple] = useState(false);


    const handleOpenConfirmDialog = (row: TMaterial) => {
        setMaterialToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (materialToDelete) {
            mutationSoftDelete.mutate(materialToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa dạng học liệu thành công.');
                    setOpenConfirmDialog(false);
                },
                onError: () => {
                    toast.error('Xóa dạng học liệu thất bại.');
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleDataBack = (row: TMaterial, checked: boolean) => {
        console.log("kéo dữ liệu");

        // mutationAdd.mutate(
        //     { isLink: checked },
        //     {
        //         onSuccess: (data) => {
        //             revalidate();
        //             toast.success('Kéo dữ liệu thành công thành công.');
        //         },
        //     }
        // );
        // return;
    };

    const columns: TColumn<TMaterial>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên dạng học liệu",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "description",
                disablePadding: "none",
                label: "Mô tả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },

            {
                id: "isLink",
                disablePadding: "none",
                label: "Trạng thái",
                sxRow: { paddingRight: 4 },
                render: (row) => {
                    return (
                        <Switch
                            checked={row?.isLink}
                            value={row?.isLink}
                            onChange={(event) => handleDataBack(row, event.target.checked)}
                        />
                    );
                },
            },


        ],
        [handleDataBack]
    );

    const handleCheckedDelete = useCallback((row: TMaterial, checked: boolean) => {
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
        mutationSoftDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate();
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);

    const actionMenus = useMemo((): TMenuOption[] => {
        return [
            {
                label: "Liên thông dữ liệu đã chọn",
                icon: <IconLink size={20} stroke={1.5} />,
                onClick: handleDeleteMultiple,
            },
        ];
    }, [handleDeleteMultiple]);

    return (
        <div>
            <IBreadcrumsCustom
                profile="Chia sẻ danh mục"
                mainProfile="Danh sách nhà xuất bản"
                link="chia-se-danh-muc/nha-san-xuat"
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
                            >
                                Liên thông tất cả
                            </StyledButton>
                        </Box>
                    </Box>
                </Stack>

                <ActionsForm actions={actionMenus} />

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
            </MainCard>
        </div>
    );
};
export default LibPublisherPage;