//THIS FILE IS FINAL, ONLY SUBJECT TO CHANGE IN CASE OF ERRORS
//AFTER SUCCESSFUL TESTING, ONLY THE VARIABLES WOULD BE INCREASED, THE LOGIC WOULD REMAIN THE SAME

//Initializing paths and variables. Change these according to your requirements
const frontendPath = "http://localhost:3000";
const dbConnectionString = "mongodb://localhost:27017/rocketry-ui";
const serialPortPath = "COM3/USB/VID_1A86&PID_7523/6&22A3D4F&0&2";
const baudRate = 9600;

//This is required for some cross origin request handling. 
//Request is denied if this isn't present
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
      origin: frontendPath,
      methods: ["GET", "POST"],
      allowedHeaders: ['Access-Control-Allow-Origin'],
      credentials: true
    }
});

/////////////////////////////////////////////////////////////////////////////////////

//Connect to MongoDB
//import mongoose for MongoDB operations
const mongoose = require('mongoose');

//import SensorData model, a MongoDB schema model
const SensorData = require('./src/models/SensorData');

//function to connect to MongoDB database
const connectToDatabsase = async () =>{
  let connection_string = dbConnectionString;
  try {
      await mongoose.connect(connection_string);
      console.log('Connected to MongoDB via Mongoose!');
  }
  catch(error){
      console.log('Error connecting to MongoDB:', error);
  }
}
connectToDatabsase();

//////////////////////////////////////////////////////////////////////////////////////////////

//Setup serial data reader
const { SerialPort, ReadlineParser } = require('serialport');
//edit according to os
const port = new SerialPort({ path: serialPortPath, baudRate: baudRate });
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
    const stringArray = data.split(",");
    // String array is converted to a Float array by converting each value to float
    let serialArray = stringArray.map((value)=> parseFloat(value));
    handleSerialData(serialArray);
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
            V: vectorMagnitude(serialArray[0],serialArray[1],serialArray[2]).toFixed(5) //rounds to 5 decimal places
        },
        acceleration: {
            Ax: serialArray[3],
            Ay: serialArray[4],
            Az: serialArray[5],
            A: vectorMagnitude(serialArray[3],serialArray[4],serialArray[5]).toFixed(5)
        },
        altitude: serialArray[6],
        temperature: serialArray[7],
        pressure: serialArray[8],
        timeStamp: time,
        timeMilliSeconds: timeMilliSeconds
    }

    //create a new databse model object using the node and spreading it
    const point = new SensorData({ ...node });
    //save it to the database
    point.save();

    //emit the data through socket.io to the frontend
    io.emit('new-data',JSON.stringify(node));
    console.log(node);
}

/////////////////////////////////////////////////////////////////////////////////////////////

//Assigning which port the server looks for responses in
const port_number = 3001;
server.listen(port_number, 'localhost',() => {
  console.log(`Server listening on port ${port_number}`);
});
