const { db } = require('../config/db');

module.exports = {
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, email, role, hourlyRate, createdAt FROM users', [], (err, users) => {
        if (err) {
          console.error('Error fetching users:', err);
          reject(err);
        } else {
          resolve(users || []);
        }
      });
    });
  },
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, email, role, hourlyRate, createdAt FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
          console.error('Error fetching user:', err);
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }
}; 