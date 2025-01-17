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
      db.get(
        'SELECT id, name, email, password, hourlyRate, career, bankName, branchCode, accountNumber, address, phoneNumber, role, disabled FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
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

      // First check if user exists
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
          console.error('Error checking user:', err);
          return reject(err);
        }
        if (!user) {
          return reject(new Error('User not found'));
        }

        // Then update the user
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
              console.error('Database error:', err);
              reject(err);
            } else {
              // Get the updated user data
              db.get('SELECT * FROM users WHERE id = ?', [id], (err, updatedUser) => {
                if (err) {
                  reject(err);
                } else {
                  delete updatedUser.password; // Remove sensitive data
                  resolve(updatedUser);
                }
              });
            }
          }
        );
      });
    });
  },

  updateUserStatus: (id, isDisabled) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET disabled = ? WHERE id = ?',
        [isDisabled ? 1 : 0, id],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            console.log('User status update successful:', this.changes);
            resolve(this.changes);
          }
        }
      );
    });
  }
};

module.exports = User; 