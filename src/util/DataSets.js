import { LinkedList, Node } from "./LinkedList";

//THIS IS STILL WORK UNDER PROGRESS

export function VelocityDataset(linked_list){ 
    return [
    {
        label: 'Vx (m/s)', //label for the legend
        data: linked_list.map((node)=>node.velocities.Vx), //array of values (Vx)
        borderColor: 'green', //Color of the line as well as point border
        tension: 0.05, //For smoother curves
        fill: false //If it was true, would have filled color below the line.
        //Since we have multiple lines, we don't want that
    },
    {
        label: 'Vy (m/s)',
        data: linked_list.map((node)=>node.velocities.Vy),
        borderColor: 'blue',
        tension: 0.05,
        fill: false
    },
    {
        label: 'Vz (m/s)',
        data: linked_list.map((node)=>node.velocities.Vz),
        borderColor: 'red',
        tension: 0.05,
        fill: false
    },
    {
        label: 'V (m/s)',
        data: linked_list.map((node)=>node.velocities.V),
        borderColor: 'yellow',
        tension: 0.05,
        fill: false
    },
];
}

export function AccelerationDataset(linked_list){
    return [
        {
            label: 'Ax (m/s^2)',
            data: linked_list.map((node)=>node.acceleration.Ax),
            borderColor: 'green',
            tension: 0.05,
            fill: false
        },
        {
            label: 'Ay (m/s^2)',
            data: linked_list.map((node)=>node.acceleration.Ay),
            borderColor: 'blue',
            tension: 0.05,
            fill: false
        },
        {
            label: 'Az (m/s^2)',
            data: linked_list.map((node)=>node.acceleration.Az),
            borderColor: 'red',
            tension: 0.05,
            fill: false
        },
        {
            label: 'A (m/s^2)',
            data: linked_list.map((node)=>node.acceleration.A),
            borderColor: 'yellow',
            tension: 0.05,
            fill: false
        }
    ]
}

export function AltitudeDataset(linked_list){
    return [
        {
            label: 'Altitude (m)',
            data: linked_list.map((node)=>node.altitude),
            borderColor: 'violet',
            tension: 0.05,
            fill: false
        }
    ]
}

export function TemperatureDataset(linked_list){
    return [
        {
            label: 'Temperature (deg C)',
            data: linked_list.map((node)=>node.temperature),
            borderColor: 'orange',
            tension: 0.05,
            fill: false
        }
    ]
}

export function PressureDataset(linked_list){
    return [
        {
            label: 'Pressure(Pa)',
            data: linked_list.map((node)=>node.pressure),
            borderColor: 'red',
            tension: 0.05,
            fill: false
        }
    ]
}
