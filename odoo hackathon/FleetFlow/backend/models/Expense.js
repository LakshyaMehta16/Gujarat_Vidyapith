const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    fuelLiters: { type: Number, default: 0 },
    fuelCost: { type: Number, default: 0 },
    maintenanceCost: { type: Number, default: 0 },
    date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
