const { db } = require('../config/db');

const User = {
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, email, role, hourlyRate, career, bankName, 
               branchCode, accountNumber, address, phoneNumber, createdAt 
        FROM users`, [], (err, users) => {
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
      db.get(`
        SELECT id, name, email, role, hourlyRate, career, bankName, 
               branchCode, accountNumber, address, phoneNumber, createdAt 
        FROM users WHERE id = ?`, [id], (err, user) => {
        if (err) {
          console.error('Error fetching user:', err);
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  },

  getProfile: (userId) => {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT id, name, email, role, hourlyRate, career, bankName, 
               branchCode, accountNumber, address, phoneNumber, createdAt 
        FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) {
          console.error('Error fetching profile:', err);
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  },

  updateUser: (id, userData) => {
    return new Promise((resolve, reject) => {
      const {
        name,
        email,
        hourlyRate,
        career,
        bankName,
        branchCode,
        accountNumber,
        address,
        phoneNumber
      } = userData;

      db.run(`
        UPDATE users 
        SET name = ?, 
            email = ?, 
            hourlyRate = ?,
            career = ?,
            bankName = ?,
            branchCode = ?,
            accountNumber = ?,
            address = ?,
            phoneNumber = ?
        WHERE id = ?`,
        [name, email, hourlyRate, career, bankName, branchCode, accountNumber, address, phoneNumber, id],
        function(err) {
          if (err) {
            console.error('Error updating user:', err);
            reject(err);
          } else {
            resolve(this.changes);
          }
        }
      );
    });
  }
};

module.exports = User; 