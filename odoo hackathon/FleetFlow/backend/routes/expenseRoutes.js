const express = require('express');
const router = express.Router();
const { getExpenses, createExpense } = require('../controllers/expenseController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
    .get(getExpenses)
    .post(authenticateToken, authorizeRoles('Financial Analyst', 'Fleet Manager'), createExpense);

module.exports = router;
