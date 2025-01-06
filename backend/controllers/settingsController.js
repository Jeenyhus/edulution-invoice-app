const { db } = require('../config/db');

const getSettings = async (req, res) => {
  try {
    db.get('SELECT * FROM settings WHERE id = 1', [], (err, settings) => {
      if (err) {
        console.error('Error fetching settings:', err);
        return res.status(500).json({ error: 'Failed to fetch settings' });
      }
      res.json(settings);
    });
  } catch (error) {
    console.error('Error in getSettings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSettings = async (req, res) => {
  const settings = req.body;
  
  try {
    const sql = `
      UPDATE settings 
      SET 
        companyName = ?,
        companyEmail = ?,
        maxHoursPerDay = ?,
        maxHoursPerWeek = ?,
        overtimeMultiplier = ?,
        allowDepartmentCreation = ?,
        allowCareerCreation = ?,
        defaultHourlyRate = ?,
        allowUserRegistration = ?,
        requireEmailVerification = ?,
        allowTaskEditing = ?,
        taskEditTimeLimit = ?,
        requireTaskApproval = ?,
        emailNotifications = ?,
        taskReminders = ?,
        approvalNotifications = ?
      WHERE id = 1
    `;
    
    db.run(sql, [
      settings.companyName,
      settings.companyEmail,
      settings.maxHoursPerDay,
      settings.maxHoursPerWeek,
      settings.overtimeMultiplier,
      settings.allowDepartmentCreation ? 1 : 0,
      settings.allowCareerCreation ? 1 : 0,
      settings.defaultHourlyRate,
      settings.allowUserRegistration ? 1 : 0,
      settings.requireEmailVerification ? 1 : 0,
      settings.allowTaskEditing ? 1 : 0,
      settings.taskEditTimeLimit,
      settings.requireTaskApproval ? 1 : 0,
      settings.emailNotifications ? 1 : 0,
      settings.taskReminders ? 1 : 0,
      settings.approvalNotifications ? 1 : 0
    ], function(err) {
      if (err) {
        console.error('Error updating settings:', err);
        return res.status(500).json({ error: 'Failed to update settings' });
      }
      res.json({ message: 'Settings updated successfully' });
    });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSettings,
  updateSettings
}; 