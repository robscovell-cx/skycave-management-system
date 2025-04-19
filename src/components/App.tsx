import { useState, useEffect } from 'react'
import '../styles/mainframe.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')

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
            <div className="data-row">
              <span className="label">TRANSACTION COUNT:</span>
              <span className="value">{count}</span>
            </div>

            <div className="data-row">
              <span className="label">STATUS:</span>
              <span className="value">READY</span>
            </div>

            <div className="input-field">
              <span className="label">ENTER SELECTION:</span>
              <span className="input-area">_____</span>
            </div>
          </div>
          <div className="action-button">
            <button onClick={() => setCount(count + 1)}>PROCESS</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
