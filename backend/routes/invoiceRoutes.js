const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const ExcelJS = require('exceljs');

router.get('/', async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;
  console.log('Generating invoice for dates:', startDate, endDate);

  try {
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Get user info
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

    // Get tasks
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
    console.log(`Found ${tasks.length} tasks for invoice generation`);

    // Generate Excel workbook
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
      { header: 'Rate (ZMW)', key: 'rate', width: 12 },
      { header: 'Amount (ZMW)', key: 'amount', width: 15 },
      { header: 'Description', key: 'description', width: 50 }
    ];

    // Style headers
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    tasks.forEach(task => {
      const amount = task.hoursWorked * userInfo.hourlyRate;
      worksheet.addRow({
        date: task.date,
        startTime: task.startTime,
        endTime: task.endTime,
        hoursWorked: Number(task.hoursWorked).toFixed(2),
        category: task.category,
        rate: Number(userInfo.hourlyRate).toFixed(2),
        amount: Number(amount).toFixed(2),
        description: task.description
      });
    });

    // Add totals
    const totalRow = worksheet.rowCount + 2;
    const totalHours = tasks.reduce((total, task) => total + (parseFloat(task.hoursWorked) || 0), 0);
    const totalAmount = totalHours * userInfo.hourlyRate;

    worksheet.getCell(`A${totalRow}`).value = 'Total';
    worksheet.getCell(`D${totalRow}`).value = Number(totalHours).toFixed(2);
    worksheet.getCell(`G${totalRow}`).value = Number(totalAmount).toFixed(2);
    worksheet.getRow(totalRow).font = { bold: true };

    // Apply borders
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

    console.log('Workbook generated successfully');

    // Set headers and send response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${userInfo.name.replace(/\s+/g, '-')}-timesheet-${monthYear.replace(/\s+/g, '-')}.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate invoice', 
      error: error.message 
    });
  }
});

module.exports = router;
