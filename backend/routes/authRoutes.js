const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Public routes - no auth required
router.post('/register', (req, res, next) => {
  console.log('Register route hit:', req.body);
  next();
}, register);

router.post('/login', login);

module.exports = router; 