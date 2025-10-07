// Utility functions for handling dates consistently across the app

/**
 * Get today's date in YYYY-MM-DD format in local timezone
 */
export const getTodayLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Create a Date object from a YYYY-MM-DD string in local timezone
 * This avoids the timezone issues with new Date(dateString)
 */
export const createLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 */
export const formatToLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if two dates are the same day (ignoring time)
 */
export const isSameDay = (date1, date2) => {
  return formatToLocalDateString(date1) === formatToLocalDateString(date2);
};

/**
 * Get the start of day for a given date in local timezone
 */
export const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};


