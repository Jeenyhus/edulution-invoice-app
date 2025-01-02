const express = require('express');
const router = express.Router();
const db = require('../config/db');
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

    db.all(sql, [userId, startDate, endDate], async (err, tasks) => {
      if (err) {
        console.error('Error fetching tasks for invoice:', err);
        return res.status(500).json({ message: 'Error generating invoice' });
      }

      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Invoice');

      // Add headers
      worksheet.columns = [
        { header: 'Date', key: 'date' },
        { header: 'Description', key: 'description' },
        { header: 'Shift', key: 'shift' },
        { header: 'Start Time', key: 'startTime' },
        { header: 'End Time', key: 'endTime' },
        { header: 'Hours Worked', key: 'hoursWorked' }
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
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate invoice', 
      error: error.message 
    });
  }
});

module.exports = router;
