const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
};

const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const updateVehicle = async (req, res) => {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (vehicle) {
        req.app.get('socketio').emit('vehicleUpdated', vehicle);
        res.json(vehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

const deleteVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
