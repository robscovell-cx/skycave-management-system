import { useState, useEffect } from 'react';
import '../styles/mainframe.css';
import { Guest, TM30ReportItem } from '../types/guest';
import useDateTime from '../hooks/useDateTime';

interface TM30ReportProps {
  guests: Partial<Guest>[];
  onReturn: () => void;
}

const TM30Report = ({ guests, onReturn }: TM30ReportProps) => {
  // Get current date and time
  const [currentDate, currentTime] = useDateTime();
  
  // State to hold TM30 report items
  const [reportItems, setReportItems] = useState<TM30ReportItem[]>(generateInitialReportItems(guests));
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [currentField, setCurrentField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  
  // Generate initial report items from guests data
  function generateInitialReportItems(guests: Partial<Guest>[]): TM30ReportItem[] {
    let items: TM30ReportItem[] = [];
    
    guests.forEach(guest => {
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
            });
          }
        }
      }
    });
    
    return items;
  }
  
  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (e.key === 'Enter' && selectedItemIndex >= 0 && currentField) {
        // Update the field value
        updateFieldValue();
      } else if (e.key === 'Tab') {
        // Prevent default tab behavior
        e.preventDefault();
        
        if (selectedItemIndex >= 0 && currentField) {
          // Save current field value first
          updateFieldValue(false);
          
          // Move forward or backward based on shift key
          const fields: (keyof TM30ReportItem)[] = [
            'nameAndSurname', 'nationality', 'passportNumber', 'typeOfVisa',
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
          setCurrentField('nameAndSurname');
          setEditValue(reportItems[0]['nameAndSurname']);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturn, selectedItemIndex, currentField, reportItems.length, editValue, reportItems]);
  
  // Handle selecting a field for editing
  const handleSelectField = (index: number, field: keyof TM30ReportItem) => {
    setSelectedItemIndex(index);
    setCurrentField(field);
    setEditValue(reportItems[index][field]);
  };
  
  // Update the field value in the reportItems state
  const updateFieldValue = (moveNext = true) => {
    if (selectedItemIndex >= 0 && currentField) {
      setReportItems(prev => {
        const updated = [...prev];
        updated[selectedItemIndex] = {
          ...updated[selectedItemIndex],
          [currentField]: editValue
        };
        return updated;
      });
      
      // If moveNext is true, automatically advance to the next field
      if (moveNext) {
        const fields: (keyof TM30ReportItem)[] = [
          'nameAndSurname', 'nationality', 'passportNumber', 'typeOfVisa',
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
    nameAndSurname: 200,
    nationality: 120,
    passportNumber: 120,
    typeOfVisa: 100,
    dateOfArrivalInThailand: 120,
    expiryDateOfStay: 120,
    pointOfEntry: 120,
    relationship: 200, // Doubled from 100 to 200
  };
  
  return (
    <div className="terminal" tabIndex={0}>
      <div className="header">
        <div className="title">TM30 FOREIGN GUEST REPORT</div>
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
                </div>
                
                <div className="tm30-table-body">
                  {reportItems.map((item, index) => (
                    <div 
                      key={index} 
                      className={`tm30-table-row ${index === selectedItemIndex ? 'selected' : ''}`}
                      onClick={() => setSelectedItemIndex(index)}
                    >
                      {Object.entries(item).map(([key, value]) => (
                        <div 
                          key={key} 
                          className={`tm30-table-cell ${selectedItemIndex === index && currentField === key ? 'editing' : ''}`}
                          style={{ width: columnWidths[key as keyof TM30ReportItem] }}
                          onClick={() => handleSelectField(index, key as keyof TM30ReportItem)}
                        >
                          {selectedItemIndex === index && currentField === key ? (
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
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="status-message">
              {selectedItemIndex >= 0 ? 
                'EDITING FIELD - PRESS ENTER TO CONFIRM, ESC TO CANCEL' : 
                'SELECT A FIELD TO EDIT - PRESS ESC TO RETURN'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">ESC=RETURN</div>
        <div className="key">ENTER=CONFIRM EDIT</div>
        <div className="key">TAB=NEXT FIELD</div>
        <div className="key">SHIFT+TAB=PREV FIELD</div>
        <div className="key">↑↓=NAVIGATE</div>
      </div>
    </div>
  );
};

export default TM30Report;
