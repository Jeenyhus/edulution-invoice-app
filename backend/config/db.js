const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db;

const initializeDb = async () => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'database.sqlite');
    console.log('Database path:', dbPath);

    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    
    // Test the connection
    await new Promise((resolve, reject) => {
      db.get('SELECT 1', (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    console.log('Database connection successful');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = {
  initializeDb,
  getDb: () => db
};