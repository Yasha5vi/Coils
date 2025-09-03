// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

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
      data: [350, 500, 700, 200] 
    }
  ]
};

export default chartData;
