import { useTheme } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { IconArrowBack } from '@tabler/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeadCell } from '../../../../components/custom/table/type';
import StyledButton from '../../../../components/default/button/StyledButton';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import { User } from '../../../../interfaces/user';
import MainCard from '../../../../ui-component/cards/MainCard';
import TableUserTrashList from './ui-components/TableUserTrashList';
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
