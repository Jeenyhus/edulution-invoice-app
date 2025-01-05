const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getReportData } = require('../controllers/reportController');

// Only allow admins and superadmins to access reports
const adminOnly = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

router.get('/', protect, adminOnly, getReportData);

module.exports = router; 