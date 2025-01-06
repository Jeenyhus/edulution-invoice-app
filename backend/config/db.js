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
    await new Promise((resolve, reject) => {
      // Create users table with new columns
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          hourlyRate REAL DEFAULT 0,
          career TEXT,
          bankName TEXT,
          branchCode TEXT,
          accountNumber TEXT,
          address TEXT,
          phoneNumber TEXT,
          disabled INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
            category TEXT NOT NULL,
            userId INTEGER,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating tasks table:', err);
            reject(err);
            return;
          }
          console.log('Database initialized successfully');
          resolve();
        });
      });
    });
    
    // Run migrations after tables are created
    await runMigrations();
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// Add logging for database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = { db, initializeDb };