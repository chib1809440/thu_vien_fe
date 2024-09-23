import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled, alpha, useTheme } from '@mui/material/styles';
import NumberFormat from 'react-number-format';
import ApexChart from 'react-apexcharts';
import useChart from './use-pie-chart';
import MainCard from '../../../../../ui-component/cards/MainCard';
import { CardContent, Grid, Typography } from '@mui/material';
// ----------------------------------------------------------------------

const CHART_HEIGHT = 360;

const LEGEND_HEIGHT = 52;

const Chart = styled(ApexChart)(({ theme }) => ({
  '& .apexcharts-canvas': {
    // Tooltip
    '& .apexcharts-tooltip': {

      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.dropdown,
      borderRadius: theme.shape.borderRadius * 1.25,
      '&.apexcharts-theme-light': {
        borderColor: 'transparent',

      },
    },
    '& .apexcharts-xaxistooltip': {

      borderColor: 'transparent',
      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.dropdown,
      borderRadius: theme.shape.borderRadius * 1.25,
      '&:before': {
        borderBottomColor: alpha(theme.palette.grey[500], 0.24),
      },
      '&:after': {
        borderBottomColor: alpha(theme.palette.background.default, 0.8),
      },
    },
    '& .apexcharts-tooltip-title': {
      textAlign: 'center',
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: alpha(theme.palette.grey[500], 0.08),
      color: theme.palette.text[theme.palette.mode === 'light' ? 'secondary' : 'primary'],
    },

    // LEGEND
    '& .apexcharts-legend': {
      padding: 0,
    },
    '& .apexcharts-legend-series': {
      display: 'inline-flex !important',
      alignItems: 'center',
    },
    '& .apexcharts-legend-marker': {
      marginRight: 8,
    },
    '& .apexcharts-legend-text': {
      lineHeight: '12px',
      textTransform: 'capitalize',
    },
  },
}));

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function PieChart({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => new Number(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <MainCard content={false}>

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container alignContent="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4">{title}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <StyledChart
              dir="ltr"
              type="pie"
              series={chartSeries}
              options={chartOptions}
              width="100%"
              height={290}
            />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}

PieChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
