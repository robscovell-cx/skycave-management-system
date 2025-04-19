import { useState, useEffect } from 'react';

/**
 * Hook to provide current date and time that updates every second
 * @returns {Array} [currentDate, currentTime]
 */
const useDateTime = (): [string, string] => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Function to update the date and time
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-GB')); // dd/mm/yyyy format
      setCurrentTime(now.toLocaleTimeString('en-GB'));
    };

    // Set initial date and time
    updateDateTime();

    // Update time every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return [currentDate, currentTime];
};

export default useDateTime;
