const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment, addCareer } = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getDepartments);

// Protected routes below this middleware
router.use(protect);
router.post('/', addDepartment);
router.post('/:departmentId/careers', addCareer);

module.exports = router; 