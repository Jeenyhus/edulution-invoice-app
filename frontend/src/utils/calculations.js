export const calculateEarnings = (hours, rate) => {
  console.log('Calculating earnings with:', { hours, rate });
  const parsedHours = parseFloat(hours);
  const parsedRate = parseFloat(rate);
  
  if (isNaN(parsedHours) || isNaN(parsedRate)) {
    console.log('Invalid hours or rate:', { parsedHours, parsedRate });
    return 0;
  }
  
  const earnings = parsedHours * parsedRate;
  const roundedEarnings = Math.round(earnings * 100) / 100;
  console.log('Calculated earnings:', roundedEarnings);
  return roundedEarnings;
};

export const validateHourlyRate = (rate) => {
  const parsedRate = parseFloat(rate);
  return !isNaN(parsedRate) && parsedRate > 0;
}; 