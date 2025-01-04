const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { protect, admin } = require('./middleware/authMiddleware');
const { initializeDb, debugDatabase, db } = require('./config/db');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://edulution-invoice-frontend.onrender.com']
    : 'http://localhost:3000',
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Edulution Invoice API is running',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      users: '/api/users',
      invoices: '/api/invoices'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', protect, require('./routes/taskRoutes'));
app.use('/api/users', protect, require('./routes/userRoutes'));
app.use('/api/invoices', protect, require('./routes/invoiceRoutes'));

// Admin routes
app.use('/api/admin', protect, admin, require('./routes/adminRoutes'));

// Add this route before your other routes
app.get('/api/debug/db', async (req, res) => {
  try {
    const tables = await debugDatabase();
    res.json({ 
      status: 'ok',
      dbPath: path.join(process.cwd(), 'data', 'database.sqlite'),
      tables,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database debug failed',
      message: error.message 
    });
  }
});

// Add this route before your other routes
app.get('/api/debug/test-db', async (req, res) => {
  try {
    // Test database connection
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
      if (err) {
        console.error('Database test error:', err);
        res.status(500).json({ 
          error: 'Database test failed',
          message: err.message,
          dbPath: dbPath
        });
      } else {
        res.json({ 
          status: 'ok',
          userCount: row.count,
          dbPath: dbPath,
          tables: ['users', 'tasks']
        });
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database test failed',
      message: error.message,
      dbPath: dbPath
    });
  }
});

// Add this route before your other routes
app.delete('/api/admin/reset-db', async (req, res) => {
  try {
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

// Add a route to check database status
app.get('/api/admin/db-status', (req, res) => {
  const fs = require('fs');
  const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
  
  try {
    // Check if database file exists
    const exists = fs.existsSync(dbPath);
    
    // Test database connection
    const { db } = require('./config/db');
    db.get('SELECT COUNT(*) as count FROM sqlite_master', [], (err, row) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          exists,
          error: err.message,
          path: dbPath
        });
      } else {
        res.json({
          status: 'ok',
          exists,
          tables: row.count,
          path: dbPath
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      path: dbPath
    });
  }
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/tasks',
      '/api/users',
      '/api/invoices'
    ]
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
      console.log('Available routes:');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
      console.log('- GET  /api/tasks');
      console.log('- GET  /api/users');
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