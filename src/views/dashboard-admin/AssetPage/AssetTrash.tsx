import React, { useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { Box, Stack } from '@mui/system';
import { CsFlexRowBetween } from '../../../components/default/flex';
import StyledButton from '../../../components/default/button/StyledButton';
import { IconArrowBack, IconPlus, IconTrash } from '@tabler/icons';
import TableAssetList from './ui-components/TableAssetList';
import { HeadCell } from '../../../components/custom/table/type';
import { Asset } from '../../../interfaces/asset';
import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TableAssetTrashList from './ui-components/TableAssetTrashList';
const headCells: HeadCell[] = [
    {
        id: 'asset_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên tài sản',
    },
    {
        id: 'asset_quantity_used',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng sử dụng',
    },
    {
        id: 'asset_quantity_in_stock',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng ở kho',
    },
    {
        id: 'asset_quantity_in_stock_liquidation',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng thanh lý',
    },
    {
        id: 'asset_quantity_of_damage',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng hư hỏng',
    },
    {
        id: 'asset_quantity_total',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng tổng',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Hành động',
    },
];

export default function AssetTrashPage() {

    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const theme = useTheme()
    const navigate = useNavigate();
    const handleClickNavigateAssetList = () => {
        navigate('/tai-san-thu-vien/danh-sach');
    };
    return (
        <>
            <MainCard title="Danh sách tài sản thùng rác">
                <Stack spacing={2}>
                    <CsFlexRowBetween>
                        <Box sx={{ ml: 4 }}>
                            <StyledButton
                                color='primary'
                                size="small"
                                startIcon={<IconArrowBack stroke={2} />}
                                variant="contained"
                                onClick={() => handleClickNavigateAssetList()}
                            >
                                Quay về
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween>
                    <TableAssetTrashList<Asset>
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
