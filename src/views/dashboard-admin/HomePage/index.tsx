import React, { useMemo } from 'react';

import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { dispatch, useSelector } from '../../../store';
import { getLoanSlipWaiting } from '../../../store/slices/loanSlip';
import { getRegisterSlipWaiting } from '../../../store/slices/registerSlip';
import { getStateOfBookWaiting } from '../../../store/slices/stateOfBook';
import { getSuppliesWaiting } from '../../../store/slices/supplies';
import { getTopStandingWaiting } from '../../../store/slices/topStanding';
import { GetLoanSlip } from '../../../types/loanSlip';
import { GetSupplies } from '../../../types/supplies';
import { GetTopStanding } from '../../../types/topStanding';
import StickyHeadTable from './table';
import TotalCard from '../../../components/custom/card/TotalCard';
import { Icon12Hours, Icon3dCubeSphereOff, IconBook, IconUsersGroup } from '@tabler/icons-react';
import { useFetchStatistical } from '../../../hooks/services/statistical/statistical-query';
import { IconAB } from '@tabler/icons';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts';
import { getLabelFromOptions } from '../../../utils/object';
import { typeOptions } from '../../../utils/constants.utils';

export default function HomePage() {
    const { data: statisticals } = useFetchStatistical();
    console.log(statisticals);
    // Prepare data for PieChart
    // const pieChartData = useMemo(() => {
    //     if (!statisticals?.data?.result) return [];


    //     // Return the formatted data if not all percentages are zero or null
    //     return statisticals.data.result.TopBorrowedBooksInMonth.map((item, index) => ({
    //         id: index,
    //         value: item.totalBorrowed,
    //         label: item.name,
    //     }));
    // }, [statisticals]);
    const barChartData = useMemo(() => {
        if (!statisticals?.data?.result) return [];

        // Chuyển đổi dữ liệu từ TopBorrowedBooksInMonth sang định dạng cho BarChart
        return statisticals.data.result.TopBorrowedBooksInMonth.map(item => ({
            x: item.name,      // Nhóm
            y: item.totalBorrowed, // Giá trị tương ứng
        }));
    }, [statisticals]);
    return (
        <>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Thống kê danh mục
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={6} md={3}>
                    <TotalCard title={getLabelFromOptions(typeOptions, statisticals?.data?.result?.totalPublication[0]?.type) || "Ấn phẩm truyền thống"}
                        count={statisticals?.data?.result?.totalPublication[0]?.count ?? 0} icon={IconBook} bgColor="#1e88e5" bgColorIcon="#014ea6" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <TotalCard title={getLabelFromOptions(typeOptions, statisticals?.data?.result?.totalPublication[1]?.type) || "Ấn phẩm mềm"}
                        count={statisticals?.data?.result?.totalPublication[1]?.count ?? 0} icon={IconBook} bgColor="#ff4d4d" bgColorIcon="#cc0000" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <TotalCard title="Số lượng sách có sẵn" count={statisticals?.data?.result?.totalBorrowable} icon={IconBook} bgColor="#ffb84d" bgColorIcon="#cc7a00" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <TotalCard title="Tổng số phiếu đang mượn" count={statisticals?.data?.result?.totalBorrowedBooks} icon={Icon12Hours} bgColor="#00b3b3" bgColorIcon="#009999" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <TotalCard title="Tổng số phiếu trả" count={statisticals?.data?.result?.totalReturnedBooks} icon={IconAB} bgColor="#00b300" bgColorIcon="#009900" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <TotalCard title="Tổng số phiếu quá hạn" count={statisticals?.data?.result?.totalOverdueLoans} icon={Icon3dCubeSphereOff} bgColor="#e60073" bgColorIcon="#b30059" />
                </Grid>
            </Grid>
            {
                barChartData.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xs={12}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Top sách mượn trong tháng
                            </Typography>
                            <Box p={4} >
                                <BarChart
                                    xAxis={[{ scaleType: 'band', data: barChartData.map(item => item.x) }]}
                                    series={[
                                        {
                                            label: 'Quyển',
                                            data: barChartData.map(item => item.y), // Dữ liệu biểu đồ
                                        },
                                    ]}
                                    width={800}
                                    height={400}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                )
            }

        </>
    );
}
