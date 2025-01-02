const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password, hourlyRate } = req.body;

  try {
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const sql = `
        INSERT INTO users (name, email, password, hourlyRate, role)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(sql, [name, email, hashedPassword, hourlyRate, 'user'], function(err) {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ message: 'Error creating user' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: this.lastID, email, role: 'user' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Return user data and token
        res.status(201).json({
          token,
          user: {
            id: this.lastID,
            name,
            email,
            hourlyRate,
            role: 'user'
          }
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      // Return user data and token
      res.json({
        user: userWithoutPassword,
        token
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login
}; 