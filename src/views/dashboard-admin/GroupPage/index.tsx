
import { Box, Stack } from '@mui/system';
import { IconPlus } from '@tabler/icons';
import { useMemo, useState } from 'react';
import { HeadCell } from '../../../components/custom/table/type';
import StyledButton from '../../../components/default/button/StyledButton';
import { CsFlexRowBetween } from '../../../components/default/flex';
import { useAddGroup, useDeleteGroup, useEditGroup } from '../../../hooks/services/group/group-mutation';
import { useFetchGroup, useReFetchGroup } from '../../../hooks/services/group/group-query';
import { TGroup, TGroupCreate } from '../../../types/models/group.type';
import IBreadcrumsCustom from '../../../ui-component/breadcrums';
import MainCard from '../../../ui-component/cards/MainCard';
import FormAddEditGroup from './ui-components/FormAddEditGroup';
import TableGroupList from './ui-components/TableGroupList';

const headCells: HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Tên nhóm',
    },
    {
        id: 'mainLibrary',
        numeric: false,
        disablePadding: true,
        label: 'Thư viện',
    },
    {
        id: 'isPublic',
        numeric: false,
        disablePadding: true,
        label: 'Hiển thị',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Hành động',
    },
];

const GroupPage = () => {
    const { data } = useFetchGroup();
    const mutationAdd = useAddGroup();
    const mutationEdit = useEditGroup();
    const revalidate = useReFetchGroup();

    console.log(`data`, data);
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TGroup | null>(null);

    const addGroup = () => {
        setOpenAddEdit(true);
    }

    const handleEditGroup = (row: TGroup) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TGroupCreate) => {
        console.log(values);

        if (selectedEdit) {
            mutationEdit.mutate({ ...values, _id: selectedEdit._id }, {
                onSuccess: () => {
                    revalidate();
                    alert("Chỉnh sửa thành công");
                    handleClose();
                },

                onError: (error: any) => {
                    alert("Lỗi khi chỉnh sửa: " + (error?.response?.data?.message));
                }
            });
        }


        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                alert("Thêm thành công");
                setOpenAddEdit(false);
            },
        });
    }

    const initialValues = useMemo((): TGroupCreate => {
        if (selectedEdit) {
            return {
                isPublic: selectedEdit.isPublic,
                mainLibrary: selectedEdit.mainLibrary,
                name: selectedEdit.name,
            };
        }
        return {
            isPublic: false,
            mainLibrary: "",
            name: "",
        };
    }, [selectedEdit]);

    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);

    return (
        <div>
            <IBreadcrumsCustom profile="QUẢN LÝ NHÓM" mainProfile="QUẢN LÝ NHÓM THƯ VIỆN" link="/quan-ly-nhom" />

            {openAddEdit && (
                <FormAddEditGroup
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={selectedEdit ? true : false}
                />
            )}



            <MainCard >
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4, mb:2 }}>
                            <StyledButton
                                color='primary'
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={addGroup}
                            >
                                Thêm mới
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween>

                </Stack>

                <TableGroupList<TGroup>
                    orderByKey={"name"}
                    headCells={headCells}
                    selected={selected}
                    handleSelected={setSelected}
                    isOpenAddDilog={isOpenAddDilog}
                    setIsOpenAddDialog={setIsOpenAddDialog}
                />
            </MainCard>

        </div>
    );
}
export default GroupPage;
