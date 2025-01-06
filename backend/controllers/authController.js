const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password,
      hourlyRate,
      career,
      bankName,
      branchCode,
      accountNumber,
      address,
      phoneNumber,
      department_id,
      career_id
    } = req.body;

    // Add email domain validation
    if (!email.endsWith('@edulution.org')) {
      return res.status(400).json({
        error: 'Registration is only allowed for @edulution.org email addresses'
      });
    }

    // Validate hourly rate
    const parsedHourlyRate = parseFloat(hourlyRate);
    if (isNaN(parsedHourlyRate) || parsedHourlyRate <= 0) {
      return res.status(400).json({ 
        error: 'Invalid hourly rate' 
      });
    }

    // Set role based on email
    let role = 'user';
    if (email === 'dmweemba@edulution.org') {
      role = 'superadmin';
    }

    // Continue with user creation using the parsed hourly rate
    const userData = {
      name,
      email,
      password,
      hourlyRate: parsedHourlyRate,
      career,
      bankName,
      branchCode,
      accountNumber,
      address,
      phoneNumber,
      role,
      department_id,
      career_id
    };

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

      // Create user with new fields
      const sql = `
        INSERT INTO users (
          name, email, password, hourlyRate, career, 
          bankName, branchCode, accountNumber, address, 
          phoneNumber, role, department_id, career_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [
        userData.name, userData.email, hashedPassword, 
        userData.hourlyRate, userData.career,
        userData.bankName, userData.branchCode, 
        userData.accountNumber, userData.address,
        userData.phoneNumber, userData.role,
        userData.department_id, userData.career_id
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
            role,
            career // Include career in token for easy access
          },
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
            career,
            role
          }
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user with all fields including disabled status
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is disabled
    if (user.disabled === 1) {
      return res.status(403).json({ 
        error: 'Your account has been disabled. Please contact an administrator to restore your account.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data before sending response
    delete user.password;

    console.log('Login successful for user:', { id: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

module.exports = {
  register,
  login
}; 