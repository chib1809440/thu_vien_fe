import React, { useState } from 'react';
import MainCard from '../../../../ui-component/cards/MainCard';
import { Box, Stack } from '@mui/system';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import StyledButton from '../../../../components/default/button/StyledButton';
import { IconPlus } from '@tabler/icons';
import TableRoleList from './ui-components/TableRoleList';
import { Role } from '../../../../interfaces/role';
import { HeadCell } from '../../../../components/custom/table/type';
import IBreadcrumsCustom from '../../../../ui-component/breadcrums';

const headCells: HeadCell[] = [
    {
        id: 'role_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên vai trò',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Hành động',
    },
];

export default function RolePage() {

    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);

    return (
        <>
            <IBreadcrumsCustom
                profile="Danh sách vai trò"
                mainProfile="Danh sách vai trò"
                link="/vai-tro"
            />
            <MainCard >
                <Stack spacing={2}>
                    {/* <CsFlexRowBetween>
                        <Box sx={{ ml: { xs: 0, sm: 0, md: 4 } }}>
                            <StyledButton
                                color='primary'
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={() => setIsOpenAddDialog(true)}
                            >
                                Thêm vai trò
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween> */}
                    <TableRoleList<Role>
                        orderByKey={"name"}
                        headCells={headCells}
                        //  title={itemListClass.title}
                        selected={selected}
                        handleSelected={setSelected}
                        isOpenAddDilog={isOpenAddDilog}
                        setIsOpenAddDialog={setIsOpenAddDialog}
                    />
                </Stack>
            </MainCard>
        </>
    );
}
