const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');
const { initializeDb } = require('./config/db');

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