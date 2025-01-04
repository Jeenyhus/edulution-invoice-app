const ExcelJS = require('exceljs');

const generateInvoice = async (tasks, user) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Edulution Invoice System";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Invoice', {
    properties: { tabColor: { argb: 'FF0072CD' } }
  });

  // Add company header
  worksheet.mergeCells('A1:I1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `${user.name} - Invoice`;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Define columns with proper formatting
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Shift', key: 'shift', width: 10 },
    { header: 'Start Time', key: 'startTime', width: 12 },
    { header: 'End Time', key: 'endTime', width: 12 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Hours', key: 'hoursWorked', width: 10 },
    { header: 'Rate (ZMW)', key: 'rate', width: 12 },
    { header: 'Amount (ZMW)', key: 'amount', width: 15 }
  ];

  // Style header row
  const headerRow = worksheet.getRow(2);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0072CD' }
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Add data with formatting
  let totalHours = 0;
  let totalAmount = 0;

  tasks.forEach((task, index) => {
    const amount = task.hoursWorked * user.hourlyRate;
    totalHours += task.hoursWorked;
    totalAmount += amount;

    const row = worksheet.addRow({
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

    // Apply zebra striping
    row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF5F5F5' }
    };

    // Format numbers
    row.getCell('hoursWorked').numFmt = '0.00';
    row.getCell('rate').numFmt = '#,##0.00';
    row.getCell('amount').numFmt = '#,##0.00';
  });

  // Add totals row
  const totalRow = worksheet.addRow({
    description: 'Total',
    hoursWorked: totalHours,
    amount: totalAmount
  });

  totalRow.font = { bold: true };
  totalRow.getCell('hoursWorked').numFmt = '0.00';
  totalRow.getCell('amount').numFmt = '#,##0.00';
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8F4FF' }
  };

  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle' };
    });
  });

  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};

module.exports = { generateInvoice }; 