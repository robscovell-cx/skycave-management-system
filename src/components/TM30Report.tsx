import { useState, useEffect } from 'react';
import '../styles/mainframe.css';
import { TM30ReportItem, Guest, Booking } from '../types/guest';
import useDateTime from '../hooks/useDateTime';
import { formatISODate, calculateCheckoutDate } from '../utils/dateUtils';

interface TM30ReportProps {
  reportItems: TM30ReportItem[];
  guestBookings: Partial<Guest>[];
  onUpdateItem: (index: number, field: keyof TM30ReportItem, value: string) => void;
  onSubmitReport: () => void;
  onReturn: () => void;
}

const TM30Report = ({ reportItems, guestBookings, onUpdateItem, onSubmitReport, onReturn }: TM30ReportProps) => {
  // Get current date and time
  const [currentDate, currentTime] = useDateTime();
  
  // Local UI state
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [currentField, setCurrentField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  
  // Add state for confirmation
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmChoice, setConfirmChoice] = useState<'Y' | 'N' | ''>('');
  
  // Create a map of bookingIds to booking objects for quick access
  const bookingsMap: Record<string, Booking> = {};
  guestBookings.forEach(guest => {
    guest.bookings?.forEach(booking => {
      if (booking.bookingId) {
        bookingsMap[booking.bookingId] = booking as Booking;
      }
    });
  });
  
  // Helper function to format dates consistently using ISO format
  const formatDate = (date: Date): string => {
    return formatISODate(date);
  };
  
  // Add function to handle printing
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Write print-specific HTML directly to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>TM30 Form - ${currentBookingId}</title>
            <style>
              /* Basic reset */
              * { margin: 0; padding: 0; box-sizing: border-box; }
              
              /* Container */
              .tm30-printable-container {
                font-family: Arial, sans-serif;
                width: 100%;
                padding: 20mm 10mm;
                background-color: white;
                color: black;
              }
              
              /* Header */
              .tm30-printable-header {
                text-align: center;
                margin-bottom: 10mm;
              }
              
              .tm30-printable-header h1 {
                font-size: 18pt;
                margin-bottom: 5mm;
              }
              
              .tm30-printable-header h2, .tm30-printable-header h3 {
                font-size: 16pt;
                margin: 2mm 0;
              }
              
              /* Table */
              .tm30-printable-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10mm;
              }
              
              .tm30-printable-table th, .tm30-printable-table td {
                border: 1px solid #000;
                padding: 3mm;
                text-align: center;
                font-size: 10pt;
              }
              
              .tm30-printable-table th {
                background-color: #f9f9f9;
                font-weight: bold;
              }
              
              /* Footer */
              .tm30-printable-footer {
                margin-top: 20mm;
              }
              
              .signature-section {
                float: right;
                text-align: center;
                width: 80mm;
              }
              
              .signature-line {
                margin-bottom: 30mm;
              }
              
              /* Column widths */
              .col-no { width: 5%; }
              .col-name { width: 15%; }
              .col-nationality { width: 10%; }
              .col-passport { width: 10%; }
              .col-visa { width: 8%; }
              .col-arrival { width: 8%; }
              .col-expiry { width: 8%; }
              .col-entry { width: 10%; }
              .col-tm { width: 8%; }
              .col-period { width: 10%; }
              .col-relation { width: 8%; }
              
              @media print {
                body { 
                  background-color: white;
                  padding: 0;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="tm30-printable-container">
              <div class="tm30-printable-header">
                <h1>บัญชีรายชื่อคนต่างด้าวที่พักอาศัย</h1>
                <h2>NAME OF ALIENS IN RESIDENCE</h2>
                <h3>(IN BLOCK LETTERS)</h3>
              </div>
              <table class="tm30-printable-table">
                <thead>
                  <tr>
                    <th class="col-no">ลำดับ<br/>NO.</th>
                    <th class="col-name">ชื่อคนต่างด้าว<br/>Name and Surname</th>
                    <th class="col-nationality">สัญชาติ<br/>Nationality</th>
                    <th class="col-passport">หนังสือเดินทางเลขที่<br/>Passport Number</th>
                    <th class="col-visa">ประเภทวีซ่า<br/>Type of Visa</th>
                    <th class="col-arrival">วันเดินทางเข้า<br/>Date of Arrival</th>
                    <th class="col-expiry">ครบกำหนดอนุญาต<br/>Expiry Date of Stay</th>
                    <th class="col-entry">ช่องทางเข้า<br/>Point of Entry</th>
                    <th class="col-tm">บัตรขาเข้าเลขที่<br/>Arrival Card T.M.No.</th>
                    <th class="col-period">พักอาศัยระหว่าง วันที่...<br/>Period of stay From....to.....</th>
                    <th class="col-relation">ความเกี่ยวพัน<br/>Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportItems.map((item, index) => {
                    // Get booking information if available
                    const booking = bookingsMap[item.bookingId];
                    
                    // Format period of stay using booking information
                    let periodOfStay = '';
                    if (booking) {
                      const fromDate = formatDate(booking.checkInDate);
                      
                      // Calculate checkout date based on number of nights
                      const checkoutDate = calculateCheckoutDate(booking.checkInDate, booking.numberOfNights);
                      const toDate = formatDate(checkoutDate);
                      
                      periodOfStay = `From ${fromDate} To ${toDate}`;
                    }
                    
                    return `
                    <tr>
                      <td class="col-no">${index + 1}</td>
                      <td class="col-name">${item.nameAndSurname}</td>
                      <td class="col-nationality">${item.nationality}</td>
                      <td class="col-passport">${item.passportNumber}</td>
                      <td class="col-visa">${item.typeOfVisa}</td>
                      <td class="col-arrival">${item.dateOfArrivalInThailand}</td>
                      <td class="col-expiry">${item.expiryDateOfStay}</td>
                      <td class="col-entry">${item.pointOfEntry}</td>
                      <td class="col-tm"></td>
                      <td class="col-period">${periodOfStay}</td>
                      <td class="col-relation">${item.relationship}</td>
                    </tr>
                  `}).join('')}
                  ${[...Array(Math.max(0, 10 - reportItems.length))].map((_, i) => `
                    <tr class="empty-row">
                      <td class="col-no">${reportItems.length + i + 1}</td>
                      <td class="col-name"></td>
                      <td class="col-nationality"></td>
                      <td class="col-passport"></td>
                      <td class="col-visa"></td>
                      <td class="col-arrival"></td>
                      <td class="col-expiry"></td>
                      <td class="col-entry"></td>
                      <td class="col-tm"></td>
                      <td class="col-period"></td>
                      <td class="col-relation"></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="tm30-printable-footer">
                <div class="signature-section">
                  <div class="signature-line">ลายมือชื่อ................................................ผู้รับรองรายการ</div>
                  <div class="signature-name">(................................................)</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.oncancel = () => printWindow.close();
        printWindow.onafterprint = () => printWindow.close();
      }, 500);
    }
  };

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle confirmation dialog keys
      if (showConfirmation) {
        if (e.key.toLowerCase() === 'y') {
          setConfirmChoice('Y');
        } else if (e.key.toLowerCase() === 'n') {
          setConfirmChoice('N');
        } else if (e.key === 'Enter') {
          if (confirmChoice.toUpperCase() === 'Y') {
            // Submit report and return to main menu
            onSubmitReport();
          } else if (confirmChoice.toUpperCase() === 'N') {
            // Cancel confirmation
            setShowConfirmation(false);
            setConfirmChoice('');
          }
        } else if (e.key === 'Escape') {
          setShowConfirmation(false);
          setConfirmChoice('');
        }
        return;
      }

      if (e.key === 'Escape') {
        if (selectedItemIndex >= 0) {
          // Exit edit mode
          setSelectedItemIndex(-1);
          setCurrentField('');
        } else {
          // Return to main menu
          onReturn();
        }
      } else if (e.key === 'ArrowUp') {
        if (selectedItemIndex > 0) {
          setSelectedItemIndex(prev => prev - 1);
        }
      } else if (e.key === 'ArrowDown') {
        if (selectedItemIndex < reportItems.length - 1) {
          setSelectedItemIndex(prev => prev + 1);
        }
      } else if (e.key === 'Enter') {
        if (selectedItemIndex >= 0 && currentField) {
          // Update field value
          updateFieldValue();
        } 
      } else if (e.key.toLowerCase() === 'p' && reportItems.length > 0) {
        // Add shortcut key for printing
        handlePrint();
      } else if (e.key === 'Tab') {
        // Prevent default tab behavior
        e.preventDefault();
        
        if (selectedItemIndex >= 0 && currentField) {
          // Save current field value first
          updateFieldValue(false);
          
          // Move forward or backward based on shift key
          const fields: (keyof TM30ReportItem)[] = [
            'bookingId', 'nameAndSurname', 'nationality', 'passportNumber', 'typeOfVisa',
            'dateOfArrivalInThailand', 'expiryDateOfStay', 'pointOfEntry', 'relationship'
          ];
          
          const currentIndex = fields.indexOf(currentField as keyof TM30ReportItem);
          
          if (e.shiftKey) {
            // Move backward (Shift+Tab)
            if (currentIndex > 0) {
              // Move to previous field in same row
              setCurrentField(fields[currentIndex - 1]);
              setEditValue(reportItems[selectedItemIndex][fields[currentIndex - 1]]);
            } else if (selectedItemIndex > 0) {
              // Move to last field of previous row
              setSelectedItemIndex(prev => prev - 1);
              setCurrentField(fields[fields.length - 1]);
              setEditValue(reportItems[selectedItemIndex - 1][fields[fields.length - 1]]);
            }
          } else {
            // Move forward (Tab)
            if (currentIndex < fields.length - 1) {
              // Move to next field in same row
              setCurrentField(fields[currentIndex + 1]);
              setEditValue(reportItems[selectedItemIndex][fields[currentIndex + 1]]);
            } else if (selectedItemIndex < reportItems.length - 1) {
              // Move to first field of next row
              setSelectedItemIndex(prev => prev + 1);
              setCurrentField(fields[0]);
              setEditValue(reportItems[selectedItemIndex + 1][fields[0]]);
            }
          }
        } else if (reportItems.length > 0) {
          // Start editing the first field of the first row if not in edit mode
          setSelectedItemIndex(0);
          setCurrentField('bookingId');
          setEditValue(reportItems[0]['bookingId']);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturn, onSubmitReport, selectedItemIndex, currentField, reportItems.length, editValue, reportItems, showConfirmation, confirmChoice]);
  
  // Handle selecting a field for editing
  const handleSelectField = (index: number, field: keyof TM30ReportItem) => {
    // Don't allow selecting bookingId for editing - it's read-only
    if (field === 'bookingId') return;
    
    setSelectedItemIndex(index);
    setCurrentField(field);
    setEditValue(reportItems[index][field]);
  };
  
  // Update the field value
  const updateFieldValue = (moveNext = true) => {
    if (selectedItemIndex >= 0 && currentField) {
      // Update the item in the parent component
      onUpdateItem(selectedItemIndex, currentField as keyof TM30ReportItem, editValue);
      
      // If moveNext is true, automatically advance to the next field
      if (moveNext) {
        const fields: (keyof TM30ReportItem)[] = [
          'bookingId', 'nameAndSurname', 'nationality', 'passportNumber', 'typeOfVisa',
          'dateOfArrivalInThailand', 'expiryDateOfStay', 'pointOfEntry', 'relationship'
        ];
        
        const currentIndex = fields.indexOf(currentField as keyof TM30ReportItem);
        if (currentIndex < fields.length - 1) {
          // Move to next field
          setCurrentField(fields[currentIndex + 1]);
          setEditValue(reportItems[selectedItemIndex][fields[currentIndex + 1]]);
        } else if (selectedItemIndex < reportItems.length - 1) {
          // Move to first field of next record
          setSelectedItemIndex(prev => prev + 1);
          setCurrentField(fields[0]);
          setEditValue(reportItems[selectedItemIndex + 1][fields[0]]);
        } else {
          // End of records - exit edit mode
          setSelectedItemIndex(-1);
          setCurrentField('');
        }
      }
    }
  };

  // Define table column widths
  const columnWidths = {
    bookingId: 120,
    nameAndSurname: 180,
    nationality: 120,
    passportNumber: 120,
    typeOfVisa: 100,
    dateOfArrivalInThailand: 120,
    expiryDateOfStay: 120,
    pointOfEntry: 120,
    relationship: 200,
  };

  // Find the booking ID from the first report item if available
  const currentBookingId = reportItems.length > 0 ? reportItems[0].bookingId : 'NO BOOKING';
  
  return (
    <div className="terminal" tabIndex={0}>
      <div className="header">
        <div className="title">TM30 FOREIGN GUEST REPORT</div>
        <div className="booking-id">{currentBookingId}</div>
        <div className="datetime">{currentDate} {currentTime}</div>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">GUEST REPORTING DATA</div>
          <div className="panel-content">
            {reportItems.length === 0 ? (
              <div className="status-message">
                NO GUESTS CURRENTLY CHECKED IN
              </div>
            ) : (
              <>
                <div className="tm30-table">
                  <style>
                    {`
                      .tm30-table {
                        overflow-x: auto;
                        white-space: nowrap;
                      }
                      
                      .tm30-table-header {
                        display: flex;
                        border-bottom: 1px solid var(--terminal-green);
                        padding-bottom: 8px;
                        margin-bottom: 8px;
                        font-weight: bold;
                      }
                      
                      .tm30-table-row {
                        display: flex;
                        padding: 4px 0;
                        cursor: pointer;
                      }
                      
                      .tm30-table-row:hover {
                        background-color: var(--terminal-dark-green);
                      }
                      
                      .tm30-table-row.selected {
                        background-color: var(--terminal-dark-green);
                      }
                      
                      .tm30-table-cell {
                        padding: 0 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      }
                      
                      .tm30-table-cell.editing {
                        background-color: var(--terminal-dark-green);
                      }
                      
                      .tm30-input {
                        background: none;
                        border: none;
                        color: var(--terminal-green);
                        font-family: inherit;
                        font-size: inherit;
                        width: 100%;
                        outline: none;
                      }
                    `}
                  </style>
                  
                  <div className="tm30-table-header">
                    <div className="tm30-table-cell" style={{ width: columnWidths.nameAndSurname }}>NAME & SURNAME</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.nationality }}>NATIONALITY</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.passportNumber }}>PASSPORT NO.</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.typeOfVisa }}>VISA TYPE</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.dateOfArrivalInThailand }}>ARRIVAL DATE</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.expiryDateOfStay }}>EXPIRY DATE</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.pointOfEntry }}>ENTRY POINT</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.relationship }}>RELATIONSHIP</div>
                    <div className="tm30-table-cell" style={{ width: columnWidths.bookingId }}>BOOKING ID</div>
                  </div>
                  
                  <div className="tm30-table-body">
                    {reportItems.map((item, index) => (
                      <div 
                        key={index} 
                        className={`tm30-table-row ${index === selectedItemIndex ? 'selected' : ''}`}
                        onClick={() => setSelectedItemIndex(index)}
                      >
                        {Object.entries(item).map(([key, value]) => {
                          const isBookingId = key === 'bookingId';
                          return (
                            <div 
                              key={key} 
                              className={`tm30-table-cell ${selectedItemIndex === index && currentField === key ? 'editing' : ''} ${isBookingId ? 'read-only' : ''}`}
                              style={{ 
                                width: columnWidths[key as keyof TM30ReportItem],
                                color: isBookingId ? 'var(--terminal-amber)' : 'inherit' // Visual indication it's special
                              }}
                              onClick={() => handleSelectField(index, key as keyof TM30ReportItem)}
                            >
                              {selectedItemIndex === index && currentField === key && !isBookingId ? (
                                <input 
                                  type="text" 
                                  className="tm30-input" 
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  autoFocus
                                />
                              ) : (
                                value || '-'
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add Print Button */}
                <div className="print-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={handlePrint}
                    className="terminal-button"
                    style={{
                      backgroundColor: 'var(--terminal-black)',
                      color: 'var(--terminal-green)',
                      border: '1px solid var(--terminal-green)',
                      padding: '8px 16px',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    PRESS P TO PRINT THE TM30 FORM
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=RETURN</div>
        <div className="key">ENTER=CONFIRM EDIT</div>
        <div className="key">TAB=NEXT FIELD</div>
        <div className="key">SHIFT+TAB=PREV FIELD</div>
        <div className="key">↑↓=NAVIGATE</div>
        <div className="key">P=PRINT FORM</div>
      </div>
    </div>
  );
};

export default TM30Report;
