const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { generateInvoice } = require('../utils/excelGenerator');

router.get('/:userId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate required query parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Both startDate and endDate are required query parameters' 
      });
    }

    // Validate date format
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ 
        message: 'Invalid date format. Please use YYYY-MM-DD format' 
      });
    }

    // Validate date range
    if (startDateObj > endDateObj) {
      return res.status(400).json({ 
        message: 'startDate must be before or equal to endDate' 
      });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const query = {
      userId: req.params.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const tasks = await Task.find(query).sort({ date: 1 });
    const excelBuffer = await generateInvoice(tasks, user);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${startDate}-to-${endDate}.xlsx`);
    res.send(excelBuffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
