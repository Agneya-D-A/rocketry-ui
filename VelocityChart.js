// VelocityChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { color } from 'chart.js/helpers';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const VelocityChart = () => {
    // Data for time and velocities (Vy)
    const time = [0, 1, 2, 3, 4]; // Time in seconds (x-axis)
    const velocities = [
        {Vx:3,Vy:5,Vz:8},
        {Vx:1,Vy:6,Vz:10},
        {Vx:5,Vy:7,Vz:3},
        {Vx:2,Vy:8,Vz:6},
        {Vx:4,Vy:9,Vz:9},
    ]; // Velocities in m/s (Vy)

    // Chart configuration
    const data = {
        labels: time,  // X-axis (time)
        datasets: [
            {
                label: 'Velocity Vx (m/s)',  // Label for the graph
                data:velocities.map(VeclocityX=>VeclocityX.Vx),  // Y-axis data (velocities)
                borderColor: 'green',  // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Fill under the line
                borderWidth: 2,  // Line thickness
                pointRadius: 5,  // Point size
                fill: true,  // Fill the area under the line
                tension: 0.4,  // Smoothing effect
            },
            {
                label: 'Velocity Vy (m/s)',  // Label for the graph
                data:velocities.map(VeclocityY=>VeclocityY.Vy),  // Y-axis data (velocities)
                borderColor: 'rgba(75, 192, 192, 1)',  // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Fill under the line
                borderWidth: 2,  // Line thickness
                pointRadius: 5,  // Point size
                fill: true,  // Fill the area under the line
                tension: 0.4,  // Smoothing effect
            },
            {
                label: 'Velocity Vz (m/s)',  // Label for Vz
                data: velocities.map(VeclocityZ=>VeclocityZ.Vz),  // Y-axis data for Vz
                borderColor: 'rgba(255, 99, 132, 1)',  // Line color for Vz
                backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Fill under the Vz line
                borderWidth: 2,  // Line thickness for Vz
                pointRadius: 5,  // Point size for Vz
                fill: true,  // Fill the area under the Vz line
                tension: 0.4,  // Smoothing effect
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white', // Change legend text color to white
                },
            },
            title: {
                display: true,
                text: 'Velocity vs Time',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (seconds)',
                    // color: 'white', // X-axis label color
                    // font: {
                    //     size: 14, // Font size for X-axis label
                    // },

                },
                beginAtZero: true,  // Start the y-axis at 0

                ticks: {
                    color: 'white', // X-axis tick labels color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // X-axis grid line color
                },
                border: {
                    color: 'white', // X-axis line color
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Velocity (m/s)',
                    //color: 'white', // Y-axis label color
                    // font: {
                    //     size: 14, // Font size for Y-axis label
                    // },
                    
                },
                beginAtZero: true,  // Start the y-axis at 0
                ticks: {
                    color: 'white', // X-axis tick labels color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // X-axis grid line color
                },
                border: {
                    color: 'white', // X-axis line color
                },
            },
            
            
        },

        
    };

    return (
        <div style={{ backgroundColor: 'black', padding: '20px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default VelocityChart;
