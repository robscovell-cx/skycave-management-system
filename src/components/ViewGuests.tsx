import { useState } from 'react';
import '../styles/mainframe.css';
import { Guest } from '../types/guest';

interface ViewGuestsProps {
  guests: Partial<Guest>[];
  onReturn: () => void;
}

const ViewGuests = ({ guests, onReturn }: ViewGuestsProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(guests.length / pageSize);

  // Handle key presses for navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F3' || e.key === 'Escape') {
      onReturn();
    } else if (e.key === 'ArrowDown' || e.key === 'N') {
      if (page < totalPages - 1) setPage(page + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'P') {
      if (page > 0) setPage(page - 1);
    }
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB');
  };

  // Get current page of guests
  const currentGuests = guests.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="terminal" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="header">
        <div className="title">CHECKED-IN GUESTS</div>
        <div className="screen-id">GST001</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">CURRENT GUESTS</div>
          <div className="panel-content">
            {guests.length === 0 ? (
              <div className="status-message">
                NO GUESTS CURRENTLY CHECKED IN
              </div>
            ) : (
              <>
                <table className="guest-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>ROOM</th>
                      <th>CHECK-IN</th>
                      <th>CHECK-OUT</th>
                      <th>GUESTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentGuests.map((guest, index) => {
                      const booking = guest.bookings?.[0];
                      return (
                        <tr key={index}>
                          <td>{`${guest.firstName || ''} ${guest.lastName || ''}`}</td>
                          <td>{booking?.bookingId || 'N/A'}</td>
                          <td>{formatDate(booking?.checkInDate)}</td>
                          <td>{formatDate(booking?.checkOutDate)}</td>
                          <td>
                            {booking?.numberOfGuests 
                              ? `${booking.numberOfGuests.adults} A / ${booking.numberOfGuests.children} C` 
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="pagination">
                  <div>PAGE {page + 1} OF {totalPages}</div>
                  {totalPages > 1 && (
                    <div>USE UP/DOWN ARROWS TO NAVIGATE PAGES</div>
                  )}
                </div>
                
                <div className="status-message">
                  {`${guests.length} GUEST(S) CURRENTLY CHECKED IN`}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">F3=RETURN</div>
        <div className="key">↑/↓=PAGE</div>
      </div>
    </div>
  );
};

export default ViewGuests;
