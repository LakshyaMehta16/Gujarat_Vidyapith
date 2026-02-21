const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.route('/').get(authenticateToken, getAnalytics);

module.exports = router;
