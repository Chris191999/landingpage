
// Date validation utilities
export const isValidDate = (dateString: string): boolean => {
  // Check basic format first
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  
  // Parse and validate the actual date
  const date = new Date(dateString);
  const [year, month, day] = dateString.split('-').map(Number);
  
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    !isNaN(date.getTime()) &&
    year >= 1900 && 
    year <= 2100
  );
};

export const sanitizeDate = (dateString: string): string => {
  if (isValidDate(dateString)) {
    return dateString;
  }
  
  // Return today's date as fallback for invalid dates
  return new Date().toISOString().split('T')[0];
};

export const formatDateSafely = (dateString: string): string => {
  try {
    if (!isValidDate(dateString)) {
      return 'Invalid Date';
    }
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
};
