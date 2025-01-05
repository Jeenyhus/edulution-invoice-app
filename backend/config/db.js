const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db;

const initializeDb = async () => {
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'database.sqlite');
    console.log('Database path:', dbPath);

    return new Promise((resolve, reject) => {
      db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
          console.error('Database connection error:', err);
          reject(err);
          return;
        }

        // Create tables if they don't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          hourlyRate REAL DEFAULT 0,
          career TEXT,
          bankName TEXT,
          branchCode TEXT,
          accountNumber TEXT,
          address TEXT,
          phoneNumber TEXT,
          role TEXT DEFAULT 'user',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (tableErr) => {
          if (tableErr) {
            console.error('Error creating users table:', tableErr);
            reject(tableErr);
            return;
          }
          console.log('Database initialized successfully');
          resolve(db);
        });
      });
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = {
  initializeDb,
  getDb
};