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

// Steps Bar Chart
var stepsBarChartHTML = document.getElementById("stepsBarChart");
var stepsBarChart = new Chart(stepsBarChartHTML, {
  type: 'bar',
  data: {
    labels: datesOfMonth,
    datasets: [{
      label: "Step Count",
      backgroundColor: stepCountColors,
      hoverBackgroundColor: stepCountHighlightColors,
      borderColor: "#4e73df",
      data: stepsList,
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
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 6
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          // min: 0,
          // max: 15000,
          maxTicksLimit: 8,
          beginAtZero: true,
          padding: 20,
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
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          return number_format(tooltipItem.xLabel) + ' '+ Month + ' '+ Year;
        },
        title: function(tooltipItem, chart) {
          return number_format(tooltipItem[0].yLabel) + ' Steps';
        }
      }
    }, annotation: {
      annotations:[{
        type: 'line',
        drawTime: 'afterDatasetsDraw',
        id: 'stepCountHigh',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: stepCountAnomaly[1],
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
          id: 'stepCountLow',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: stepCountAnomaly[0],
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


// Sleep Time Bar Chart
var sleepTimeBarChartHTML = document.getElementById("sleepTimeBarChart");
var sleepTimeBarChart = new Chart(sleepTimeBarChartHTML, {
  type: 'bar',
  data: {
    labels: datesOfMonth,
    datasets: [{
      label: "Sleep Time",
      backgroundColor: sleepTimeColors,
      hoverBackgroundColor: sleepTimeHighlightColors,
      borderColor: "#4e73df",
      data: sleepTimeList,
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
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 6
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          // min: 0,
          // max: 15000,
          maxTicksLimit: 8,
          beginAtZero: true,
          padding: 20,
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
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          return number_format(tooltipItem.xLabel) + ' '+ Month + ' '+ Year;
        },
        title: function(tooltipItem, chart) {
          return tooltipItem[0].yLabel + ' Hours';
        }
      }
    },annotation: {
      annotations:[{
        type: 'line',
        drawTime: 'afterDatasetsDraw',
        id: 'sleepTimeHigh',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: sleepTimeAnomaly[1],
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
          id: 'sleepTimeLow',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: sleepTimeAnomaly[0],
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

// Indoor Location Bar Chart
var indoorLocationBarChartHTML = document.getElementById("indoorLocationBarChart");
var indoorLocationBarChart = new Chart(indoorLocationBarChartHTML, {
  type: 'bar',
  data: {
    labels: datesOfMonth,
    datasets: bluetoothGraphDatasets,
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
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 6
        },
        maxBarThickness: 25,
        stacked: true
      }],
      yAxes: [{
        ticks: {
          // min: 0,
          // max: 24,
          maxTicksLimit: 8,
          beginAtZero: true,
          padding: 20,
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
        },
        stacked: true
      }],
    },
    legend: {
      display: true
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          return number_format(tooltipItem.xLabel) + ' ' + Month + ' ' + Year;
        },
        title: function(tooltipItem, chart) {
          return tooltipItem[0].yLabel + ' Hours'
        }
      }
    },
  }
});