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

export default function HomePage() {
    const { data: statisticals } = useFetchStatistical();
    console.log(statisticals);
    // Prepare data for PieChart
    const pieChartData = useMemo(() => {
        if (!statisticals?.data?.result) return [];


        // Return the formatted data if not all percentages are zero or null
        return statisticals.data.result.totalPublication.map((item, index) => ({
            id: index,
            value: item.count,
            label: item.type,
        }));
    }, [statisticals]);
    return (
        <>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Thống kê danh mục
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <TotalCard title={statisticals?.data?.result?.totalPublication[0]?.type} count={statisticals?.data?.result?.totalPublication[0]?.count} icon={IconBook} bgColor="#1e88e5" bgColorIcon="#014ea6" />
                </Grid>
                <Grid item xs={3}>
                    <TotalCard title={statisticals?.data?.result?.totalPublication[1]?.type} count={statisticals?.data?.result?.totalPublication[1]?.count} icon={IconBook} bgColor="#ff4d4d" bgColorIcon="#cc0000" />
                </Grid>
                <Grid item xs={3}>
                    <TotalCard title="Số lượng sách có sẵn" count={statisticals?.data?.result?.totalBorrowable} icon={IconBook} bgColor="#ffb84d" bgColorIcon="#cc7a00" />
                </Grid>
                <Grid item xs={3}>
                    <TotalCard title="Tổng số phiếu đang mượn" count={statisticals?.data?.result?.totalBorrowedBooks} icon={Icon12Hours} bgColor="#00b3b3" bgColorIcon="#009999" />
                </Grid>
                <Grid item xs={3}>
                    <TotalCard title="Tổng số phiếu trả" count={statisticals?.data?.result?.totalReturnedBooks} icon={IconAB} bgColor="#00b300" bgColorIcon="#009900" />
                </Grid>
                <Grid item xs={3}>
                    <TotalCard title="Tổng số phiếu quá hạn" count={statisticals?.data?.result?.totalOverdueLoans} icon={Icon3dCubeSphereOff} bgColor="#e60073" bgColorIcon="#b30059" />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={7}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Top sách mượn trong tháng
                    </Typography>
                    <Box p={4} display="flex" justifyContent="center" alignItems="center"  >
                        {
                            pieChartData?.length > 0 ? <> <PieChart
                                series={[
                                    {
                                        data: pieChartData,
                                    },
                                ]}
                                slotProps={{
                                    legend: {

                                        itemGap: 30, // Adds space between legend items
                                    },
                                }}
                                width={800}
                                height={400}
                            /></> : <>Chưa có điểm thi nào</>
                        }

                    </Box>
                </Grid>

            </Grid>
        </>
    );
}
