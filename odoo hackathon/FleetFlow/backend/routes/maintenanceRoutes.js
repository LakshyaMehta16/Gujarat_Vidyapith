const express = require('express');
const router = express.Router();
const { addMaintenance } = require('../controllers/expenseController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
    .post(authenticateToken, authorizeRoles('Fleet Manager', 'Safety Officer'), addMaintenance);

module.exports = router;
