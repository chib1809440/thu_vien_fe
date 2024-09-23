import { Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Chart from 'react-apexcharts';
import MainCard from "../../../../ui-component/cards/MainCard";
import chartData from './total-growth-bar-chart';

export default function ChatWrapper(props: {
    [x: string]: any;
    dataLoanSlip?: any;
    dataStanding?: any;
    dataRegisterSlip?: any;
}) {
    const [getYear, setYear] = React.useState<number>(() => {
        const namHienTai = new Date();
        const getMonth = namHienTai.getMonth();
        const getYearRoot = namHienTai.getFullYear();

        if (getMonth <= 7) {
            return getYearRoot - 1;
        } else {
            return getYearRoot;
        }
    });

    React.useEffect(() => {
        const namHienTai = new Date();
        const getMonth = namHienTai.getMonth();
        const getYearRoot = namHienTai.getFullYear();

        if (getMonth <= 7) {
            setYear(getYearRoot - 1);
        }
    }, []);


    const [valueRegister, setRegister] = React.useState<number[]>([]);
    const [valueBorrowing, setBorrowing] = React.useState<number[]>([]);
    const [valuePay, setPay] = React.useState<number[]>([]);

    function getLengthMonthYearFilter(month) {
        if (month === 8) { return 0; }
        if (month === 9) { return 1; }
        if (month === 10) { return 2; }
        if (month === 11) { return 3; }
        if (month === 12) { return 4; }
        if (month === 1) { return 5; }
        if (month === 2) { return 6; }
        if (month === 3) { return 7; }
        if (month === 4) { return 8; }
        if (month === 5) { return 9; }
        if (month === 6) { return 10; }
        if (month === 7) { return 11; }
        return 0;
    }

    React.useEffect(() => {
        let register = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
        let borrowing = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
        let pay = Array.from({ length: 12 }, () => 0);
        

        props.dataLoanSlip.forEach((item: any) => {
            const returnDate = new Date(item.return_at);
            const returnMonth = returnDate.getMonth();
            
            item?.supplies?.forEach((item2: any) => {
                item2?.detail?.forEach((item3: any) => {
                    if (item?.return_at) {
                        pay[getLengthMonthYearFilter(returnMonth+1)] += item3?.returned_qty || 0;
                    }
                });
            });
        });

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const filteredData = props.dataLoanSlip.filter((item) => {
            if (item.return_at) {
                const returnDate = new Date(item.return_at);
                return returnDate.getMonth() === currentMonth;
            }
            return false;
        });

        // 

        props.dataStanding.forEach((item: any, index) => {
            let sum = 0;

            item.forEach((item2: any) => {

                sum += item2?.total_borrowed_supplies
                return sum

            });
            if (item.length !== 0) {
                borrowing.splice(index, 1, borrowing[index] + sum)

                return Number(sum)
            }
            else {
                return Number(sum)
            }
        });

        let sumRegisterSlip = 0;
        props.dataRegisterSlip.forEach((item: any, index) => {

            item?.detail.forEach((item2: any) => {
                sumRegisterSlip += item2?.qty
                return sumRegisterSlip

            });
            const fillterRegisterSlip = item?.create_at.slice(5, 7);
            const fillterRegisterYearSlip = item?.create_at.slice(0, 4);

            if (item.length !== 0) {
                register.splice(getLengthMonthYearFilter(Number(fillterRegisterSlip)), 1, register[getLengthMonthYearFilter(Number(fillterRegisterYearSlip))] + sumRegisterSlip);
                return Number(sumRegisterSlip)
            }
            else {
                return Number(sumRegisterSlip)
            }
        });


        setRegister(register);
        setBorrowing(borrowing);
        setPay(pay);

        const newChartData = {
            ...chartData.options,

            series: [
                {
                    name: 'Lượt đăng ký',
                    data: register
                },
                {
                    name: 'Lượt mượn',
                    data: borrowing
                },
                {
                    name: 'Lượt trả',
                    data: pay
                }
            ],
            title: {
                text: `BIỂU ĐỒ THEO DÕI TÌNH HÌNH BẠN ĐỌC NĂM ${getYear} - ${getYear + 1}`,
                align: 'center',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: undefined,
                    color: '#263238'
                },
            },
            xaxis: {
                type: 'category',
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                // categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
                categories: [`08/${getYear}`, `09/${getYear}`, `10/${getYear}`, `11/${getYear}`, `12/${getYear}`, `01/${getYear + 1}`, `02/${getYear + 1}`, `03/${getYear + 1}`, `04/${getYear + 1}`, `05/${getYear + 1}`, `06/${getYear + 1}`, `07/${getYear + 1}`]
            },
        };

        if (props.dataLoanSlip.length !== 0) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [props.dataLoanSlip, props.dataStanding, props.dataRegisterSlip]);

    function PlusArray(arr1: number[]) {
        const tong = arr1.reduce((tong, so) => tong + so, 0);
        return tong;
    }

    return (
        <>
            <CardWrapper>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid pl={2} container alignItems="center" justifyContent="flex-start" gap={4}>
                            <Grid item pr={1}>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle2">Tổng số lượt đăng ký</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography textAlign='center' variant="h3">{PlusArray(valueRegister)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item pr={1}>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle2">Tổng số lượt mượn</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography textAlign='center' variant="h3">{PlusArray(valueBorrowing)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item pr={1}>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle2">Tổng số lượt trả</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography textAlign='center' variant="h3">{PlusArray(valuePay)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Chart {...chartData} />
                    </Grid>
                </Grid>
            </CardWrapper>
        </>


    );
}

const CardWrapper = styled(MainCard)(({ theme }) => ({
    width: '100%',
}));
