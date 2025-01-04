const express = require('express');
const dotenv = require('dotenv');
const { protect } = require('./middleware/authMiddleware');
const { initializeDb } = require('./config/db');

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', protect, require('./routes/taskRoutes'));
app.use('/api/users', protect, require('./routes/userRoutes'));
app.use('/api/invoices', protect, require('./routes/invoiceRoutes'));

const PORT = process.env.PORT || 5001;

// Initialize database and start server
const start = async () => {
  try {
    console.log('Initializing database...');
    await initializeDb();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});