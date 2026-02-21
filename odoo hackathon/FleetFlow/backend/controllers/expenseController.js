const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

const getExpenses = async (req, res) => {
    const expenses = await Expense.find({}).populate('vehicleId');
    res.json(expenses);
};

const createExpense = async (req, res) => {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
};

const addMaintenance = async (req, res) => {
    const { vehicleId, cost, details } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    vehicle.status = 'In Shop';
    await vehicle.save();

    const expense = await Expense.create({
        vehicleId,
        maintenanceCost: cost,
        date: Date.now()
    });

    req.app.get('socketio').emit('vehicleUpdated', vehicle);

    res.status(201).json({ expense, vehicle });
};

module.exports = { getExpenses, createExpense, addMaintenance };
