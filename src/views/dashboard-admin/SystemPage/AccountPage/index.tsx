import React, { useState } from 'react';
import MainCard from '../../../../ui-component/cards/MainCard';
import { Box, Stack } from '@mui/system';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import StyledButton from '../../../../components/default/button/StyledButton';
import { IconPlus } from '@tabler/icons';
import TableUserList from './ui-components/TableUserList';
import { User } from '../../../../interfaces/user';
import { HeadCell } from '../../../../components/custom/table/type';

const headCells: HeadCell[] = [
    {
        id: 'example_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên ví dụ',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Hành động',
    },
];

export default function ExamPage() {

    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);

    return (
        <>
            <MainCard title="Danh sách tài khoản">
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
