const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Add after line 8, before the initializeDb function
const runMigrations = async () => {
  try {
    // Create departments table
    await new Promise((resolve, reject) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS departments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS careers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          department_id INTEGER,
          FOREIGN KEY (department_id) REFERENCES departments(id)
        );

        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          companyName TEXT DEFAULT 'Edulution',
          companyEmail TEXT DEFAULT 'info@edulution.org',
          maxHoursPerDay INTEGER DEFAULT 8,
          maxHoursPerWeek INTEGER DEFAULT 40,
          overtimeMultiplier REAL DEFAULT 1.5,
          allowDepartmentCreation INTEGER DEFAULT 1,
          allowCareerCreation INTEGER DEFAULT 1,
          defaultHourlyRate REAL DEFAULT 50.0,
          allowUserRegistration INTEGER DEFAULT 1,
          requireEmailVerification INTEGER DEFAULT 1,
          allowTaskEditing INTEGER DEFAULT 1,
          taskEditTimeLimit INTEGER DEFAULT 24,
          requireTaskApproval INTEGER DEFAULT 1,
          emailNotifications INTEGER DEFAULT 1,
          taskReminders INTEGER DEFAULT 1,
          approvalNotifications INTEGER DEFAULT 1
        );

        INSERT OR IGNORE INTO settings (id) VALUES (1);
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Add department_id column to users table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Check if department_id column exists
        const hasColumn = rows.some(row => row.name === 'department_id');
        if (!hasColumn) {
          db.run('ALTER TABLE users ADD COLUMN department_id INTEGER REFERENCES departments(id)', (err) => {
            if (err) reject(err);
            else resolve();
          });
        } else {
          resolve();
        }
      });
    });

    // Run the setup script
    await require('../scripts/setupDepartmentsAndCareers')();
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Initialize database schema
const initializeDb = async () => {
  try {
    // Create departments and careers tables first
    await new Promise((resolve, reject) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS departments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS careers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          department_id INTEGER,
          FOREIGN KEY (department_id) REFERENCES departments(id)
        );
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create users table with all columns
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
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
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }

        // Create tasks table
        db.run(`
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            shift TEXT NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT NOT NULL,
            hoursWorked REAL NOT NULL,
            category TEXT NULL,
            userId INTEGER,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating tasks table:', err);
            reject(err);
          } else {
            console.log('Database initialized successfully');
            resolve();
          }
        });
      });
    });

    // Run migrations after tables are created
    await runMigrations();
    
    return Promise.resolve();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Add logging for database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = { db, initializeDb };