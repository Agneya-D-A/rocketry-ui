//BE CAREFUL IF YOU'RE CHANGING STYLES
//SOMETIMES IT SHRINKS IN HALF.

import React, {useContext} from 'react';
import './Graph.css';
import { Line } from 'react-chartjs-2';
import { ThemeContext } from '../App';

//import chart elements from chart.js
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
    scales

} from 'chart.js';
import { color } from 'chart.js/helpers';

//register the imported elements with the chart
ChartJS.register(
    LineElement,
    Legend,
    Tooltip,
    PointElement,
    CategoryScale,
    LinearScale,
    plugins,
    Title,
    scales
)

//Something funny was happening with legend colors. I resorted to set the color I want as default
ChartJS.defaults.color = '#AAA'; 

export default function Graph({linked_list, purpose}){
    const {theme, setTheme} = useContext(ThemeContext);
    //data parameter for the Line component
    const data = {
        labels: linked_list.map((node)=>node.timeMilliSeconds), //time in milliseconds on the x-axis
        //for the dataset, conditional rendering is used. A dataset is selected based on what graph this is
        //ternary operator is used
        datasets: 
            purpose ==='velocity'? 
                [
                    {
                        label: 'Vx (m/s)', //label for the legend
                        data: linked_list.map((node)=>node.velocities.Vx), //array of values (Vx)
                        borderColor: 'green', //Color of the line as well as point border
                        tension: 0.4, //For smoother curves
                        fill: false //If it was true, would have filled color below the line.
                        //Since we have multiple lines, we don't want that
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
        //options parameter for the Line component
        responsive: true,
        maintainAspectRatio: false, //when the graph is responsive, it acts funny if this isn't set to false
        plugins: {
            legend: {
                color: "black"
            }
        },
        scales: {
            x: {
                title: { //Title in the x - axis
                    display: true,
                    text: 'Time (milliseconds)',
                    color: theme=="dark" ? '#AAAAAA' : "#222222"

                },
                beginAtZero: true,  // Start the x-axis at 0

                ticks: {
                    color: theme=="dark" ? 'white' : 'black', // X-axis tick labels color
                },
                grid: {
                    color: theme=="dark"? 'rgba(255, 255, 255, 0.2)' : 'rgba(2, 2, 2, 0.2)', // X-axis grid line color
                },
                border: {
                    color: theme=="dark" ? 'white' : "light", // X-axis line color
                },
            },
            y: {
                title: {
                    //Blank y axis for reusability of the component. 
                    //For some reason, doesn't work if I only give a title to the x - axis instead.
                    //This too is necessary
                    display: true,
                    text: ' ',
                    color: '#FFF'
                },
                beginAtZero: true,  // Start the y-axis at 0
                ticks: {
                    color: theme=="dark" ? 'white' : 'black', // y-axis tick labels color
                },
                grid: {
                    color: theme=="dark"? 'rgba(255, 255, 255, 0.2)' : 'rgba(2, 2, 2, 0.2)', // X-axis grid line color
                },
                border: {
                    color: theme=="dark" ? 'white' : 'black', // y-axis line color
                },
            }
        }
    }
    return (
        <div className= {`graph ${theme}`}>
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

/*

Conditional rendering is used here.
In order to handle the first condirion where we have received no data from the graph,
we check if the length of the linked list is 0. If it is, the Line component is not rendered
Since there is no data, it would have thrown an error. This is done to avoid such errors
Here, && is used for conditional rendering. It is a concept in javascript where, it keeps on checking the values
one by one. If a value is false, it returns false. Else, it returns the last truthy value,
in our case, the component we want
Again a ternary operator is used for the contents of h3

*/