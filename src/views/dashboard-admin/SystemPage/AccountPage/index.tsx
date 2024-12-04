import { Box, Stack } from '@mui/system';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';
import { HeadCell } from '../../../../components/custom/table/type';
import StyledButton from '../../../../components/default/button/StyledButton';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import { User } from '../../../../interfaces/user';
import IBreadcrumsCustom from '../../../../ui-component/breadcrums';
import MainCard from '../../../../ui-component/cards/MainCard';
import TableUserList from './ui-components/TableUserList';

const headCells: HeadCell[] = [
    {
        id: 'user_barcode',
        numeric: false,
        disablePadding: true,
        label: 'BarCode',
    },
    {
        id: 'user_info',
        numeric: false,
        disablePadding: true,
        label: 'Thông tin cá nhân',
    },
    {
        id: 'user_role',
        numeric: false,
        disablePadding: true,
        label: 'Vai trò',
    },

    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Hành động',
    },
];

export default function AccountPage() {
    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);

    return (
        <>
            <IBreadcrumsCustom
                profile="Quản lý tài khoản"
                mainProfile="Danh sách tài khoản"
                link="/quan-ly-tai-khoan"
            />
            <MainCard>
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: { xs: 0, sm: 0, md: 4 } }}>
                            <StyledButton
                                color='primary'
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={() => setIsOpenAddDialog(true)}
                            >
                                Thêm tài khoản
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween>
                    <TableUserList<User>
                        orderByKey={"fullname"}
                        headCells={headCells}
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
