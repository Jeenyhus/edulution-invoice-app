const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { initializeDb } = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://edulution-invoice-frontend.onrender.com']
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/api/auth', require('./routes/authRoutes'));

// Protected routes
app.use('/api/tasks', protect, require('./routes/taskRoutes'));
app.use('/api/users', protect, require('./routes/userRoutes'));
app.use('/api/invoices', protect, require('./routes/invoiceRoutes'));

// Database reset route (protected)
app.delete('/api/admin/reset-db', protect, async function(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    console.log('Starting database reset...');
    
    // Delete database file
    const fs = require('fs');
    const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
    
    // Create a new database connection
    const newDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('Error creating new database:', err);
        throw err;
      }
      console.log('Created new database connection');
    });

    // Update the db reference in the config
    require('./config/db').db = newDb;

    // Initialize the new database
    console.log('Initializing new database...');
    await initializeDb();
    console.log('Database initialized successfully');

    res.json({ 
      message: 'Database reset successful',
      timestamp: new Date().toISOString(),
      path: dbPath
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ 
      error: 'Failed to reset database',
      message: error.message,
      stack: error.stack
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Add this near the top with other routes
app.get('/', (req, res) => {
  res.json({
    message: 'Edulution Invoice API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      users: '/api/users',
      invoices: '/api/invoices'
    }
  });
});

const PORT = process.env.PORT || 5001;

// Initialize database and start server
const start = async () => {
  try {
    console.log('Initializing database...');
    await initializeDb();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});