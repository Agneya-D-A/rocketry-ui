import "./PositionBox.css"
import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// Use a public rocket icon (you can use your own)
const rocketImg = new window.Image();
rocketImg.src = 'https://cdn-icons-png.flaticon.com/512/560/560148.png';

// Example: converting your linked list to a data array
// Replace linked_list with your actual instance
// Example: const dataArray = linked_list.map(node => ({ x: node.position.distanceTravelled, y: node.altitude }));

function Trajectory({ linked_list }) {
  // Convert linked list to chart data
  const dataArray = linked_list.map(node => ({
    x: node.position.distanceTravelled,
    y: node.altitude
  }));

  const chartData = {
    datasets: [{
      label: 'Rocket trajectory',
      data: dataArray,
      borderColor: "#36a2eb",
      backgroundColor: "rgba(54, 162, 235, 0.1)",
      showLine: true,
      fill: false,
      // Only last point is visible, rest have radius 0
      pointRadius: dataArray.map((_, i) => (i === dataArray.length - 1 ? 14 : 0)),
      // Only last point gets rocket icon, others are circles (invisible)
      pointStyle: dataArray.map((_, i) => (i === dataArray.length - 1 ? rocketImg : 'circle')),
      pointHoverRadius: 16,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        // Only show tooltip for last point
        filter: (tooltipItem) => (
          tooltipItem.dataIndex === dataArray.length - 1
        ),
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Horizontal Distance (m)' },
      },
      y: {
        title: { display: true, text: 'Altitude (m)' }
      }
    }
  };

  const chartRef = useRef(null);

  useEffect(() => {
    rocketImg.onload = () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.update();
      }
    };
  }, []);

  return (
    <div className="bottom-box">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

export default Trajectory;
