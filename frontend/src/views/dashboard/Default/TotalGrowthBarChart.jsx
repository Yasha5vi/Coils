import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';

export default function TotalGrowthBarChart({ isLoading, basic, easy, medium, hard }) {
  const theme = useTheme();
  const { mode } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  const chartData = {
    height: 480,
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: false, // not needed since we only want single bars
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          distributed: true
        }
      },
      xaxis: {
        type: 'category',
        categories: ['Basic', 'Easy', 'Medium', 'Hard']
      },
      legend: {
        show: false // legend not needed since each bar = category
      },
      fill: {
        type: 'solid'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true
      }
    },
    series: [
      {
        name: 'Problems',
        data: [basic,easy,medium,hard] 
      }
    ]
  };

  React.useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, grey500],
      xaxis: {
        labels: { style: { colors: primary } }
      },
      yaxis: {
        labels: { style: { colors: primary } }
      },
      grid: { borderColor: divider },
      tooltip: { theme: mode },
      legend: { labels: { colors: grey500 } }
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [mode, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, divider, isLoading, grey500]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container direction="column" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid item>
                  <Typography variant="subtitle2">Total Solved</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3">{basic+easy+medium+hard}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    ...theme.applyStyles('light', {
                      '& .apexcharts-series:nth-of-type(4) path:hover': {
                        filter: `brightness(0.95)`,
                        transition: 'all 0.3s ease'
                      }
                    }),
                    '& .apexcharts-menu': { bgcolor: 'background.paper' },
                    '.apexcharts-theme-light .apexcharts-menu-item:hover': {
                      bgcolor: 'dark.main'
                    },
                    '& .apexcharts-theme-light .apexcharts-menu-icon:hover svg, .apexcharts-theme-light .apexcharts-reset-icon:hover svg, .apexcharts-theme-light .apexcharts-selection-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoom-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoomin-icon:hover svg, .apexcharts-theme-light .apexcharts-zoomout-icon:hover svg':
                      { fill: theme.palette.grey[400] }
                  }}
                >
                  <Chart {...chartData} />
                </Grid>
              </Grid>
            </Grid>            
          </Grid>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = { isLoading: PropTypes.bool };
