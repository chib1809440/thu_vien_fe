import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, Skeleton, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';



// chart data
import chartData from './total-growth-bar-chart';
import MainCard from '../../../../../ui-component/cards/MainCard';

const status = [
  {
    value: 'today',
    label: 'Hôm nay'
  },
  {
    value: 'month',
    label: 'Tháng này'
  },
  {
    value: 'year',
    label: 'Năm nay'
  }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const ChartWrapper = (props: {
  isLoading: boolean,
}) => {
  const [value, setValue] = useState('today');
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    const newChartData = {
      ...chartData.options,
      series: [{
        data: [21, 22, 10, 28, 16, 21, 13, 30]
      }],
      options: {
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function(chart, w, e) {
            }
          }
        },
        // colors: colors,
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        xaxis: {
          categories: [
            ['John', 'Doe'],
            ['Joe', 'Smith'],
            ['Jake', 'Williams'],
            'Amber',
            ['Peter', 'Brown'],
            ['Mary', 'Evans'],
            ['David', 'Wilson'],
            ['Lily', 'Roberts'], 
          ],
          labels: {
            style: {
              // colors: colors,
              fontSize: '12px'
            }
          }
        }
      },
    };

    // do not load chart when loading
    if (!props.isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, []);





  return (
    <>
      {props.isLoading ? (
        <Skeleton variant="rectangular" width='100%' height={500} sx={{ borderRadius: 5 }} />
      ) : (
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    {/* <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid> */}
                    {/* <Grid item>
                      <Typography variant="h3">$2,324.00</Typography>
                    </Grid> */}
                  </Grid>
                </Grid>
                
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

ChartWrapper.propTypes = {
  isLoading: PropTypes.bool
};

export default ChartWrapper;
