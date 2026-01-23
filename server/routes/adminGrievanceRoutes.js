const express = require('express');
const router = express.Router();
const { getAllGrievances, updateGrievance } = require('../controllers/grievanceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/rbacMiddleware');

// Matches /api/admin/grievances
router.get('/grievances', authMiddleware, adminOnly, getAllGrievances);

// Matches /api/admin/grievances/:id
router.patch('/grievances/:id', authMiddleware, adminOnly, updateGrievance);

module.exports = router;
