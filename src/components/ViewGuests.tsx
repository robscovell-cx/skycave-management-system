import { useEffect } from 'react';
import '../styles/mainframe.css';
import { Guest } from '../types/guest';
import useDateTime from '../hooks/useDateTime';

interface ViewGuestsProps {
  guests: Partial<Guest>[];
  onReturn: () => void;
}

const ViewGuests = ({ guests, onReturn }: ViewGuestsProps) => {
  // Get current date and time
  const [currentDate, currentTime] = useDateTime();
  
  // Since there's only one guest at a time, we'll use the first guest in the array
  const currentGuest = guests.length > 0 ? guests[0] : null;
  
  // Add effect to listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onReturn();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturn]);

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB');
  };

  return (
    <div className="terminal" tabIndex={0}>
      <style>
        {`
          .right-aligned-label {
            text-align: right;
            padding-right: 10px;
            width: 200px;
            display: inline-block;
          }
        `}
      </style>
      <div className="header">
        <div className="title">GUEST DETAILS</div>
        <div className="datetime">{currentDate} {currentTime}</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">CURRENT GUEST</div>
          <div className="panel-content">
            {!currentGuest ? (
              <div className="status-message">
                NO GUEST CURRENTLY CHECKED IN
              </div>
            ) : (
              <div className="guest-details">
                {/* Personal Information */}
                <div className="data-section">
                  <h3>PERSONAL INFORMATION</h3>
                  <div className="data-row">
                    <span className="label right-aligned-label">NAME:</span>
                    <span className="value">{`${currentGuest.firstName || ''} ${currentGuest.lastName || ''}`}</span>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="data-section">
                  <h3>CONTACT INFORMATION</h3>
                  <div className="data-row">
                    <span className="label right-aligned-label">EMAIL:</span>
                    <span className="value">{currentGuest.contact?.email || 'N/A'}</span>
                  </div>
                  <div className="data-row">
                    <span className="label right-aligned-label">PHONE:</span>
                    <span className="value">{currentGuest.contact?.phone || 'N/A'}</span>
                  </div>
                </div>
                
                {/* Booking Information */}
                <div className="data-section">
                  <h3>BOOKING DETAILS</h3>
                  {currentGuest.bookings && currentGuest.bookings.length > 0 ? (
                    <>
                      <div className="data-row">
                        <span className="label right-aligned-label">BOOKING ID:</span>
                        <span className="value">{currentGuest.bookings[0].bookingId || 'N/A'}</span>
                      </div>
                      <div className="data-row">
                        <span className="label right-aligned-label">CHECK-IN DATE:</span>
                        <span className="value">{formatDate(currentGuest.bookings[0].checkInDate)}</span>
                      </div>
                      <div className="data-row">
                        <span className="label right-aligned-label">NUMBER OF NIGHTS:</span>
                        <span className="value">{currentGuest.bookings[0].numberOfNights || 'N/A'}</span>
                      </div>
                      <div className="data-row">
                        <span className="label right-aligned-label">NUMBER OF GUESTS:</span>
                        <span className="value">
                          {currentGuest.bookings[0].numberOfGuests 
                            ? `${currentGuest.bookings[0].numberOfGuests.adults} ADULTS / ${currentGuest.bookings[0].numberOfGuests.children} CHILDREN` 
                            : 'N/A'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="data-row">
                      <span className="value">NO BOOKING INFORMATION AVAILABLE</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=RETURN</div>
      </div>
    </div>
  );
};

export default ViewGuests;
