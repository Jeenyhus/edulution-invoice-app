const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Get user from database
      db.get(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.id],
        (err, user) => {
          if (err) {
            console.error('Database error in auth middleware:', err);
            return res.status(500).json({ message: 'Server error' });
          }

          if (!user) {
            return res.status(401).json({ message: 'User not found' });
          }

          // Add user to request object
          req.user = user;
          next();
        }
      );
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin }; 
module.exports = { protect }; 