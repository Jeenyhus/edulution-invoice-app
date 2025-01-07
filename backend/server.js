const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env variables first
dotenv.config();

const { protect } = require('./middleware/authMiddleware');
const { initializeDb } = require('./config/db');

// Initialize passport after env variables are loaded
const passport = require('passport');
require('./config/passport');

const app = express();

// Add Google Auth middleware first
const googleAuthMiddleware = require('./middleware/googleAuthMiddleware');
app.use(googleAuthMiddleware);

// Then other middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cross-Origin-Opener-Policy'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Initialize database
initializeDb().catch(console.error);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', protect, require('./routes/taskRoutes'));
app.use('/api/users', protect, require('./routes/userRoutes'));

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;