import { useState, useEffect } from 'react'
import '../styles/mainframe.css'
import CheckIn from './CheckIn'
import ViewGuests from './ViewGuests'
import CheckOut from './CheckOut'
import TM30Report from './TM30Report'
import { Guest, TM30ReportItem } from '../types/guest'

// Define screens for navigation
type Screen = 'main' | 'checkIn' | 'checkOut' | 'viewGuests' | 'tm30Report';

// Local storage key for guest data
const GUESTS_STORAGE_KEY = 'skycave_guests';
const TM30_STORAGE_KEY = 'skycave_tm30_reports';

function App() {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [currentScreen, setCurrentScreen] = useState<Screen>('main')
  // Initialize guests from localStorage if available
  const [guests, setGuests] = useState<Partial<Guest>[]>(() => {
    // Try to get stored guest data
    const storedGuests = localStorage.getItem(GUESTS_STORAGE_KEY);
    if (storedGuests) {
      try {
        // Parse the stored JSON string
        const parsedGuests = JSON.parse(storedGuests);
        // Fix dates which are stored as strings
        return parsedGuests.map((guest: any) => ({
          ...guest,
          bookings: guest.bookings?.map((booking: any) => ({
            ...booking,
            checkInDate: booking.checkInDate ? new Date(booking.checkInDate) : undefined,
            checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate) : undefined,
            dateMade: booking.dateMade ? new Date(booking.dateMade) : undefined,
          })),
          identification: guest.identification ? {
            ...guest.identification,
            expirationDate: guest.identification.expirationDate ? 
              new Date(guest.identification.expirationDate) : undefined
          } : undefined,
        }));
      } catch (error) {
        console.error('Failed to parse guests from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Add TM30 report state
  const [tm30ReportItems, setTm30ReportItems] = useState<TM30ReportItem[]>(() => {
    // Try to get stored TM30 data
    const storedReports = localStorage.getItem(TM30_STORAGE_KEY);
    if (storedReports) {
      try {
        return JSON.parse(storedReports);
      } catch (error) {
        console.error('Failed to parse TM30 reports from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save guests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
  }, [guests]);

  // Save TM30 reports to localStorage when they change
  useEffect(() => {
    localStorage.setItem(TM30_STORAGE_KEY, JSON.stringify(tm30ReportItems));
  }, [tm30ReportItems]);

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
      
      // Check if the pressed key is a number key (1, 2, 3, or 4)
      if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4') {
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
    } else if (selectedOption === '4') {
      handleEnterTm30Screen();
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

  // Generate initial report items from guests data
  function generateInitialReportItems(guests: Partial<Guest>[]): TM30ReportItem[] {
    let items: TM30ReportItem[] = [];
    
    guests.forEach(guest => {
      // Get the current booking ID
      const currentBookingId = guest.bookings?.[0]?.bookingId || '';
      
      // Add the main guest
      if (guest.firstName && guest.lastName) {
        items.push({
          nameAndSurname: `${guest.firstName} ${guest.lastName}`,
          nationality: guest.nationality || '',
          passportNumber: guest.identification?.number || '',
          typeOfVisa: '',
          dateOfArrivalInThailand: '',
          expiryDateOfStay: '',
          pointOfEntry: '',
          relationship: 'PRIMARY',
          bookingId: currentBookingId
        });
        
        // Add accompanying adults and children if any
        const totalGuests = guest.bookings?.[0]?.numberOfGuests;
        if (totalGuests) {
          // Add additional adults (subtract 1 for the main guest)
          for (let i = 1; i < (totalGuests.adults || 1); i++) {
            items.push({
              nameAndSurname: `ADULT ${i}`,
              nationality: '',
              passportNumber: '',
              typeOfVisa: '',
              dateOfArrivalInThailand: '',
              expiryDateOfStay: '',
              pointOfEntry: '',
              relationship: 'ACCOMPANYING',
              bookingId: currentBookingId
            });
          }
          
          // Add children
          for (let i = 1; i <= (totalGuests.children || 0); i++) {
            items.push({
              nameAndSurname: `CHILD ${i}`,
              nationality: '',
              passportNumber: '',
              typeOfVisa: '',
              dateOfArrivalInThailand: '',
              expiryDateOfStay: '',
              pointOfEntry: '',
              relationship: 'CHILD',
              bookingId: currentBookingId
            });
          }
        }
      }
    });
    
    return items;
  }

  // Handle updating TM30 report item
  const handleUpdateTm30Item = (index: number, field: keyof TM30ReportItem, value: string) => {
    setTm30ReportItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return updated;
    });
  };

  // Handle submitting TM30 report
  const handleSubmitTm30Report = () => {
    // In a real app, you'd submit the data to a server here
    console.log('TM30 Report submitted:', tm30ReportItems);
    // Clear the report items after submission if needed
    // setTm30ReportItems([]);
    // Return to main menu
    setCurrentScreen('main');
  };

  // Initialize TM30 reports when entering the TM30 screen
  const handleEnterTm30Screen = () => {
    // Only initialize if there are no existing report items
    if (tm30ReportItems.length === 0) {
      setTm30ReportItems(generateInitialReportItems(guests));
    }
    setCurrentScreen('tm30Report');
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
  } else if (currentScreen === 'tm30Report') {
    return <TM30Report 
      reportItems={tm30ReportItems}
      onUpdateItem={handleUpdateTm30Item}
      onSubmitReport={handleSubmitTm30Report}
      onReturn={handleReturn} 
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
              <span 
                className="option-text"
                style={{ 
                  color: guests.length > 0 ? 'var(--terminal-amber)' : 'inherit'
                }}
              >CHECK IN GUEST</span>
              {guests.length > 0 && (
                <span className="option-status">
                  [GUEST ALREADY CHECKED IN]
                </span>
              )}
            </div>
            <div className="menu-option">
              <span className="option-number">2.</span>
              <span 
                className="option-text"
                style={{ 
                  color: guests.length === 0 ? 'var(--terminal-amber)' : 'inherit'
                }}
              >CHECK OUT GUEST</span>
              {guests.length === 0 && (
                <span className="option-status">
                  [NO GUESTS TO CHECK OUT]
                </span>
              )}
            </div>
            <div className="menu-option">
              <span className="option-number">3.</span>
              <span 
                className="option-text"
                style={{ 
                  color: guests.length === 0 ? 'var(--terminal-amber)' : 'inherit'
                }}
              >VIEW CHECKED-IN GUESTS</span>
              {guests.length === 0 && (
                <span className="option-status">
                  [NO GUESTS CHECKED IN]
                </span>
              )}
            </div>
            <div className="menu-option">
              <span className="option-number">4.</span>
              <span className="option-text">TM30 REPORT</span>
              {guests.length === 0 && (
                <span className="option-status">
                  [NO GUESTS TO REPORT]
                </span>
              )}
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
