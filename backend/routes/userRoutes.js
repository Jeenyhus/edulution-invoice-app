const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getProfile, updateProfile, getUsers, getUserById } = require('../controllers/userController');

// Get user profile
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);

module.exports = router;
