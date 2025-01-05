const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { 
    name, 
    email, 
    password,
    hourlyRate = 0,
    career = '',
    bankName = '',
    branchCode = '',
    accountNumber = '',
    address = '',
    phoneNumber = ''
  } = req.body;

  try {
    console.log('Registration attempt for email:', email);

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const sql = `
          INSERT INTO users (
            name, email, password, hourlyRate, career, 
            bankName, branchCode, accountNumber, address, 
            phoneNumber, role
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(sql, [
          name, 
          email, 
          hashedPassword, 
          hourlyRate,
          career,
          bankName,
          branchCode,
          accountNumber,
          address,
          phoneNumber,
          'user'
        ], function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { 
              id: this.lastID, 
              email,
              role: 'user'
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
          );

          console.log('Registration successful for user:', email);

          // Return user data and token
          res.status(201).json({
            token,
            user: {
              id: this.lastID,
              name,
              email,
              hourlyRate,
              career,
              role: 'user'
            }
          });
        });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
          message: 'Server error during registration',
          error: error.message 
        });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);
    
    // Add database connection check
    if (!db) {
      console.error('Database connection not initialized');
      return res.status(500).json({ message: 'Database connection error' });
    }

    // Input validation
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // First, check if the users table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", [], (tableErr, tableExists) => {
      if (tableErr) {
        console.error('Error checking users table:', tableErr);
        return res.status(500).json({ 
          message: 'Database error checking users table',
          error: tableErr.message 
        });
      }

      if (!tableExists) {
        console.error('Users table does not exist');
        return res.status(500).json({ 
          message: 'Database not properly initialized',
          error: 'Users table missing' 
        });
      }

      // Find user
      const query = 'SELECT * FROM users WHERE email = ?';
      console.log('Executing query:', query, 'with email:', email);

      db.get(query, [email], async (err, user) => {
        if (err) {
          console.error('Database error during login:', err);
          return res.status(500).json({ 
            message: 'Database error during login',
            error: err.message 
          });
        }

        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
          console.log('User not found:', email);
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        try {
          // Compare password
          console.log('Comparing passwords...');
          const isMatch = await bcrypt.compare(password, user.password);
          
          console.log('Password match:', isMatch);

          if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
          }

          // Create token
          console.log('Creating JWT token...');
          const token = jwt.sign(
            { 
              id: user.id, 
              email: user.email,
              role: user.role 
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
          );

          // Remove password from user object
          const { password: _, ...userWithoutPassword } = user;

          console.log('Login successful for user:', email);
          
          res.json({
            token,
            user: userWithoutPassword
          });
        } catch (bcryptError) {
          console.error('Password comparison error:', bcryptError);
          return res.status(500).json({ 
            message: 'Error during password verification',
            error: bcryptError.message 
          });
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login
};