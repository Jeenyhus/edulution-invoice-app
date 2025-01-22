const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
        if (err || !user) {
          console.error('User not found or token failed');
          return res.status(401).json({ message: 'Not authorized, token failed' });
        }
        req.user = user;
        next();
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Requires superadmin role.' });
  }
};

module.exports = {
  protect,
  requireSuperAdmin
};