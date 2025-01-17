const express = require('express');
const router = express.Router();
const { 
  getDepartments, 
  addDepartment, 
  updateDepartment, 
  deleteDepartment,
  addCareer,
  deleteCareer 
} = require('../controllers/departmentController');

router.get('/', getDepartments);
router.post('/', addDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
router.post('/:id/careers', addCareer);
router.delete('/:id/careers/:careerId', deleteCareer);

module.exports = router; 