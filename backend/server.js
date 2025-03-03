const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load env variables first
dotenv.config();

const { protect } = require('./middleware/authMiddleware');
const { initializeDb } = require('./config/db');

// Initialize passport after env variables are loaded
const passport = require('passport');
require('./config/passport');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { message: 'Too many requests, please try again later.' },
  })
);

// Add Google Auth middleware first
const googleAuthMiddleware = require('./middleware/googleAuthMiddleware');
app.use(googleAuthMiddleware);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://edulution-invoice.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database
initializeDb().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5001;

  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);

  const startServer = (port) => {
    const server = app.listen(port)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}`);
          startServer(port + 1);
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      })
      .on('listening', () => {
        console.log(`Server running on port ${port}`);
      });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down...');
      server.close(() => {
        console.log('Server stopped');
        process.exit(0);
      });
    });
  };

  startServer(PORT);
}

module.exports = app;