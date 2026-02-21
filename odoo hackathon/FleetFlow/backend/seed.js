require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleetflow')
    .then(async () => {
        console.log('MongoDB connected for seeding');

        // Clear existing
        await User.deleteMany();
        await Vehicle.deleteMany();
        await Driver.deleteMany();

        // Seed User
        await User.create({
            email: 'admin@fleetflow.com',
            password: 'password123',
            role: 'Fleet Manager'
        });

        // Seed Vehicles
        await Vehicle.create([
            { name: 'Volvo Truck 1', model: 'VNL 860', licensePlate: 'TRK-1001', capacity: 20000, odometer: 15400, status: 'Available' },
            { name: 'Freightliner Cascadia', model: 'Cascadia 125', licensePlate: 'TRK-1002', capacity: 25000, odometer: 8500, status: 'Available' },
            { name: 'Kenworth T680', model: 'T680', licensePlate: 'TRK-1003', capacity: 22000, odometer: 32000, status: 'In Shop' }
        ]);

        // Seed Drivers
        await Driver.create([
            { name: 'John Doe', dateOfBirth: new Date('1990-05-15'), licenseNumber: 'DL-A100200', licenseExpiry: new Date('2025-12-31'), status: 'On Duty', safetyScore: 98 },
            { name: 'Jane Smith', dateOfBirth: new Date('1985-08-22'), licenseNumber: 'DL-B100300', licenseExpiry: new Date('2024-11-15'), status: 'Off Duty', safetyScore: 100 },
            { name: 'Mike Johnson', dateOfBirth: new Date('1995-02-10'), licenseNumber: 'DL-C100400', licenseExpiry: new Date('2026-05-20'), status: 'On Duty', safetyScore: 85 }
        ]);

        console.log('Database seeded successfully');
        process.exit();
    })
    .catch(err => {
        require('fs').writeFileSync('seed_error_log.txt', String(err.stack));
        process.exit(1);
    });
