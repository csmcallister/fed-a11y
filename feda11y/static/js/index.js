const donut = document.getElementById('donut');
const line = document.getElementById('line');

swapCanvases();

document.getElementById("chart-button").onclick=function(){
  swapCanvases();
  toggleAnnotation();
  
  if (this.innerHTML == "View Historical Compliance") {
    this.innerHTML = "View Current Compliance";
  } else {
    this.innerHTML = "View Historical Compliance";
  } 
};

function swapCanvases(){
  if (donut.style.visibility == 'visible') {
    donut.style.visibility = 'hidden';
    line.style.visibility = 'visible';
  } else {
    donut.style.visibility = 'visible';
    line.style.visibility = 'hidden';
  }
}

function toggleAnnotation(){
  var annotation = document.getElementById("chart-annotation")
  if (annotation.style.visibility == 'visible') {
    annotation.style.visibility = 'hidden';
  } else {
    annotation.style.visibility = 'visible';
  }
}

Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;
  
      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;
  
      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  
      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);
  
      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);
  
      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse+"px " + fontStyle;
      ctx.fillStyle = color;
  
      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});


const config = {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [nDomainsNoIssues, nDomainsIssues],
      backgroundColor: ['#275DAD', '#CED3DC'],
      label: 'Dataset',
    }],
    labels: ['Accessible  ', 'Not Accessible  ']
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 50,
    elements:{
      center: {
        text: `${percentAccessible}% Compliance`,
        color: '#275DAD', 
        fontStyle: 'Helvetica', 
        sidePadding: 15 
      }
    },
    title: {
      display: true,
      text: '',
      fontSize: 18,
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'bottom', 
      labels: {
        pointStyle: 'circle',
        usePointStyle: true,
        fontSize: 20,
        fontColor: '#275DAD'
      },
    }
  }
};

window.onload = function() {
  var donutCtx = document.getElementById('donut').getContext('2d');
  var lineCtx = document.getElementById('line').getContext('2d');
  
  window.myDoughnut = new Chart(donutCtx, config);
  
  window.myLine = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Compliance',
        data: lineData,
        backgroundColor: 'rgb(39, 93, 173, .7)',
        borderColor: '#5B616A',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend:{
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 1,
            fontSize: 14,
            callback: function(value, index, values) {
              value = Math.round(value * 1000) / 10;
              return `${value}%`;
            }
          },
          scaleLabel: {
            display: true,
            labelString: "Websites without Accessibility Issues",
            fontSize: 16,
            padding: 2
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 14
          },
          scaleLabel: {
            display: true,
            labelString: "Scan Date",
            fontSize: 16,
            padding: 2
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += Math.round(tooltipItem.yLabel * 10000) / 100;
            return `${label}%`;
          }
        }
      }
    }
  });
};

$( document ).ready( () => {
  //add descriptive aria-label to line chart
  let i;
  let ariaLabel = "";
  for (i = 0; i < labels.length; i++) {
    const roundedData = Math.round(lineData[i] * 1000) / 10;
    ariaLabel += `${labels[i]}: ${roundedData}%,`;
    ariaLabel = ariaLabel.slice(0, -1) + '.';
  }
  ariaLabel = `Line chart showing the historical percentages of US Government websites without accessibility issues: ${ariaLabel}`
  let $line = $('#line')
  $line.attr('aria-label', ariaLabel)
});
