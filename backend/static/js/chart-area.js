// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Resting heart rate chart
var heartRateHTML = document.getElementById("heartRateChart");
var heartRateChart = new Chart(heartRateHTML, {
  type: 'line',
  data: {
    labels: datesOfMonth,
    datasets: [{
      label: "Average Resting Heart Rate",
      lineTension: 0,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: heartRatePoints,
      pointBackgroundColor: heartRatePointColors,
      pointBorderColor: 'rgba(78, 115, 223, 1)',
      pointHoverRadius: 0,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 0,
      pointBorderWidth: 0,
      data: heartRateList,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          // begin at zero scales to graph better, seems less crazy
          beginAtZero: true,
          maxTicksLimit: 8,
          padding: 20,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          return number_format(tooltipItem.xLabel) + ' '+ Month + ' ' + Year;
        },
        title: function(tooltipItem, chart) {
          return number_format(tooltipItem[0].yLabel) + ' bpm';
        }
      }
    },
    annotation: {
      annotations:[{
        type: 'line',
        drawTime: 'afterDatasetsDraw',
        id: 'heartRateHigh',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: heartRateAnomaly[1],
        // endValue: 30,
        borderColor: 'red',
        borderWidth: 2,
        // borderDash: [2, 2],
        // borderDashOffset: 5,
        onMouseover: function(e) {
          // The annotation is is bound to the `this` variable
          console.log("Annotation", e.type, this);
        },
        label: {
            backgroundColor: 'rgba(256,256,256,0.7)',
            fontFamily: "Nunito",
            fontSize: 12,
            // fontStyle: "bold",
            fontColor: 'black',
            xPadding: 8,
            yPadding: 4,
            cornerRadius: 4,
            position: "center",
            xAdjust: 0,
            yAdjust: 0,
            enabled: true,
            content: "Predicted High"
        }
      },
      {
          type: 'line',
          drawTime: 'afterDatasetsDraw',
          id: 'heartRateLow',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: heartRateAnomaly[0],
          // endValue: 30,
          borderColor: 'teal',
          borderWidth: 2,
          // borderDash: [2, 2],
          // borderDashOffset: 5,
          onMouseover: function(e) {
            // The annotation is is bound to the `this` variable
            console.log("Annotation", e.type, this);
          },
          label: {
              backgroundColor: 'rgba(256,256,256,0.7)',
              fontFamily: "Nunito",
              fontSize: 12,
              // fontStyle: "bold",
              fontColor: 'black',
              xPadding: 8,
              yPadding: 4,
              cornerRadius: 4,
              position: "center",
              xAdjust: 0,
              yAdjust: 0,
              enabled: true,
              content: "Predicted Low"
          }
      }]
    }
  }
});

console.log(heartRateAnomaly)
console.log('here')

// Walking Assymmetry Chart
var walkingAsymmetryHTML = document.getElementById("walkingAsymmetryAreaChart");
var walkingAsymmetryChart = new Chart(walkingAsymmetryHTML, {
  type: 'line',
  data: {
    labels: datesOfMonth,
    datasets: [{
      label: "Walking Asymmetry",
      lineTension: 0,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: stepAsymmetryPoints,
      pointBackgroundColor: stepAsymmetryPointColors,
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 0,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 0,
      pointBorderWidth: 0,
      data: asymmetryList,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          // begin at zero scales to graph better, seems less crazy
          beginAtZero: true,
          maxTicksLimit: 8,
          padding: 20,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return number_format(value) + '%';
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          return number_format(tooltipItem.xLabel) + ' '+ Month + ' '+ Year;
        },
        title: function(tooltipItem, chart) {
          return tooltipItem[0].yLabel + '%';
        }
      }
    },
    annotation: {
      annotations:[{
        type: 'line',
        drawTime: 'afterDatasetsDraw',
        id: 'asymmetryHigh',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: stepAsymmetryAnomaly[1],
        // endValue: 30,
        borderColor: 'red',
        borderWidth: 2,
        // borderDash: [2, 2],
        // borderDashOffset: 5,
        onMouseover: function(e) {
          // The annotation is is bound to the `this` variable
          console.log("Annotation", e.type, this);
        },
        label: {
            backgroundColor: 'rgba(256,256,256,0.7)',
            fontFamily: "Nunito",
            fontSize: 12,
            // fontStyle: "bold",
            fontColor: 'black',
            xPadding: 8,
            yPadding: 4,
            cornerRadius: 4,
            position: "center",
            xAdjust: 0,
            yAdjust: 0,
            enabled: true,
            content: "Predicted High"
        }
      },
      {
          type: 'line',
          drawTime: 'afterDatasetsDraw',
          id: 'asymmetryLow',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: stepAsymmetryAnomaly[0],
          // endValue: 30,
          borderColor: 'teal',
          borderWidth: 2,
          // borderDash: [2, 2],
          // borderDashOffset: 5,
          onMouseover: function(e) {
            // The annotation is is bound to the `this` variable
            console.log("Annotation", e.type, this);
          },
          label: {
              backgroundColor: 'rgba(256,256,256,0.7)',
              fontFamily: "Nunito",
              fontSize: 12,
              // fontStyle: "bold",
              fontColor: 'black',
              xPadding: 8,
              yPadding: 4,
              cornerRadius: 4,
              position: "center",
              xAdjust: 0,
              yAdjust: 0,
              enabled: true,
              content: "Predicted Low"
          }
      }]
    }
  }
});
