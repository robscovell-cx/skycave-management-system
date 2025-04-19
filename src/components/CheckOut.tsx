import { useEffect, useState } from 'react';
import '../styles/mainframe.css';
import { Guest } from '../types/guest';

interface CheckOutProps {
  currentGuest: Partial<Guest> | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const CheckOut = ({ currentGuest, onConfirm, onCancel }: CheckOutProps) => {
  const [selectedOption, setSelectedOption] = useState<'Y' | 'N' | ''>('');
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F3') {
        onCancel();
      } else if (e.key === 'y' || e.key === 'Y') {
        setSelectedOption('Y');
      } else if (e.key === 'n' || e.key === 'N') {
        setSelectedOption('N');
      } else if (e.key === 'Enter') {
        if (selectedOption === 'Y') {
          onConfirm();
        } else if (selectedOption === 'N') {
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
        <div className="screen-id">CHK002</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">CHECK-OUT CONFIRMATION</div>
          <div className="panel-content">
            <div className="confirmation-message">
              {!currentGuest ? (
                <p>NO GUEST IS CURRENTLY CHECKED IN</p>
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
                      const value = e.target.value.toUpperCase();
                      if (value === 'Y' || value === 'N' || value === '') {
                        setSelectedOption(value as 'Y' | 'N' | '');
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
                'PRESS ANY KEY TO RETURN' : 
                selectedOption ? 'PRESS ENTER TO CONFIRM' : 'ENTER Y FOR YES, N FOR NO'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=CANCEL</div>
        <div className="key">ENTER=CONFIRM</div>
      </div>
    </div>
  );
};

export default CheckOut;
