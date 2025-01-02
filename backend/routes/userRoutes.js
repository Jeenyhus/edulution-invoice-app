const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');

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

module.exports = router;
