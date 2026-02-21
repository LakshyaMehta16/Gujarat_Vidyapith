require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleetflow', {
            serverSelectionTimeoutMS: 2000
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Local MongoDB connection failed, starting an in-memory database temporarily...');
        try {
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log(`Connected to In-Memory MongoDB at: ${uri}`);
        } catch (memErr) {
            console.error('Failed to start in-memory MongoDB:', memErr);
        }
    }
};

connectDB();

// Route dependencies
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Routes mounted
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FleetFlow Backend is running' });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing, return all requests to React app
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Error middleware
app.use(errorHandler);

// Socket.io for real-time updates
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Expose io to routes by attaching to req (optional, or export it)
app.set('socketio', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
