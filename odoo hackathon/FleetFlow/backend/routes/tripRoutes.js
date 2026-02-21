const express = require('express');
const router = express.Router();
const { getTrips, createTrip, completeTrip } = require('../controllers/tripController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTrips)
    .post(authenticateToken, authorizeRoles('Dispatcher', 'Fleet Manager'), createTrip);

router.route('/:id/complete')
    .put(authenticateToken, authorizeRoles('Dispatcher', 'Fleet Manager'), completeTrip);

module.exports = router;
