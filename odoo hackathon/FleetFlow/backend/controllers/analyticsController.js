const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

const getAnalytics = async (req, res) => {
    const vehicles = await Vehicle.find({});
    const trips = await Trip.find({});
    const expenses = await Expense.find({});

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
    const inShopVehicles = vehicles.filter(v => v.status === 'In Shop').length;

    const utilizationRate = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(2) : 0;

    let totalFuelLiters = 0;
    let totalFuelCost = 0;
    let totalMaintenanceCost = 0;

    expenses.forEach(e => {
        totalFuelLiters += (e.fuelLiters || 0);
        totalFuelCost += (e.fuelCost || 0);
        totalMaintenanceCost += (e.maintenanceCost || 0);
    });

    const totalRevenueMock = trips.filter(t => t.status === 'Completed').length * 1500; // Mock revenue per trip
    const acquisitionCostMock = totalVehicles * 120000; // Mock acquisition cost per vehicle

    const vehicleROI = acquisitionCostMock > 0 ? (((totalRevenueMock - (totalFuelCost + totalMaintenanceCost)) / acquisitionCostMock) * 100).toFixed(2) : 0;

    const totalKm = vehicles.reduce((acc, v) => acc + v.odometer, 0);
    const fuelEfficiency = totalFuelLiters > 0 ? (totalKm / totalFuelLiters).toFixed(2) : 0;

    res.json({
        activeFleetCount: activeVehicles,
        maintenanceAlertsCount: inShopVehicles,
        utilizationRate: `${utilizationRate}%`,
        pendingCargo: trips.filter(t => t.status === 'Draft' || t.status === 'Dispatched').reduce((acc, t) => acc + t.cargoWeight, 0),
        fuelEfficiency: `${fuelEfficiency} km/l`,
        vehicleROI: `${vehicleROI}%`,
        totalRevenue: totalRevenueMock,
        totalExpenses: totalFuelCost + totalMaintenanceCost
    });
};

module.exports = { getAnalytics };
