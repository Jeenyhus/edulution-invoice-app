const db = require('../config/db');

// Drop existing tasks table if it exists
db.run(`DROP TABLE IF EXISTS tasks`);

// Create tasks table with correct schema
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
`);

// Export both the database connection and model methods
module.exports = {
  db,
  // Add model methods here if needed
  getAllTasks: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY date DESC', [], (err, tasks) => {
        if (err) reject(err);
        resolve(tasks);
      });
    });
  }
};
