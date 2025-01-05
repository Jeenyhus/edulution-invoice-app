const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

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
      phoneNumber
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

    // Continue with user creation using the parsed hourly rate
    const userData = {
      name,
      email,
      password,
      hourlyRate: parsedHourlyRate, // Store as number
      career,
      bankName,
      branchCode,
      accountNumber,
      address,
      phoneNumber
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
            role: 'user',
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
            role: 'user'
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

    // Add email domain validation
    if (!email.endsWith('@edulution.org')) {
      return res.status(401).json({
        error: 'Access restricted to @edulution.org email addresses only'
      });
    }

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
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  login
}; 