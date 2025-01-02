const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const ExcelJS = require('exceljs');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Get user name for the title
    const getUserInfo = () => {
      return new Promise((resolve, reject) => {
        db.get('SELECT name, hourlyRate FROM users WHERE id = ?', [userId], (err, user) => {
          if (err) reject(err);
          else resolve({
            name: user?.name || 'User',
            hourlyRate: user?.hourlyRate || 0
          });
        });
      });
    };

    const userInfo = await getUserInfo();
    const date = new Date(startDate);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    const sql = `
      SELECT * FROM tasks 
      WHERE userId = ? 
      AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `;

    const getTasks = () => {
      return new Promise((resolve, reject) => {
        db.all(sql, [userId, startDate, endDate], (err, tasks) => {
          if (err) reject(err);
          else resolve(tasks);
        });
      });
    };

    const tasks = await getTasks();

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Time Sheet');

    // Add title
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = `${userInfo.name} Time Sheet ${monthYear}`;
    worksheet.getCell('A1').font = { bold: true };

    // Define columns
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 18 },
      { header: 'From', key: 'startTime', width: 10 },
      { header: 'To', key: 'endTime', width: 10 },
      { header: 'Hours', key: 'hoursWorked', width: 10 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Extra Time', key: 'extraTime', width: 12 },
      { header: 'Description', key: 'description', width: 50 }
    ];

    // Style the headers
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).border = {
      bottom: { style: 'thin' }
    };

    // Add data rows
    tasks.forEach(task => {
      const amount = task.hoursWorked * userInfo.hourlyRate;
      worksheet.addRow({
        date: task.date,
        startTime: task.startTime,
        endTime: task.endTime,
        hoursWorked: task.hoursWorked,
        category: task.category,
        rate: userInfo.hourlyRate,
        amount: amount,
        description: task.description
      });
    });

    // Add total hours at the bottom
    const totalRow = worksheet.rowCount + 2;
    worksheet.getCell(`A${totalRow}`).value = '';
    worksheet.getCell(`B${totalRow}`).value = '';
    worksheet.getCell(`C${totalRow}`).value = '';
    worksheet.getCell(`D${totalRow}`).value = tasks.reduce((total, task) => {
      const hours = parseFloat(task.hoursWorked) || 0;
      return total + hours;
    }, 0).toFixed(2);
    worksheet.getCell(`D${totalRow}`).font = { bold: true };

    // Apply borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${userInfo.name.replace(/\s+/g, '-')}-timesheet-${monthYear.replace(/\s+/g, '-')}.xlsx`
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
