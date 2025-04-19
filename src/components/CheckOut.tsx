import { useEffect, useState } from 'react';
import '../styles/mainframe.css';
import { Guest } from '../types/guest';
import useDateTime from '../hooks/useDateTime';

interface CheckOutProps {
  currentGuest: Partial<Guest> | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const CheckOut = ({ currentGuest, onConfirm, onCancel }: CheckOutProps) => {
  // Get current date and time
  const [currentDate, currentTime] = useDateTime();
  
  const [selectedOption, setSelectedOption] = useState<'Y' | 'N' | ''>('');
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F3') {
        onCancel();
      } else if (e.key.toLowerCase() === 'y') {
        setSelectedOption('Y');
      } else if (e.key.toLowerCase() === 'n') {
        setSelectedOption('N');
      } else if (e.key === 'Enter') {
        if (selectedOption.toUpperCase() === 'Y') {
          onConfirm();
        } else if (selectedOption.toUpperCase() === 'N') {
          onCancel();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onConfirm, onCancel, selectedOption]);
  
  // Format guest name for display
  const guestName = currentGuest ? 
    `${currentGuest.firstName || ''} ${currentGuest.lastName || ''}`.trim() : 
    'UNKNOWN GUEST';
  
  return (
    <div className="terminal" tabIndex={0}>
      <div className="header">
        <div className="title">GUEST CHECK-OUT</div>
        <div className="booking-id">
          {currentGuest?.bookings?.[0]?.bookingId || 'NO BOOKING'}
        </div>
        <div className="datetime">{currentDate} {currentTime}</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">CHECK-OUT CONFIRMATION</div>
          <div className="panel-content">
            <div className={currentGuest ? "confirmation-message": "status-message"}>
              {!currentGuest ? (
                <p className='terminal-amber'>NO GUEST CURRENTLY CHECKED IN</p>
              ) : (
                <>
                  <p>ARE YOU SURE YOU WANT TO CHECK OUT:</p>
                  <p className="guest-name">{guestName}</p>
                  <p>BOOKING: {currentGuest.bookings?.[0]?.bookingId || 'UNKNOWN'}</p>
                </>
              )}
            </div>
            
            {currentGuest && (
              <div className="confirmation-options">
                <div className="input-field">
                  <span className="label">ENTER CHOICE (Y/N):</span>
                  <input 
                    type="text" 
                    className="terminal-input"
                    value={selectedOption}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Accept any case but store normalized for consistency
                      if (value.toUpperCase() === 'Y' || value.toUpperCase() === 'N' || value === '') {
                        setSelectedOption(value.toUpperCase() as 'Y' | 'N' | '');
                      }
                    }}
                    maxLength={1}
                    autoFocus
                  />
                </div>
              </div>
            )}
            
            <div className="status-message">
              {!currentGuest ? 
                '' : 
                selectedOption ? 'PRESS ENTER TO CONFIRM' : 'ENTER Y FOR YES, N FOR NO'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=RETURN</div>
        <div className="key">ENTER=CONFIRM</div>
      </div>
    </div>
  );
};

export default CheckOut;
