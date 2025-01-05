const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Initialize database schema
const initializeDb = () => {
  return new Promise((resolve, reject) => {
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
};

// Add logging for database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = { db, initializeDb };