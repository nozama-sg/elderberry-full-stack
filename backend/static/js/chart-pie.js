// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Bluetooth Room Time Pie Chart
var roomTimePieChartHTML = document.getElementById("roomTimePieChart");
var roomTimePieChart = new Chart(roomTimePieChartHTML, {
  type: 'doughnut',
  data: {
    labels: bluetoothPieChartLabels,
    datasets: [{
      data: bluetoothPieChartData,
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#e74a3b'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf','#A8362C'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
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
      callbacks : {

        title: function(tooltipItem, data) {
          let dataset = data['datasets'][0];
          let name = data['labels'][tooltipItem[0]['index']];
          
          let numArray = dataset.data;
          let index = tooltipItem[0]['index'];

          let total = numArray.reduce((a, b) => a + b, 0);
          let hour = numArray[index];

          return name + ": " + Math.floor(hour / total * 100) + '%';
        },

        label: function(tooltipItem, data) {
          let hours = data['datasets'][0]['data'][tooltipItem['index']];
          return hours   + ' Hours';
        },
      }
    },
    legend: {
      display: true
    },
    cutoutPercentage: 80,
  },
});

// Diet Composition Pie Chart
var dietPieChartHTML = document.getElementById("dietPieChart");
var dietPieChart = new Chart(dietPieChartHTML, {
  type: 'doughnut',
  data: {
    labels: dietLabels,
    datasets: [{
      data: dietData,
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#e74a3b','#DBDB4F'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf','#A8362C','#ffa500'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
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
      callbacks : {

        title: function(tooltipItem, data) {
          let dataset = data['datasets'][0];
          let name = data['labels'][tooltipItem[0]['index']];
          
          let numArray = dataset.data;
          let index = tooltipItem[0]['index'];

          let total = numArray.reduce((a, b) => a + b, 0);
          let hour = numArray[index];

          return name + ": " + Math.floor(hour / total * 100) + '%';
        },

        label: function(tooltipItem, data) {
          let hours = data['datasets'][0]['data'][tooltipItem['index']];
          return hours   + ' Meals';
        },
      }
    },
    legend: {
      display: true
    },
    cutoutPercentage: 80,
  },
});