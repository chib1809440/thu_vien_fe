import React, { useState } from 'react';
import MainCard from '../../../../ui-component/cards/MainCard';
import { Box, Stack } from '@mui/system';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import StyledButton from '../../../../components/default/button/StyledButton';
import { IconPlus, IconTrash } from '@tabler/icons';
import TableUserList from './ui-components/TableUserList';
import { User } from '../../../../interfaces/user';
import { HeadCell } from '../../../../components/custom/table/type';
import IBreadcrumsCustom from '../../../../ui-component/breadcrums';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

const headCells: HeadCell[] = [
    {
        id: 'user_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên tài khoản',
    },
    {
        id: 'user_phoneNumber',
        numeric: false,
        disablePadding: true,
        label: 'Số điện thoại',
    },
    {
        id: 'user_role',
        numeric: false,
        disablePadding: true,
        label: 'Vai trò',
    },
    {
        id: 'user_gender',
        numeric: false,
        disablePadding: true,
        label: 'Giới tính',
    },
    {
        id: 'user_birthday',
        numeric: false,
        disablePadding: true,
        label: 'Ngày sinh',
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
    const theme = useTheme()
    const navigate = useNavigate();
    const handleClickNavigateTrash = () => {
        navigate('/quan-ly-tai-khoan/thung-rac');
    };
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
                        <Box sx={{ ml: 4 }}>
                            <StyledButton
                                color='primary'
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={() => setIsOpenAddDialog(true)}
                            >
                                Thêm tài khoản
                            </StyledButton>
                            <StyledButton
                                sx={{ marginLeft: 2, backgroundColor: theme.palette.error.dark, color: theme.palette.common.white }}
                                size="small"
                                startIcon={<IconTrash stroke={2} />}
                                variant="contained"
                                onClick={() => handleClickNavigateTrash()}
                            >
                                Thùng rác
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween>
                    <TableUserList<User>
                        orderByKey={"fullname"}
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
