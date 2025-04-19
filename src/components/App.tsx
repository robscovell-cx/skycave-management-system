import { useState, useEffect } from 'react'
import '../styles/mainframe.css'

function App() {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

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

  return (
    <div className="terminal">
      <div className="header">
        <div className="title">AIRBNB MANAGEMENT SYSTEM</div>
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
              READY FOR INPUT
            </div>
          </div>
        </div>
      </div>
      
      <div className="function-keys">
        <div className="key">F1=HELP</div>
        <div className="key">F3=EXIT</div>
        <div className="key">ENTER=SUBMIT</div>
      </div>
    </div>
  )
}

export default App
