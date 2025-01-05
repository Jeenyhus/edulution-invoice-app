const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUsers, getUserById, getProfile, updateProfile, updateUser, toggleUserStatus } = require('../controllers/userController');
const db = require('../config/db');

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// User management routes
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

// Update hourly rate
router.put('/:id/hourly-rate', protect, async (req, res) => {
  const { id } = req.params;
  const { hourlyRate } = req.body;

  try {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET hourlyRate = ? WHERE id = ?',
        [hourlyRate, id],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Hourly rate updated successfully' });
  } catch (error) {
    console.error('Error updating hourly rate:', error);
    res.status(500).json({ message: 'Failed to update hourly rate' });
  }
});

// Toggle user status
router.put('/:id/status', protect, toggleUserStatus);

module.exports = router;
