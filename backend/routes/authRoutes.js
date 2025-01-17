const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');

// Regular auth routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth route
router.post('/google', googleLogin);

module.exports = router; 