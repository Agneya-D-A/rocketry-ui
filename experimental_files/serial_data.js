const { SerialPort, ReadlineParser } = require('serialport');
//edit according to os
const port = new SerialPort({ path: '/dev/tty-usbserial1', baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));


port.on('open', () => {
  console.log('Serial port opened');
});

parser.on('data', (data) => {
  console.log(`Raw data received: ${data}`);

  const values = data.split(','); 

  if (values.length === 3) {
// object with Vx, Vy, Vz
    const vectorData = {
      Vx: parseFloat(values[0]),
      Vy: parseFloat(values[1]),
      Vz: parseFloat(values[2]),
    };

    // Calculate the magnitude of the vector
    vectorData.V = Math.sqrt(
      Math.pow(vectorData.Vx, 2) +
      Math.pow(vectorData.Vy, 2) +
      Math.pow(vectorData.Vz, 2)
    );

    console.log('Parsed data object:', vectorData);
  } else {
    console.error('Unexpected data format');
  }
});


port.on('error', (err) => {
  console.error('Error: ', err.message);
});