const { db } = require('../config/db');

const migrateUsers = async () => {
  try {
    // Backup existing users
    const users = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Drop existing users table
    await new Promise((resolve, reject) => {
      db.run('DROP TABLE IF EXISTS users', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create new users table with career_id
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          hourlyRate REAL DEFAULT 0,
          career TEXT,
          career_id INTEGER,
          bankName TEXT,
          branchCode TEXT,
          accountNumber TEXT,
          address TEXT,
          phoneNumber TEXT,
          disabled INTEGER DEFAULT 0,
          department_id INTEGER,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (department_id) REFERENCES departments(id),
          FOREIGN KEY (career_id) REFERENCES careers(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Restore users data
    for (const user of users) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (
            name, email, password, role, hourlyRate, career, 
            bankName, branchCode, accountNumber, address, 
            phoneNumber, department_id, career_id, disabled
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          user.name, user.email, user.password, user.role, 
          user.hourlyRate, user.career, user.bankName, 
          user.branchCode, user.accountNumber, user.address, 
          user.phoneNumber, user.department_id, null, user.disabled
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('Users table migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers(); 