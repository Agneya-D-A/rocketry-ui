//import mongoose for MongoDB operations
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const REACT_APP_CENTRE_X = parseFloat(process.env.REACT_APP_CENTRE_X);
const REACT_APP_CENTRE_Y = parseFloat(process.env.REACT_APP_CENTRE_Y);

//This is required for some cross origin request handling. 
//I've no clue what it means but request is denied if this isn't present
const cors = require('cors');

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
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ['Access-Control-Allow-Origin'],
      credentials: true
    }
  });

// //Connect to MongoDB
// const SensorData = require('./src/models/SensorData');
// // const { timeStamp } = require('console');
// const connectToDatabsase = async () =>{
//   let connection_string = "mongodb://localhost:27017/rocketry-ui"
//   try {
//       await mongoose.connect(connection_string);
//       console.log('Connected to MongoDB via Mongoose!');
//   }
//   catch(error){
//       console.log('Error connecting to MongoDB:', error);
//   }
// }
// connectToDatabsase();
const csvFilePath = process.env.CSV_FILE_PATH;
const HEADERS = ["Vx", "Vy", "Vz","V", "Ax", "Ay", "Az","A", "altitude", "temperature", "pressure","Ox","Oy","Oz","timeStamp", "timeMilliSeconds","positionX","positionY","distanceTraversed"];
const EXPECTED_COLUMNS = HEADERS.length;

// Create CSV with headers if it doesn't exist
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, HEADERS.join(",") + "\n");
}

//Example insertions
//Just used an array of arrays to mimic the array we are going to obtain after splitting the serial string
let insetionMatrix = [
    [1, 2, 3, 4, 5, 6, 100, 25,0,45,10,120],
    [0, -1, 2, 0, 0, 0, 200, 24,10,-30,-20,122],
    [3, 1, 0, -2, 1, 4, 150, 23,-30,180,50,145],
    [2, 2, 2, 2, 2, 2, 180, 22,180,28.9,-160,260]
];

//used for traversing the above array. This mimics the first time, the second time and the third time we get data
let index = 0;

const vectorMagnitude = (vector_x, vector_y, vector_z) =>{
    //Does the vector addition of 3 components of a vector and returns its magnitude
    return Math.sqrt(Math.pow(vector_x,2)+Math.pow(vector_y,2)+Math.pow(vector_z,2));
}

//handle serial data, create a new point on the database and send the node to the frontend.
//The function below is just set to mimic getting actual data. This will be replaced with the actual function.
let executionStartTime = new Date();
let positions = [REACT_APP_CENTRE_X,REACT_APP_CENTRE_Y];
let timerFunction = setInterval(()=>handleSerialData(), 3000);

const handleSerialData = () =>{
        const serialArray = insetionMatrix[index];
        serialArray.push(...positions);
        index = (index + 1)%4;
        const time = new Date();
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
        console.log(REACT_APP_CENTRE_X);
        console.log(REACT_APP_CENTRE_Y);
        console.log(positions);

        // CSV logging logic
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
      
        } catch (err) {
          console.error("Error processing data for CSV:", err);
        }

        io.emit('new-data',JSON.stringify(node));
        console.log(node);
        positions[0] += 12;
        positions[1] += 15;
}


//Assigning which port the server looks for responses in
const port = 3001;
server.listen(port, 'localhost',() => {
  console.log(`Server listening on port ${port}`);
});
