//THIS FILE IS FINAL, ONLY SUBJECT TO CHANGE IN CASE OF ERRORS
//AFTER SUCCESSFUL TESTING, ONLY THE VARIABLES WOULD BE INCREASED, THE LOGIC WOULD REMAIN THE SAME


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
      origin: "http://localhost:3000",
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
  let connection_string = "mongodb://localhost:27017/rocketry-ui"
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
const port = new SerialPort({ path: '/dev/tty-usbserial1', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

//To notify when the port has been opened
port.on('open', () => {
  console.log('Serial port opened');
});

//////////////////////////////////////////////////////////////////////////////////////////////

vectorMagnitude = (vector_x, vector_y, vector_z) =>{
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

//handle serial data, create a new point on the database and send the node to the frontend.
const handleSerialData = (serialArray) =>{
    const time = new Date();
    const node = {
        Vx: serialArray[0],
        Vy: serialArray[1],
        Vz: serialArray[2],
        time: time
    }
    const point = new Point({
        Vx: serialArray[0],
        Vy: serialArray[1],
        Vz: serialArray[2],
        V: vectorMagnitude(serialArray[0],serialArray[1],serialArray[2]),
        time: time
    });

    //The new point is saved to the database
    SensorData.save();
    io.emit('new-data',node);
    console.log(node);
}

/////////////////////////////////////////////////////////////////////////////////////////////

//Assigning which port the server looks for responses in
const port_number = 3001;
server.listen(port_number, 'localhost',() => {
  console.log(`Server listening on port ${port_number}`);
});
