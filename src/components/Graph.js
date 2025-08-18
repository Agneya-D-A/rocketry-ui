//BE CAREFUL IF YOU'RE CHANGING STYLES
//SOMETIMES IT SHRINKS IN HALF.

import React, {useContext} from 'react';
import './Graph.css';
import { Line } from 'react-chartjs-2';
import { ThemeContext } from '../App';
import { VelocityDataset, AccelerationDataset, PressureDataset, AltitudeDataset, TemperatureDataset } from '../util/DataSets';

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
                VelocityDataset(linked_list)
            :purpose ==='acceleration' ? 
                AccelerationDataset(linked_list)
            :purpose==='altitude'?
                AltitudeDataset(linked_list)
            :purpose === 'temperature'?
                TemperatureDataset(linked_list)
            :purpose === 'pressure'?
                PressureDataset(linked_list)
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
                    color: theme==="dark" ? '#AAAAAA' : "#222222"

                },
                beginAtZero: true,  // Start the x-axis at 0

                ticks: {
                    color: theme==="dark" ? 'white' : 'black', // X-axis tick labels color
                },
                grid: {
                    color: theme==="dark"? 'rgba(255, 255, 255, 0.2)' : 'rgba(2, 2, 2, 0.2)', // X-axis grid line color
                },
                border: {
                    color: theme==="dark" ? 'white' : "light", // X-axis line color
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
                    color: theme==="dark" ? 'white' : 'black', // y-axis tick labels color
                },
                grid: {
                    color: theme==="dark"? 'rgba(255, 255, 255, 0.2)' : 'rgba(2, 2, 2, 0.2)', // X-axis grid line color
                },
                border: {
                    color: theme==="dark" ? 'white' : 'black', // y-axis line color
                },
            }
        }
    }
    return (
        <div className= {`graph ${theme}`} style={purpose=='pressure'?{
                justifySelf: 'center',
                gridColumn: "1/span 2"
            }: null}>
            {linked_list.length!==0 
            && [
                <Line data={data} options={options} ></Line>,
                <h3 className='graph-bottom-text'>{purpose}: {
                    purpose ==='velocity'? `${linked_list.tail.velocities.V} m/s`
                    :purpose ==='acceleration'? `${linked_list.tail.acceleration.A} m/s^2`
                    :purpose==='altitude'? `${linked_list.tail.altitude} m`
                    :purpose==='temperature'? `${linked_list.tail.temperature} deg C`
                    :purpose==='pressure'? `${linked_list.tail.pressure} Pa`

                    :""
                }</h3>
                ]
            }
        </div>
    )
}
