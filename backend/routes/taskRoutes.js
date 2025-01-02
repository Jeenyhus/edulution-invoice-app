const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// Protect all task routes
router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
