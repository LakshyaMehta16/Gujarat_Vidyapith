const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    cargoWeight: { type: Number, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        default: 'Draft'
    }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
