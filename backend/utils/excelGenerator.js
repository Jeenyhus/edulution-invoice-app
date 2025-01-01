const ExcelJS = require('exceljs');

const generateInvoice = async (tasks, user) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Invoice');

  // Set up header styling
  const headerStyle = {
    font: { bold: true },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }
  };

  // Add headers
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Shift', key: 'shift', width: 10 },
    { header: 'Start Time', key: 'startTime', width: 10 },
    { header: 'End Time', key: 'endTime', width: 10 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Hours', key: 'hoursWorked', width: 8 },
    { header: 'Rate', key: 'rate', width: 10 },
    { header: 'Amount', key: 'amount', width: 12 }
  ];

  // Style headers
  worksheet.getRow(1).eachCell(cell => {
    cell.style = headerStyle;
  });

  // Add data
  let totalHours = 0;
  let totalAmount = 0;

  tasks.forEach(task => {
    const amount = task.hoursWorked * user.hourlyRate;
    totalHours += task.hoursWorked;
    totalAmount += amount;

    worksheet.addRow({
      date: new Date(task.date).toLocaleDateString(),
      shift: task.shift,
      startTime: task.startTime,
      endTime: task.endTime,
      category: task.category,
      description: task.description,
      hoursWorked: task.hoursWorked,
      rate: user.hourlyRate,
      amount: amount
    });
  });

  // Add totals
  worksheet.addRow({});
  const totalRow = worksheet.addRow({
    description: 'Total',
    hoursWorked: totalHours,
    amount: totalAmount
  });
  totalRow.font = { bold: true };

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { generateInvoice }; 