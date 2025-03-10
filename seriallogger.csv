const SerialPort = require("serialport");
const fs = require("fs");
const Readline = require("@serialport/parser-readline");

const port = new SerialPort({path: '/dev/tty-usbserial1', baudRate: 9600 }); // Change COM port if needed
const parser = port.pipe(new Readline({ delimiter: "\n" }));
const csvFilePath = "sensor_data.csv";

// Define expected column names
const HEADERS = ["Vx", "Vy", "Vz", "Ax", "Ay", "Az", "Ox", "Oy", "Oz", "altitude", "temperature", "pressure"];
const EXPECTED_COLUMNS = HEADERS.length;

// Create CSV file with headers if it doesn’t exist
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, [...HEADERS, "timeStamp", "timeMilliSeconds"].join(",") + "\n");
}

// Read serial data
parser.on("data", (data) => {
  try {
    const trimmedData = data.trim(); // Remove unwanted spaces/newlines
    let values = trimmedData.split(","); // Split incoming data by commas

    // Ensure the array has exactly EXPECTED_COLUMNS values
    for (let i = 0; i < EXPECTED_COLUMNS; i++) {
      if (!values[i] || values[i].trim() === "") {
        values[i] = "null"; // Missing data → Replace with 'null'
      } else if (i < 9 && isNaN(values[i])) {  
        values[i] = "NaN"; // If non-numeric in numeric fields (first 9 fields) → Replace with 'NaN'
      }
    }

    // Add timestamps
    const timestamp = new Date().toLocaleTimeString();
    const timeMilliSeconds = Date.now();

    // Construct CSV line
    const csvLine = `${values.join(",")},${timestamp},${timeMilliSeconds}\n`;

    // Append to CSV file
    fs.appendFile(csvFilePath, csvLine, (err) => {
      if (err) console.error("Error:", err);
    });
    // console.log("Data logged:", csvLine.trim());
  } catch (err) {
    console.error("Error processing data:", err);
  }
});
