export const calculateEarnings = (hours, rate) => {
  const parsedHours = parseFloat(hours);
  const parsedRate = parseFloat(rate);
  
  if (isNaN(parsedHours) || isNaN(parsedRate)) {
    return 0;
  }
  
  return Math.round(parsedHours * parsedRate * 100) / 100;
};

export const validateHourlyRate = (rate) => {
  const parsedRate = parseFloat(rate);
  return !isNaN(parsedRate) && parsedRate > 0;
}; 