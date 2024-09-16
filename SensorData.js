const mongoose = require('mongoose');

// Defining schema for sensor data
const sensorDataSchema = new mongoose.Schema({
    velocities: {
        Vx: { type: Number, required: true },
        Vy: { type: Number, required: true },
        Vz: { type: Number, required: true }
    },
    acceleration: {
        Ax: { type: Number, required: true },
        Ay: { type: Number, required: true },
        Az: { type: Number, required: true }
    },
    altitude: { type: Number, required: true },
    temperature: { type: Number, required: true },
    timeMilliSeconds: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Adding virtual field for effective velocity (v_eff)
sensorDataSchema.virtual('v_eff').get(function() {
    return Math.sqrt(
        this.velocities.Vx ** 2 +
        this.velocities.Vy ** 2 +
        this.velocities.Vz ** 2
    );
});

// Adding virtual field for effective acceleration (a_eff)
sensorDataSchema.virtual('a_eff').get(function() {
    return Math.sqrt(
        this.acceleration.Ax ** 2 +
        this.acceleration.Ay ** 2 +
        this.acceleration.Az ** 2
    );
});

// Ensure virtuals are included in toJSON and toObject
sensorDataSchema.set('toJSON', { virtuals: true });
sensorDataSchema.set('toObject', { virtuals: true });

// Create a model from the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);
module.exports = SensorData;
