//THIS FILE IS FINAL, ONLY SUBJECT TO CHANGE IN CASE OF ERRORS
//AFTER SUCCESSFUL TESTING, ONLY THE VARIABLES WOULD BE INCREASED, THE LOGIC WOULD REMAIN THE SAME

//Initializing paths and variables. Change these according to your requirements
require('dotenv').config();
let serialPortPath = process.env.SERIAL_PORT_PATH;
if(!serialPortPath)
    serialPortPath = "COM5";
const baudRate = parseInt(process.env.BAUD_RATE);

const frontendPath = process.env.FRONTEND_PATH;
const fs = require('fs');

const REACT_APP_CENTRE_X = parseFloat(process.env.REACT_APP_CENTRE_X);
const REACT_APP_CENTRE_Y = parseFloat(process.env.REACT_APP_CENTRE_Y);

//This is required for some cross origin request handling. 
//Request is denied if this isn't present
const cors = require('cors');

//Setup CSV Logging
const csvFilePath = process.env.CSV_FILE_PATH;
const HEADERS = ["Vx", "Vy", "Vz","V", "Ax", "Ay", "Az","A", "altitude", "temperature", "pressure","Ox","Oy","Oz","timeStamp", "timeMilliSeconds","positionX","positionY","distanceTraversed"];
const EXPECTED_COLUMNS = HEADERS.length;

if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, HEADERS.join(",") + "\n");
}

//create a server and initialize socket.io to send data from the server
const express = require('express');
const app = express();
app.use(cors());

//socket.io only works with an http server. So this:
const server = require('http').createServer(app);

//This is the socket used for communication between the frontend and the backend
//A server and an options object is taken as the parameter
//The cors object takes the url of the frontend app and grants it the below permissions
const io = require('socket.io')(server, {
    cors: {
      origin: frontendPath,
      methods: ["GET", "POST"],
      allowedHeaders: ['Access-Control-Allow-Origin'],
      credentials: true
    }
});

/////////////////////////////////////////////////////////////////////////////////////

//Connect to MongoDB
//import mongoose for MongoDB operations
// const mongoose = require('mongoose');

// //import SensorData model, a MongoDB schema model
// const SensorData = require('./src/models/SensorData');

//function to connect to MongoDB database
// const connectToDatabsase = async () =>{
//   let connection_string = dbConnectionString;
//   try {
//       await mongoose.connect(connection_string);
//       console.log('Connected to MongoDB via Mongoose!');
//   }
//   catch(error){
//       console.log('Error connecting to MongoDB:', error);
//   }
// }
// connectToDatabsase();

//////////////////////////////////////////////////////////////////////////////////////////////

//Setup serial data reader
const { SerialPort, ReadlineParser } = require('serialport');
const { time } = require('console');
//edit according to os
const port = new SerialPort({path: serialPortPath, baudRate: baudRate });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

//To notify when the port has been opened
port.on('open', () => {
  console.log('Serial port opened');
});

//////////////////////////////////////////////////////////////////////////////////////////////

let vectorMagnitude = (vector_x, vector_y, vector_z) =>{
    //Does the vector addition of 3 components of a vector and returns its magnitude
    return Math.sqrt(Math.pow(vector_x,2)+Math.pow(vector_y,2)+Math.pow(vector_z,2));
}

/////////////////////////////////////////////////////////////////////////////////////////////

//Whenever 'data' event, a builtin event where data is received from the serial occurs, 
//handleSerial function is called on the serialArray
parser.on('data',(data)=>{
    //Split the string into an array of strings. The separation occurs by taking a comma as the divider
    const stringArray = data.trim().split(",");
    // String array is converted to a Float array by converting each value to float
    if(stringArray.length <= 2){
        stringArray.push( new Date().toLocaleTimeString())
        console.log(stringArray);
    }
    else{
        let serialArray = stringArray.map((value)=> parseFloat(value));
        handleSerialData(serialArray);
    }
});

//create a reference time
const executionStartTime = new Date();
//handle serial data, create a new point on the database and send the node to the frontend.
const handleSerialData = (serialArray) =>{
    const time = new Date();
    /*
        The getTime function returns total milliseconds passed since the midnight of Jan 1, 1970 (in sync with unix clock)
        upto the moment where new Date() was called. We use this to get the difference in milliseconds
        between the moment we get data and the moment the program execution starts
    */ 
    const timeMilliSeconds = time.getTime() - executionStartTime.getTime();
    const node = {
        velocities: {
            Vx: serialArray[0],
            Vy: serialArray[1],
            Vz: serialArray[2],
            V: parseFloat(vectorMagnitude(serialArray[0],serialArray[1],serialArray[2])).toFixed(5)
        },
        acceleration: {
            Ax: serialArray[3],
            Ay: serialArray[4],
            Az: serialArray[5],
            A: parseFloat(vectorMagnitude(serialArray[3],serialArray[4],serialArray[5])).toFixed(5)
        },
        altitude: serialArray[6],
        temperature: serialArray[7],
        pressure: serialArray[8],
        orientation: {
            Ox: serialArray[9],
            Oy: serialArray[10],
            Oz: serialArray[11]
        },
        timeStamp: time,
        timeMilliSeconds: timeMilliSeconds,
        position: {
            x: serialArray[12],
            y: serialArray[13],
            distance: Math.sqrt((serialArray[12]- REACT_APP_CENTRE_X)**2 + (serialArray[13]- REACT_APP_CENTRE_Y)**2)
        }
    }
    
    try {
        let values = serialArray.slice(0,3);
        values.push(node.velocities.V);
        values.push(serialArray.slice(3,6));
        values.push(node.acceleration.A);
        values.push(serialArray.slice(6,12));
        values.push([time, timeMilliSeconds]);
        values.push([node.position.x, node.position.y, node.position.distance]);
        
        const csvLine = `${values.join(",")}\n`;

        fs.appendFile(csvFilePath, csvLine, (err) => {
        if (err) console.error("CSV Logging Error:", err);
        });
    } 
    catch (err) {
        console.error("Error processing data for CSV:", err);
    }

    //emit the data through socket.io to the frontend
    io.emit('new-data',JSON.stringify(node));
    console.log(node);
}

/////////////////////////////////////////////////////////////////////////////////////////////

//Assigning which port the server looks for responses in
const port_number = parseInt(process.env.BACKEND_PORT);
server.listen(port_number, 'localhost',() => {
  console.log(`Server listening on port ${port_number}`);
});
