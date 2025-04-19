/**
 * Format a date to ISO format (YYYY-MM-DD)
 * @param date Date object to format
 * @returns ISO formatted date string
 */
export const formatISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Calculate checkout date based on check-in date and number of nights
 * @param checkInDate Check-in date
 * @param nights Number of nights
 * @returns Checkout date
 */
export const calculateCheckoutDate = (checkInDate: Date, nights: number): Date => {
    const checkoutDate = new Date(checkInDate);
    // if nights is a string, convert it to a number
    if (typeof nights === 'string') {
        nights = parseInt(nights, 10);
    }
    checkoutDate.setDate(checkoutDate.getDate() + nights);
    return checkoutDate;
};
