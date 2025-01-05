const db = require('../config/db');

const getReportData = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const timeFilter = getTimeFilter(timeRange);

    // Get all required data in parallel
    const [
      costSummary,
      categoryDistribution,
      userPerformance
    ] = await Promise.all([
      calculateCostSummary(timeFilter),
      getHoursByCategory(timeFilter),
      getUserPerformance(timeFilter)
    ]);

    res.json({
      costSummary,
      categoryDistribution,
      userPerformance
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

// Helper function to get date filter
const getTimeFilter = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'week':
      return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case 'month':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];
    case 'quarter':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().split('T')[0];
    case 'year':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
    default:
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];
  }
};

// Calculate cost summary
const calculateCostSummary = (startDate) => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT 
        COUNT(DISTINCT t.userId) as totalUsers,
        SUM(t.hoursWorked) as totalHours,
        SUM(t.hoursWorked * u.hourlyRate) as totalCost,
        AVG(u.hourlyRate) as avgHourlyRate,
        SUM(t.hoursWorked * u.hourlyRate) / SUM(t.hoursWorked) as avgCostPerHour
      FROM tasks t
      JOIN users u ON t.userId = u.id
      WHERE t.date >= ?
    `, [startDate], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Get hours by category
const getHoursByCategory = (startDate) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        t.category,
        SUM(t.hoursWorked) as totalHours,
        COUNT(*) as taskCount,
        SUM(t.hoursWorked * u.hourlyRate) as totalCost
      FROM tasks t
      JOIN users u ON t.userId = u.id
      WHERE t.date >= ?
      GROUP BY t.category
      ORDER BY totalHours DESC
    `, [startDate], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get user performance
const getUserPerformance = (startDate) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        COUNT(t.id) as tasksCompleted,
        SUM(t.hoursWorked) as hoursWorked,
        SUM(t.hoursWorked * u.hourlyRate) as totalCost,
        u.hourlyRate,
        AVG(t.hoursWorked) as avgHoursPerTask
      FROM users u
      LEFT JOIN tasks t ON u.id = t.userId AND t.date >= ?
      GROUP BY u.id
      ORDER BY hoursWorked DESC
    `, [startDate], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  getReportData
}; 