//needs to be tested before finalising 
//added contents of server logger js file

const SerialPort = require("serialport");
const fs = require("fs");
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { ReadlineParser } = require("serialport");

// Frontend and DB config
const frontendPath = "http://localhost:3000";
const dbConnectionString = "mongodb://localhost:27017/rocketry-ui";
const serialPortPath = "COM8/USB/VID_2341&PID_0043/14011"; // Use actual serial path
const baudRate = 9600;

// CSV logging config
const csvFilePath = "sensor_data.csv";
const HEADERS = ["Vx", "Vy", "Vz", "Ax", "Ay", "Az", "altitude", "temperature", "pressure"];
const EXPECTED_COLUMNS = HEADERS.length;

// Create CSV with headers if it doesn't exist
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, [...HEADERS, "timeStamp", "timeMilliSeconds"].join(",") + "\n");
}

// Express and Socket.IO setup
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: frontendPath,
    methods: ["GET", "POST"],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true
  }
});

// MongoDB setup
const SensorData = require('./src/models/SensorData');
const connectToDatabsase = async () => {
  try {
    await mongoose.connect(dbConnectionString);
    console.log('Connected to MongoDB via Mongoose!');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
}
connectToDatabsase();

// Serial port setup
const port = new SerialPort({ path: serialPortPath, baudRate: baudRate });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.on('open', () => {
  console.log('Serial port opened');
});

const executionStartTime = new Date();

const vectorMagnitude = (x, y, z) => {
  return Math.sqrt(x * x + y * y + z * z);
};

parser.on('data', (data) => {
  const stringArray = data.split(",");
  let serialArray = stringArray.map((value) => parseFloat(value));
  handleSerialData(serialArray);

  // CSV logging logic
  try {
    let values = stringArray.map((val, i) => {
      if (!val || val.trim() === "") return "null";
      if (i < 9 && isNaN(val)) return "NaN";
      return val.trim();
    });

    const timestamp = new Date().toLocaleTimeString();
    const timeMilliSeconds = Date.now();
    const csvLine = `${values.join(",")},${timestamp},${timeMilliSeconds}\n`;

    fs.appendFile(csvFilePath, csvLine, (err) => {
      if (err) console.error("CSV Logging Error:", err);
    });

  } catch (err) {
    console.error("Error processing data for CSV:", err);
  }
});

const handleSerialData = (serialArray) => {
  const time = new Date();
  const timeMilliSeconds = time.getTime() - executionStartTime.getTime();

  const node = {
    velocities: {
      Vx: serialArray[0],
      Vy: serialArray[1],
      Vz: serialArray[2],
      V: vectorMagnitude(serialArray[0], serialArray[1], serialArray[2]).toFixed(5)
    },
    acceleration: {
      Ax: serialArray[3],
      Ay: serialArray[4],
      Az: serialArray[5],
      A: vectorMagnitude(serialArray[3], serialArray[4], serialArray[5]).toFixed(5)
    },
    altitude: serialArray[6],
    temperature: serialArray[7],
    pressure: serialArray[8],
    timeStamp: time,
    timeMilliSeconds: timeMilliSeconds
  };

  const point = new SensorData({ ...node });
  point.save();
  io.emit('new-data', JSON.stringify(node));
  console.log(node);
};

// Start the server
const port_number = 3001;
server.listen(port_number, 'localhost', () => {
  console.log(`Server listening on port ${port_number}`);
});
