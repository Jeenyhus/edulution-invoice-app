const { db } = require('../config/db');

// Initialize database schema
const initializeDb = () => {
  return new Promise((resolve, reject) => {
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
    `, (err) => {
      if (err) {
        console.error('Error creating tasks table:', err);
        reject(err);
        return;
      }
      console.log('Tasks table ready');
      resolve();
    });
  });
};

const checkExistingTasksForDay = (userId, date, shift) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM tasks WHERE userId = ? AND date = ?) as totalCount,
        (SELECT COUNT(*) FROM tasks WHERE userId = ? AND date = ? AND shift = ?) as shiftCount
      FROM tasks 
      LIMIT 1
    `;
    
    db.get(sql, [userId, date, userId, date, shift], (err, result) => {
      if (err) {
        console.error('Error checking existing tasks:', err);
        reject(err);
      } else {
        resolve({
          totalTasksForDay: result ? result.totalCount : 0,
          tasksInShift: result ? result.shiftCount : 0
        });
      }
    });
  });
};

module.exports = {
  initializeDb,
  getAllTasks: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY date DESC', [], (err, tasks) => {
        if (err) {
          console.error('Error fetching tasks:', err);
          reject(err);
        } else {
          resolve(tasks || []);
        }
      });
    });
  },
  getTaskById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
        if (err) {
          console.error('Error fetching task:', err);
          reject(err);
        } else {
          resolve(task);
        }
      });
    });
  },
  createTask: (taskData) => {
    return new Promise((resolve, reject) => {
      const { description, date, shift, startTime, endTime, hoursWorked, category, userId } = taskData;
      const sql = `
        INSERT INTO tasks (description, date, shift, startTime, endTime, hoursWorked, category, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(sql, [description, date, shift, startTime, endTime, hoursWorked, category, userId], function(err) {
        if (err) {
          console.error('Error creating task:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  },
  updateTask: (id, taskData) => {
    return new Promise((resolve, reject) => {
      const { description, date, shift, startTime, endTime, hoursWorked, category } = taskData;
      const sql = `
        UPDATE tasks 
        SET description = ?, date = ?, shift = ?, startTime = ?, 
            endTime = ?, hoursWorked = ?, category = ?
        WHERE id = ?
      `;
      db.run(sql, [description, date, shift, startTime, endTime, hoursWorked, category, id], function(err) {
        if (err) {
          console.error('Error updating task:', err);
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  },
  deleteTask: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting task:', err);
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  },
  checkExistingTasksForDay
};
