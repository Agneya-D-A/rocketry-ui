//import mongoose for MongoDB operations
const mongoose = require('mongoose');



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

//Connect to MongoDB
const Point = require('./src/models/Point');
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

//Example insertions
//Just used an array of arrays to mimic the array we are going to obtain after splitting the serial string
let insetionMatrix = [[19,29,39],[10,20,30],[3,4,5]];

//used for traversing the above array. This mimics the first time, the second time and the third time we get data
let index = 0;

let vectorMagnitude = (vector_x, vector_y, vector_z) =>{
    //Does the vector addition of 3 components of a vector and returns its magnitude
    return Math.sqrt(Math.pow(vector_x,2)+Math.pow(vector_y,2)+Math.pow(vector_z,2));
}

//handle serial data, create a new point on the database and send the node to the frontend.
//The function below is just set to mimic getting actual data. This will be replaced with the actual function.
const handleSerialData = () =>{
    if(index==insetionMatrix.length){
        //stops the function from looping
        clearInterval(handleSerialData);
    }
    else{
        const serialArray = insetionMatrix[index++];
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

        point.save();
        io.emit('new-data',node);
        console.log(node);
    }
}

//calls the handleSerialData function once every 3000 milliseconds. Just for testing
setInterval(handleSerialData, 3000);

//Assigning which port the server looks for responses in
const port = 3001;
server.listen(port, 'localhost',() => {
  console.log(`Server listening on port ${port}`);
});




