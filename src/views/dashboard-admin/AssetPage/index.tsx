import { useTheme } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { IconPlus, IconTrash } from '@tabler/icons';
import { IconDevices, IconTransferIn } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeadCell } from '../../../components/custom/table/type';
import StyledButton from '../../../components/default/button/StyledButton';
import { CsFlexRowBetween } from '../../../components/default/flex';
import { Asset } from '../../../interfaces/asset';
import IBreadcrumsCustom from '../../../ui-component/breadcrums';
import MainCard from '../../../ui-component/cards/MainCard';
import TableAssetList from './ui-components/TableAssetList';

const headCells: HeadCell[] = [
    {
        id: 'asset_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên tài sản',
    },

    {
        id: 'typeAssetId',
        numeric: true,
        disablePadding: true,
        label: 'Phân loại',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: true,
        label: 'Trạng thái',
    },
    {
        id: 'quantityUsed',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng sử dụng',
    },
    {
        id: 'quantityWarehouse',
        numeric: true,
        disablePadding: true,
        label: 'Số lượng trong kho',
    },
    {
        id: 'quantityTotal',
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
                link="/tai-san-thu-vien/danh-sach"
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
                            <Link to="/quan-ly-nhap-kho/phieu-nhap-tai-san" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    sx={{
                                        background: "#a36e21", color: "white",
                                        //@ts-ignore
                                        marginLeft: { xs: 0, sm: 0, md: "10px" },
                                        //@ts-ignore
                                        marginTop: { xs: 1, sm: 1, md: 0 }
                                    }}
                                    size="small"
                                    startIcon={<IconTransferIn stroke={2} />}
                                    variant="contained"
                                >
                                    Quản lý nhập tài sản
                                </StyledButton>
                            </Link>
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
