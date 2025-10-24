require('dotenv').config();
const fs = require('fs');
const { SerialPort, ReadlineParser } = require('serialport');
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

let serialPortPath = process.env.SERIAL_PORT_PATH || 'COM5';
const baudRate = parseInt(process.env.BAUD_RATE) || 115200;
const frontendPath = process.env.FRONTEND_PATH;
const csvFilePath = process.env.CSV_FILE_PATH;
const REACT_APP_CENTRE_X = parseFloat(process.env.REACT_APP_CENTRE_X);
const REACT_APP_CENTRE_Y = parseFloat(process.env.REACT_APP_CENTRE_Y);

const HEADERS = ['altitude','pitch','roll','yaw','Ax','Ay','Az','Vx','Vy','Vz','temperature','pressure','latitude','longitude','timeStamp','timeMilliSeconds'];
if (!fs.existsSync(csvFilePath)) fs.writeFileSync(csvFilePath, HEADERS.join(',') + '\n');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: frontendPath, methods: ['GET','POST'], credentials: true }});

const port = new SerialPort({ path: serialPortPath, baudRate: baudRate });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
port.on('open', () => console.log('Serial port opened'));

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const vectorMagnitude = (vector_x, vector_y, vector_z) =>{
    //Does the vector addition of 3 components of a vector and returns its magnitude
    return Math.sqrt(Math.pow(vector_x,2)+Math.pow(vector_y,2)+Math.pow(vector_z,2));
}

let executionStartTime = new Date();

parser.on('data', (data) => {
    const tempArray = data.trim().split(',');
    if (tempArray.length <= 2) {
    console.log(data); // Log the raw data if not enough fields
    return;
    }

    const serialArray = tempArray.map(parseFloat);


  const time = new Date();
  const timeMilliSeconds = time.getTime() - executionStartTime.getTime();

    const node = {
    velocities: {
        Vx: serialArray[7],
        Vy: serialArray[8],
        Vz: serialArray[9],
        V: parseFloat(vectorMagnitude(serialArray[7], serialArray[8], serialArray[9])).toFixed(5),
    },
    acceleration: {
        Ax: serialArray[4],
        Ay: serialArray[5],
        Az: serialArray[6],
        A: parseFloat(vectorMagnitude(serialArray[4], serialArray[5], serialArray[6])).toFixed(5),
    },
    altitude: serialArray[0],
    temperature: serialArray[10],
    pressure: serialArray[11],
    orientation: {
        Ox: serialArray[1], // pitch
        Oy: serialArray[2], // roll
        Oz: serialArray[3], // yaw
    },
    timeStamp: time,
    timeMilliSeconds: timeMilliSeconds,
    position: {
        x: serialArray[13], // longitude
        y: serialArray[12], // latitude
        distance: haversineDistance(REACT_APP_CENTRE_Y, REACT_APP_CENTRE_X, serialArray[12], serialArray[13]),
    },
    };


  const csvLine = `${serialArray.join(',')},${time.toISOString()},${timeMilliSeconds}\n`;
  fs.appendFile(csvFilePath, csvLine, (err) => { if (err) console.error('CSV Logging Error:', err); });

  io.emit('new-data', JSON.stringify(node));
  console.log(node);
});

const port_number = parseInt(process.env.BACKEND_PORT) || 3001;
server.listen(port_number, 'localhost', () => console.log(`Server running on port ${port_number}`));
