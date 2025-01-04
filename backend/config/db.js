const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use data directory in the project root
const DATA_DIR = path.join(process.cwd(), 'data');
const dbPath = path.join(DATA_DIR, 'database.sqlite');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`Created directory: ${DATA_DIR}`);
  } catch (err) {
    console.error(`Error creating directory: ${err}`);
  }
}

// Log database path and permissions
console.log(`Database path: ${dbPath}`);
if (fs.existsSync(DATA_DIR)) {
  try {
    const stats = fs.statSync(DATA_DIR);
    console.log(`Directory permissions: ${stats.mode}`);
  } catch (err) {
    console.error(`Error checking directory permissions: ${err}`);
  }
}

// Create database connection with verbose error logging
let db;
try {
  db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Database connection error:', err);
      throw err;
    }
    console.log('Connected to SQLite database');
  });
} catch (err) {
  console.error('Failed to create database:', err);
  throw err;
}

// Initialize database schema
const initializeDb = () => {
  return new Promise((resolve, reject) => {
    console.log('Starting database initialization...');
    
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
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        reject(err);
        return;
      }
      console.log('Users table initialized');

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
        console.log('Tasks table initialized');
        console.log('Database initialization completed successfully');
        resolve();
      });
    });
  });
};

module.exports = { db, initializeDb };