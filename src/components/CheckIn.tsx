import { useState } from 'react';
import '../styles/mainframe.css';
import { Guest } from '../types/guest';

interface CheckInProps {
  onReturn: () => void;
  onSubmit: (guestData: Partial<Guest>) => void;
}

const CheckIn = ({ onReturn, onSubmit }: CheckInProps) => {
  const [currentField, setCurrentField] = useState(0);
  const [guestData, setGuestData] = useState<Partial<Guest>>(() => {
    // Generate the initial state with today's date
    const today = new Date();
    
    return {
      firstName: '',
      lastName: '',
      nationality: '',
      contact: {
        email: '',
        phone: '',
      },
      identification: {
        type: 'passport',
        number: '',
        issuingCountry: '',
        expirationDate: new Date(),
      },
      bookings: [{
        bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        checkInDate: today, // Always set to today
        numberOfNights: 1,
        numberOfGuests: { adults: 1, children: 0 },
        status: 'confirmed',
        paymentStatus: 'pending',
        totalAmount: { currency: 'USD', amount: 0 },
        dateMade: today // Also use today's date for dateMade
      }]
    };
  });

  const fields = [
    { id: 'firstName', label: 'FIRST NAME', maxLength: 20 },
    { id: 'lastName', label: 'LAST NAME', maxLength: 20 },
    { id: 'contactEmail', label: 'EMAIL', maxLength: 30, path: 'contact.email' },
    { id: 'contactPhone', label: 'PHONE', maxLength: 15, path: 'contact.phone' },
    { id: 'nights', label: 'NUMBER OF NIGHTS', type: 'number', min: 1, max: 365, path: 'bookings[0].numberOfNights' },
    { id: 'adults', label: 'ADULT GUESTS', type: 'number', min: 1, max: 10, path: 'bookings[0].numberOfGuests.adults' },
    { id: 'children', label: 'CHILD GUESTS', type: 'number', min: 0, max: 10, path: 'bookings[0].numberOfGuests.children' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, fieldId: string, path?: string, isNumber: boolean = false) => {
    // Convert value to number if it's a number input
    const value = isNumber ? Number(e.target.value) : e.target.value;
    
    if (path) {
      // Handle nested properties using the path
      const pathParts = path.split('.');
      setGuestData(prev => {
        const newData = { ...prev };
        let current: any = newData;
        
        // Navigate to the nested property container
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          
          if (part.includes('[')) {
            const arrayName = part.split('[')[0];
            const index = parseInt(part.split('[')[1].split(']')[0]);
            
            if (!current[arrayName]) current[arrayName] = [];
            if (!current[arrayName][index]) current[arrayName][index] = {};
            current = current[arrayName][index];
          } else {
            if (!current[part]) current[part] = {};
            current = current[part];
          }
        }
        
        // Set the value on the final property
        current[pathParts[pathParts.length - 1]] = value;
        return newData;
      });
    } else {
      // Handle top-level properties
      setGuestData({ ...guestData, [fieldId]: value });
    }
    
    // Move to next field if not the last one
    if (currentField < fields.length - 1) {
      setCurrentField(currentField + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F3' || e.key === 'Escape') {
      onReturn();
    } else if (e.key === 'Enter' && currentField === fields.length - 1) {
      onSubmit(guestData);
    }
  };

  return (
    <div className="terminal" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="header">
        <div className="title">GUEST CHECK-IN</div>
        <div className="booking-id">
          {guestData.bookings?.[0]?.bookingId || 'NEW BOOKING'}
        </div>
        <div className="screen-id">CHK001</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">GUEST INFORMATION</div>
          <div className="panel-content">
            <form>
              {fields.map((field, index) => (
                <div className="data-row" key={field.id}>
                  <span className="label" style={{ textAlign: 'right', paddingRight: '10px', width: '200px', display: 'inline-block' }}>
                    {field.label}:
                  </span>
                  { field.type === 'number' ? (
                    <input
                      type="number"
                      className="terminal-input number-input"
                      min={field.min}
                      max={field.max}
                      onChange={(e) => handleChange(e, field.id, field.path, true)} // Pass true for number inputs
                      autoFocus={index === currentField}
                    />
                  ) : (
                    <input
                      type="text"
                      className="terminal-input text-input"
                      maxLength={field.maxLength}
                      onChange={(e) => handleChange(e, field.id, field.path, false)}
                      autoFocus={index === currentField}
                    />
                  )}
                </div>
              ))}
            </form>
            
            <div className="status-message">
              {currentField === fields.length - 1 ? 'PRESS ENTER TO COMPLETE CHECK-IN' : 'ENTER GUEST DETAILS'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=RETURN</div>
        <div className="key">TAB=NEXT FIELD</div>
      </div>
    </div>
  );
};

export default CheckIn;
