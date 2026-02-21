const express = require('express');
const router = express.Router();
const { getVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
    .get(getVehicles)
    .post(authenticateToken, authorizeRoles('Fleet Manager'), createVehicle);

router.route('/:id')
    .put(authenticateToken, authorizeRoles('Fleet Manager', 'Dispatcher'), updateVehicle)
    .delete(authenticateToken, authorizeRoles('Fleet Manager'), deleteVehicle);

module.exports = router;
