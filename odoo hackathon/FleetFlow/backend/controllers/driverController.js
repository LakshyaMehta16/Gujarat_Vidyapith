const Driver = require('../models/Driver');

const getDrivers = async (req, res) => {
    const drivers = await Driver.find({});
    res.json(drivers);
};

const createDriver = async (req, res) => {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
};

const deleteDriver = async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    if (driver) {
        await driver.deleteOne();
        res.json({ message: 'Driver removed' });
    } else {
        res.status(404);
        throw new Error('Driver not found');
    }
};

module.exports = { getDrivers, createDriver, deleteDriver };
