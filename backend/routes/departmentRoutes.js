const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment, addCareer } = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');

// All routes should be protected
router.use(protect);

// Get all departments
router.get('/', getDepartments);

// Add new department
router.post('/', addDepartment);

// Add career to department
router.post('/:departmentId/careers', addCareer);

module.exports = router; 