const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const db = require('../config/db');

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// Define routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/hourly-rate', async (req, res) => {
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

module.exports = router;
