const express = require('express');
const router = express.Router();
const { getAllGrievances, updateGrievance } = require('../controllers/grievanceController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/rbacMiddleware');

// Matches /api/admin/grievances
router.get('/grievances', authMiddleware, isAdmin, getAllGrievances);

// Matches /api/admin/grievances/:id
router.patch('/grievances/:id', authMiddleware, isAdmin, updateGrievance);

module.exports = router;
