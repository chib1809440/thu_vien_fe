import React, { useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { Box, Stack } from '@mui/system';
import { CsFlexRowBetween } from '../../../components/default/flex';
import StyledButton from '../../../components/default/button/StyledButton';
import { IconPlus, IconTrash } from '@tabler/icons';
import TableAssetList from './ui-components/TableAssetList';
import { HeadCell } from '../../../components/custom/table/type';
import { Asset } from '../../../interfaces/asset';
import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IBreadcrumsCustom from '../../../ui-component/breadcrums';
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

export default function AssetPage() {

    const [isOpenAddDilog, setIsOpenAddDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const theme = useTheme()
    const navigate = useNavigate();
    const handleClickNavigateTrash = () => {
        navigate('/tai-san-thu-vien/thung-rac');
    };
    return (
        <>
            <IBreadcrumsCustom
                profile="Quản lý tài sản"
                mainProfile="Danh sách tài sản"
                link="/tai-san-thu-vien"
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
                                Thêm tài sản
                            </StyledButton>
                            <StyledButton
                                sx={{
                                    background: "#de524a", color: "white",
                                    //@ts-ignore
                                    marginLeft: { xs: 0, sm: 0, md: "10px" },
                                    //@ts-ignore
                                    marginTop: { xs: 1, sm: 1, md: 0 }
                                }}
                                size="small"
                                startIcon={<IconTrash stroke={2} />}
                                variant="contained"
                                onClick={() => handleClickNavigateTrash()}
                            >
                                Thùng rác
                            </StyledButton>
                        </Box>

                    </CsFlexRowBetween>
                    <TableAssetList<Asset>
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
