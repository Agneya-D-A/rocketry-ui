import React from 'react';
import './Graph.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    Legend,
    Tooltip,
    PointElement,
    CategoryScale,
    LinearScale,
    plugins,
    Title,
    Scale

} from 'chart.js';
import { color } from 'chart.js/helpers';

ChartJS.register(
    LineElement,
    Legend,
    Tooltip,
    PointElement,
    CategoryScale,
    LinearScale,
    plugins,
    Title,
    Scale
)

export default function Graph({linked_list, purpose}){
    const data = {
        labels: linked_list.map((node)=>node.timeMilliSeconds),
        datasets: 
            purpose ==='velocity'? 
                [
                    {
                        label: 'Vx (m/s)',
                        data: linked_list.map((node)=>node.velocities.Vx),
                        borderColor: 'green',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Vy (m/s)',
                        data: linked_list.map((node)=>node.velocities.Vy),
                        borderColor: 'blue',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Vz (m/s)',
                        data: linked_list.map((node)=>node.velocities.Vz),
                        borderColor: 'red',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'V (m/s)',
                        data: linked_list.map((node)=>node.velocities.V),
                        borderColor: 'yellow',
                        tension: 0.4,
                        fill: false
                    },
                ]
            :purpose ==='acceleration' ? 
                [
                    {
                        label: 'Ax (m/s^2)',
                        data: linked_list.map((node)=>node.acceleration.Ax),
                        borderColor: 'green',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Ay (m/s^2)',
                        data: linked_list.map((node)=>node.acceleration.Ay),
                        borderColor: 'blue',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Az (m/s^2)',
                        data: linked_list.map((node)=>node.acceleration.Az),
                        borderColor: 'red',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'A (m/s^2)',
                        data: linked_list.map((node)=>node.acceleration.A),
                        borderColor: 'yellow',
                        tension: 0.4,
                        fill: false
                    }
                ]
            :purpose==='altitude'?
                [
                    {
                        label: 'Altitude (m)',
                        data: linked_list.map((node)=>node.altitude),
                        borderColor: 'violet',
                        tension: 0.4,
                        fill: false
                    }
                ]
            :purpose === 'temperature'?
                [
                    {
                        label: 'Temperature (deg C)',
                        data: linked_list.map((node)=>node.temperature),
                        borderColor: 'orange',
                        tension: 0.4,
                        fill: false
                    }
                ]
            : []
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: true
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (milliseconds)',
                    color: '#545454'

                },
                beginAtZero: true,  // Start the x-axis at 0

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
                beginAtZero: true,  // Start the y-axis at 0
                ticks: {
                    color: 'white', // y-axis tick labels color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // X-axis grid line color
                },
                border: {
                    color: 'white', // y-axis line color
                },
            }
        }
    }
    return (
        <div className='graph'>
            {linked_list.length!==0 
            && [
                <Line data={data} options={options} ></Line>,
                <h3 className='graph-bottom-text'>{purpose}: {
                    purpose ==='velocity'? `${linked_list.tail.velocities.V} m/s`
                    :purpose ==='acceleration'? `${linked_list.tail.acceleration.A} m/s^2`
                    :purpose==='altitude'? `${linked_list.tail.altitude} m`
                    :purpose==='temperature'? `${linked_list.tail.temperature} deg C`
                    :""
                }</h3>
                ]
            }
        </div>
    )
}