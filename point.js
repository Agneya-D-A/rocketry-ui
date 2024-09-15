const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sensor-database', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

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
    timestamp: { type: Date, default: Date.now }
});

// Create a model from the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Mock sensor data
const mockSensorData = new SensorData({
    velocities: { Vx: 5.5, Vy: 2.3, Vz: 9.1 },
    acceleration: { Ax: 1.2, Ay: 0.8, Az: 3.6 },
    altitude: 1234,
    temperature: 22.5
});

// Save the mock data to the database
mockSensorData.save()
    .then(() => console.log('Mock sensor data saved successfully!'))
    .catch((error) => console.error('Error saving mock sensor data:', error));
