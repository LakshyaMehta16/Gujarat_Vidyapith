const express = require('express');
const router = express.Router();
const { getDrivers, createDriver, deleteDriver } = require('../controllers/driverController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
    .get(getDrivers)
    .post(authenticateToken, authorizeRoles('Fleet Manager', 'Safety Officer'), createDriver);

router.route('/:id')
    .delete(authenticateToken, authorizeRoles('Fleet Manager', 'Safety Officer'), deleteDriver);

module.exports = router;
