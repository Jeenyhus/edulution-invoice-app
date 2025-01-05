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
        phoneNumber,
        role
      } = userData;

      console.log('Updating user in database:', { id, userData }); // Debug log

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
            phoneNumber = ?,
            role = ?
        WHERE id = ?`,
        [name, email, hourlyRate, career, bankName, branchCode, accountNumber, address, phoneNumber, role, id],
        function(err) {
          if (err) {
            console.error('Database error:', err); // Debug log
            reject(err);
          } else {
            console.log('Database update successful:', this.changes); // Debug log
            resolve(this.changes);
          }
        }
      );
    });
  }
};

module.exports = User; 