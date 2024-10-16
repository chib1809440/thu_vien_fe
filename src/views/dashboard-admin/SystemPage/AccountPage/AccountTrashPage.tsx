import React, { useState } from 'react';
import MainCard from '../../../../ui-component/cards/MainCard';
import { Box, Stack } from '@mui/system';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import StyledButton from '../../../../components/default/button/StyledButton';
import { IconArrowBack, IconPlus, IconTrash } from '@tabler/icons';
import TableUserList from './ui-components/TableUserList';
import { HeadCell } from '../../../../components/custom/table/type';
import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TableUserTrashList from './ui-components/TableUserTrashList';
import { User } from '../../../../interfaces/user';
const headCells: HeadCell[] = [
    {
        id: 'example_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên tài khoản',
    },
    {
        id: 'example_phoneNumber',
        numeric: false,
        disablePadding: true,
        label: 'Số điện thoại',
    },
    {
        id: 'example_gender',
        numeric: false,
        disablePadding: true,
        label: 'Giới tính',
    },
    {
        id: 'example_birthday',
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

export default function UserTrashPage() {

    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const theme = useTheme()
    const navigate = useNavigate();
    const handleClickNavigateUserList = () => {
        navigate('/quan-ly-tai-khoan');
    };
    return (
        <>
            <MainCard title="Danh sách tài khoản thùng rác">
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4 }}>
                            <StyledButton
                                color='primary'
                                size="small"
                                startIcon={<IconArrowBack stroke={2} />}
                                variant="contained"
                                onClick={() => handleClickNavigateUserList()}
                            >
                                Quay về
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween>
                    <TableUserTrashList<User>
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
