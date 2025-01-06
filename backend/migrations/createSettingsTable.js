const { db } = require('../config/db');

const createSettingsTable = async () => {
  try {
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          companyName TEXT DEFAULT 'Edulution',
          companyEmail TEXT DEFAULT 'info@edulution.org',
          maxHoursPerDay INTEGER DEFAULT 8,
          maxHoursPerWeek INTEGER DEFAULT 40,
          overtimeMultiplier REAL DEFAULT 1.5,
          allowDepartmentCreation INTEGER DEFAULT 1,
          allowCareerCreation INTEGER DEFAULT 1,
          defaultHourlyRate REAL DEFAULT 50.0,
          allowUserRegistration INTEGER DEFAULT 1,
          requireEmailVerification INTEGER DEFAULT 1,
          allowTaskEditing INTEGER DEFAULT 1,
          taskEditTimeLimit INTEGER DEFAULT 24,
          requireTaskApproval INTEGER DEFAULT 1,
          emailNotifications INTEGER DEFAULT 1,
          taskReminders INTEGER DEFAULT 1,
          approvalNotifications INTEGER DEFAULT 1
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Insert default settings if not exists
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO settings (id) VALUES (1)
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Settings table created successfully');
  } catch (error) {
    console.error('Error creating settings table:', error);
    throw error;
  }
};

module.exports = createSettingsTable; 