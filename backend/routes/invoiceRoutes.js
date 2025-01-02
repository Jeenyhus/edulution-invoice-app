const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const ExcelJS = require('exceljs');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const sql = `
      SELECT * FROM tasks 
      WHERE userId = ? 
      AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `;

    // Use promise-based query instead of callback
    const getTasks = () => {
      return new Promise((resolve, reject) => {
        db.all(sql, [userId, startDate, endDate], (err, tasks) => {
          if (err) reject(err);
          else resolve(tasks);
        });
      });
    };

    const tasks = await getTasks();

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice');

    // Add headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Shift', key: 'shift', width: 10 },
      { header: 'Start Time', key: 'startTime', width: 12 },
      { header: 'End Time', key: 'endTime', width: 12 },
      { header: 'Hours Worked', key: 'hoursWorked', width: 15 }
    ];

    // Add rows
    worksheet.addRows(tasks);

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${startDate}-to-${endDate}.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate invoice', 
      error: error.message 
    });
  }
});

module.exports = router;
