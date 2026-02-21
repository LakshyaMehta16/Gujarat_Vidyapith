const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
