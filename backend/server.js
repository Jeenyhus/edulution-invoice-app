const express = require('express');
const dotenv = require('dotenv');
const { protect } = require('./middleware/authMiddleware');
const { initializeDb } = require('./config/db');
const departmentRoutes = require('./routes/departmentRoutes');

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
app.use('/api/departments', departmentRoutes);
app.use('/api/settings', require('./routes/settingsRoutes'));

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const start = async () => {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();