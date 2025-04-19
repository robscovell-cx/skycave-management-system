import React from 'react';
import { TM30ReportItem, Booking } from '../types/guest';
import '../styles/printableTM30.css';
import { formatISODate, calculateCheckoutDate } from '../utils/dateUtils';

interface PrintableTM30FormProps {
  reportItems: TM30ReportItem[];
  bookings?: Record<string, Booking>; // Map of bookingIds to Booking objects
}

// Helper function to format dates consistently using ISO format
const formatDate = (date: Date): string => {
  return formatISODate(date);
};

const PrintableTM30Form: React.FC<PrintableTM30FormProps> = ({ reportItems, bookings = {} }) => {
  return (
    <div className="tm30-printable-container">
      <div className="tm30-printable-header">
        <h1>บัญชีรายชื่อคนต่างด้าวที่พักอาศัย</h1>
        <h2>NAME OF ALIENS IN RESIDENCE</h2>
        <h3>(IN BLOCK LETTERS)</h3>
      </div>

      <table className="tm30-printable-table">
        <thead>
          <tr>
            <th className="col-no">ลำดับ<br/>NO.</th>
            <th className="col-name">ชื่อคนต่างด้าว<br/>Name and Surname</th>
            <th className="col-nationality">สัญชาติ<br/>Nationality</th>
            <th className="col-passport">หนังสือเดินทางเลขที่<br/>Passport Number</th>
            <th className="col-visa">ประเภทวีซ่า<br/>Type of Visa</th>
            <th className="col-arrival">วันเดินทางเข้า<br/>Date of Arrival</th>
            <th className="col-expiry">ครบกำหนดอนุญาต<br/>Expiry Date of Stay</th>
            <th className="col-entry">ช่องทางเข้า<br/>Point of Entry</th>
            <th className="col-tm">บัตรขาเข้าเลขที่<br/>Arrival Card T.M.No.</th>
            <th className="col-period">พักอาศัยระหว่าง วันที่...<br/>Period of stay From....to.....</th>
            <th className="col-relation">ความเกี่ยวพัน<br/>Relationship</th>
          </tr>
        </thead>
        <tbody>
          {reportItems.map((item, index) => {
            // Get booking information if available
            const booking = bookings[item.bookingId];
            
            // Format period of stay if booking information exists
            let periodOfStay = '';
            if (booking) {
              const fromDate = formatDate(booking.checkInDate);
              
              // Calculate checkout date based on number of nights
              const checkoutDate = calculateCheckoutDate(booking.checkInDate, booking.numberOfNights);
              const toDate = formatDate(checkoutDate);
              
              periodOfStay = `${fromDate} - ${toDate}`;
            }
            
            return (
              <tr key={index}>
                <td className="col-no">{index + 1}</td>
                <td className="col-name">{item.nameAndSurname}</td>
                <td className="col-nationality">{item.nationality}</td>
                <td className="col-passport">{item.passportNumber}</td>
                <td className="col-visa">{item.typeOfVisa}</td>
                <td className="col-arrival">{item.dateOfArrivalInThailand}</td>
                <td className="col-expiry">{item.expiryDateOfStay}</td>
                <td className="col-entry">{item.pointOfEntry}</td>
                <td className="col-tm">{/* TM Number not collected */}</td>
                <td className="col-period">{periodOfStay}</td>
                <td className="col-relation">{item.relationship}</td>
              </tr>
            );
          })}
          {/* Removed empty rows - only showing actual guests */}
        </tbody>
      </table>
      <div className="tm30-printable-footer">
        <div className="signature-section">
          <div className="signature-line">ลายมือชื่อ................................................ผู้รับรองรายการ</div>
          <div className="signature-name">(................................................)</div>
        </div>
      </div>
    </div>
  );
};

export default PrintableTM30Form;
