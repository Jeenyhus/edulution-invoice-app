const express = require('express');
const dotenv = require('dotenv');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    body: req.method !== 'GET' ? req.body : undefined,
    headers: req.headers
  });
  next();
});

// Public routes (no auth required)
app.use('/api/auth', require('./routes/authRoutes'));

// Protected routes (require authentication)
app.use('/api/tasks', protect, require('./routes/taskRoutes'));
app.use('/api/users', protect, require('./routes/userRoutes'));
app.use('/api/invoices', protect, require('./routes/invoiceRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});