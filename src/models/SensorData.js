const mongoose = require('mongoose');

// Defining schema for sensor data
const sensorDataSchema = new mongoose.Schema({
    velocities: {
        Vx: { type: Number, required: true },
        Vy: { type: Number, required: true },
        Vz: { type: Number, required: true },
        V:  { type: Number, required: true }
    },
    acceleration: {
        Ax: { type: Number, required: true },
        Ay: { type: Number, required: true },
        Az: { type: Number, required: true },
        A:  { type: Number, required: true }
    },
    orientation: {
        Ox: { type: Number, required: true },
        Oy: { type: Number, required: true },
        Oz: { type: Number, required: true }
    },
    altitude: { type: Number, required: true },
    temperature: { type: Number, required: true },
    pressure: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    timeMilliSeconds: { type: Number, required: true}
});

// Create a model from the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
