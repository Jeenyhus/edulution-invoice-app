const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Public routes - no auth required
router.post('/login', login);
router.post('/register', register);

module.exports = router; 