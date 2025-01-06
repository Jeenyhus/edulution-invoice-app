const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { authenticateToken, isSuperAdmin } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', authenticateToken, isSuperAdmin, updateSettings);

module.exports = router; 