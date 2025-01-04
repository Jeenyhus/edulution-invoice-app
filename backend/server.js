const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');
const { initializeDb, debugDatabase } = require('./config/db');
const path = require('path');

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