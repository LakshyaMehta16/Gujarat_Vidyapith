const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const getTrips = async (req, res) => {
    const trips = await Trip.find({}).populate('vehicleId').populate('driverId');
    res.json(trips);
};

const createTrip = async (req, res) => {
    const { vehicleId, driverId, cargoWeight, origin, destination } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await Driver.findById(driverId);

    if (!vehicle || vehicle.status !== 'Available') {
        res.status(400);
        throw new Error('Vehicle not available');
    }

    if (!driver || driver.status !== 'On Duty' || new Date(driver.licenseExpiry) < new Date()) {
        res.status(400);
        throw new Error('Driver not available or license expired');
    }

    if (cargoWeight > vehicle.capacity) {
        res.status(400);
        throw new Error('Cargo weight exceeds vehicle capacity');
    }

    const trip = await Trip.create({
        vehicleId,
        driverId,
        cargoWeight,
        origin,
        destination,
        status: 'Dispatched'
    });

    // Update vehicle and driver status
    vehicle.status = 'On Trip';
    await vehicle.save();

    const populatedTrip = await Trip.findById(trip._id).populate('vehicleId').populate('driverId');

    req.app.get('socketio').emit('tripCreated', populatedTrip);
    req.app.get('socketio').emit('vehicleUpdated', vehicle);

    res.status(201).json(trip);
};

const completeTrip = async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
        res.status(404);
        throw new Error('Trip not found');
    }

    trip.status = 'Completed';
    await trip.save();

    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (vehicle) {
        vehicle.status = 'Available';
        vehicle.odometer += 500; // Mock distance addition
        await vehicle.save();
        req.app.get('socketio').emit('vehicleUpdated', vehicle);
    }

    const driver = await Driver.findById(trip.driverId);
    if (driver) {
        driver.status = 'On Duty';
        await driver.save();
    }

    const populatedTrip = await Trip.findById(trip._id).populate('vehicleId').populate('driverId');
    req.app.get('socketio').emit('tripCompleted', populatedTrip);

    res.json(trip);
};

module.exports = { getTrips, createTrip, completeTrip };
