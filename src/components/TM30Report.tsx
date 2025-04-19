import { useState, useEffect } from 'react';
import '../styles/mainframe.css';
import { TM30ReportItem } from '../types/guest';
import useDateTime from '../hooks/useDateTime';

interface TM30ReportProps {
  reportItems: TM30ReportItem[];
  onUpdateItem: (index: number, field: keyof TM30ReportItem, value: string) => void;
  onSubmitReport: () => void;
  onReturn: () => void;
}

const TM30Report = ({ reportItems, onUpdateItem, onSubmitReport, onReturn }: TM30ReportProps) => {
  // Get current date and time
  const [currentDate, currentTime] = useDateTime();
  
  // Local UI state
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [currentField, setCurrentField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  
  // Add state for confirmation
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmChoice, setConfirmChoice] = useState<'Y' | 'N' | ''>('');

  // Check if all fields are complete
  const areAllFieldsComplete = (): boolean => {
    return reportItems.every(item => 
      item.nameAndSurname.trim() !== '' && 
      item.nationality.trim() !== '' && 
      item.passportNumber.trim() !== '' && 
      item.typeOfVisa.trim() !== '' && 
      item.dateOfArrivalInThailand.trim() !== '' && 
      item.expiryDateOfStay.trim() !== '' && 
      item.pointOfEntry.trim() !== '' && 
      item.relationship.trim() !== ''
    );
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
          if (confirmChoice === 'Y') {
            // Submit report and return to main menu
            onSubmitReport();
          } else if (confirmChoice === 'N') {
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
        } else if (areAllFieldsComplete()) {
          // Show confirmation when not in edit mode and fields are complete
          setShowConfirmation(true);
        }
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
  }, [onReturn, onSubmitReport, selectedItemIndex, currentField, reportItems.length, editValue, reportItems, showConfirmation, confirmChoice]);
  
  // Handle selecting a field for editing
  const handleSelectField = (index: number, field: keyof TM30ReportItem) => {
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
                
                {areAllFieldsComplete() && !showConfirmation && selectedItemIndex < 0 && (
                  <div className="confirmation-options" style={{ marginTop: "20px" }}>
                    <p>ALL FIELDS COMPLETE. DO YOU WANT TO SUBMIT THE TM30 REPORT?</p>
                    {showConfirmation ? (
                      <div className="input-field">
                        <span className="label">ENTER CHOICE (Y/N):</span>
                        <input 
                          type="text" 
                          className="terminal-input"
                          value={confirmChoice}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            if (value === 'Y' || value === 'N' || value === '') {
                              setConfirmChoice(value as 'Y' | 'N' | '');
                            }
                          }}
                          maxLength={1}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="status-message">
                        PRESS ENTER TO CONFIRM SUBMISSION
                      </div>
                    )}
                  </div>
                )}
                
                {showConfirmation && (
                  <div className="confirmation-dialog">
                    <div className="confirmation-message">
                      <p>CONFIRM SUBMISSION OF TM30 REPORT?</p>
                    </div>
                    <div className="confirmation-options">
                      <div className="input-field">
                        <span className="label">ENTER CHOICE (Y/N):</span>
                        <input 
                          type="text" 
                          className="terminal-input"
                          value={confirmChoice}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            if (value === 'Y' || value === 'N' || value === '') {
                              setConfirmChoice(value as 'Y' | 'N' | '');
                            }
                          }}
                          maxLength={1}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="status-message">
              {showConfirmation ? 
                confirmChoice ? 'PRESS ENTER TO CONFIRM' : 'ENTER Y FOR YES, N FOR NO' :
                selectedItemIndex >= 0 ? 
                  'EDITING FIELD - PRESS ENTER TO CONFIRM, ESC TO CANCEL' : 
                  areAllFieldsComplete() ?
                    'ALL FIELDS COMPLETE - PRESS ENTER TO SUBMIT' :
                    'SELECT A FIELD TO EDIT - PRESS ESC TO RETURN'
              }
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
        {!showConfirmation && areAllFieldsComplete() && selectedItemIndex < 0 && (
          <div className="key">ENTER=SUBMIT</div>
        )}
      </div>
    </div>
  );
};

export default TM30Report;
