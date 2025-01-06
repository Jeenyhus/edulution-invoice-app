const bcrypt = require('bcryptjs');
const { db } = require('../config/db');

const createAdminUser = async () => {
  try {
    // Check if admin exists
    const adminExists = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', ['dmweemba@edulution.org'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (adminExists) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (
          name, email, password, role, hourlyRate, 
          career, department_id, career_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Dabwitso Mweemba',
        'dmweemba@edulution.org',
        hashedPassword,
        'superadmin',
        100,
        'Administrator',
        2,  // Technology Department
        3   // Senior Software Developer
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Super admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminUser(); 