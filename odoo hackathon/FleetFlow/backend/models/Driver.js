const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiry: { type: Date, required: true },
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'Suspended'],
        default: 'On Duty'
    },
    safetyScore: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
