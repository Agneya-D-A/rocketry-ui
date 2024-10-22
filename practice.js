const { SerialPort } = require('serialport')
const port = new SerialPort({
  path: 'C:/WINDOWS/system32/DRIVERS/usbser.sys',
  baudRate: 9600,
  autoOpen: true,
});

port.on('open', function() {
    console.log("Opened");
  })