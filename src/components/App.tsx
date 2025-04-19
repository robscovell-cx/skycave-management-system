import { useState, useEffect } from 'react'
import '../styles/mainframe.css'
import CheckIn from './CheckIn'
import ViewGuests from './ViewGuests'
import CheckOut from './CheckOut'
import { Guest } from '../types/guest'

// Define screens for navigation
type Screen = 'main' | 'checkIn' | 'checkOut' | 'viewGuests';

function App() {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [currentScreen, setCurrentScreen] = useState<Screen>('main')
  const [guests, setGuests] = useState<Partial<Guest>[]>([])

  useEffect(() => {
    // Function to update the date and time
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-GB')); // Changed to en-GB for dd/mm/yyyy format
      setCurrentTime(now.toLocaleTimeString('en-GB'));
    };

    // Set initial date and time
    updateDateTime();

    // Update time every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount

  // Get current guest
  const currentGuest = guests.length > 0 ? guests[guests.length - 1] : null;

  // Add keyboard event listener for number keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only process keydown events when on main screen
      if (currentScreen !== 'main') return;
      
      // Check if the pressed key is a number key (1, 2, or 3)
      if (event.key === '1' || event.key === '2' || event.key === '3') {
        setSelectedOption(event.key);
      } else if (event.key === 'Enter') {
        handleOptionSelect();
      } else if (event.key === 'Escape') {
        // Add escape key handler for main screen 
        // (could exit the app or show confirmation)
        console.log('Exit application requested');
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentScreen, selectedOption]);

  // Handle option selection
  const handleOptionSelect = () => {
    if (selectedOption === '1') {
      setCurrentScreen('checkIn');
    } else if (selectedOption === '2') {
      setCurrentScreen('checkOut');
    } else if (selectedOption === '3') {
      setCurrentScreen('viewGuests');
    }
  };

  // Handle guest check-in submission
  const handleGuestCheckIn = (guestData: Partial<Guest>) => {
    // Add the guest to our list
    setGuests(prevGuests => [...prevGuests, guestData]);
    // Return to main screen
    setCurrentScreen('main');
    setSelectedOption('');
  };

  // Handle guest check-out confirmation
  const handleGuestCheckOut = () => {
    // Clear the guests list - in a real app you might mark them as checked out instead
    setGuests([]);
    // Return to main screen
    setCurrentScreen('main');
    setSelectedOption('');
  };

  // Return to main menu without checking out
  const handleCancelCheckOut = () => {
    setCurrentScreen('main');
    setSelectedOption('');
  };

  // Return to main menu
  const handleReturn = () => {
    setCurrentScreen('main');
    setSelectedOption('');
  };

  // Render appropriate screen based on current state
  if (currentScreen === 'checkIn') {
    return <CheckIn onReturn={handleReturn} onSubmit={handleGuestCheckIn} />;
  } else if (currentScreen === 'viewGuests') {
    return <ViewGuests guests={guests} onReturn={handleReturn} />;
  } else if (currentScreen === 'checkOut') {
    return <CheckOut 
      currentGuest={currentGuest}
      onConfirm={handleGuestCheckOut} 
      onCancel={handleCancelCheckOut}
    />;
  }

  // Main menu screen
  return (
    <div className="terminal">
      <div className="header">
        <div className="title">SKYCAVE MANAGEMENT SYSTEM</div>
        <div className="datetime">{currentDate} {currentTime}</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">MAIN MENU</div>
          <div className="panel-content">
            <div className="menu-option">
              <span className="option-number">1.</span>
              <span className="option-text">CHECK IN GUEST</span>
            </div>
            <div className="menu-option">
              <span className="option-number">2.</span>
              <span className="option-text">CHECK OUT GUEST</span>
            </div>
            <div className="menu-option">
              <span className="option-number">3.</span>
              <span className="option-text">VIEW CHECKED-IN GUESTS</span>
            </div>
            
            <div className="input-field">
              <span className="label">ENTER SELECTION:</span>
              <input 
                type="text" 
                className="terminal-input"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                maxLength={1}
                autoFocus
              />
            </div>
            
            <div className="status-message">
              {selectedOption ? 'PRESS ENTER TO CONTINUE' : 'READY FOR INPUT'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=EXIT</div>
        <div className="key">ENTER=SUBMIT</div>
      </div>
    </div>
  )
}

export default App
