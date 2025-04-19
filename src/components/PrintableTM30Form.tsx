import React from 'react';
import { TM30ReportItem } from '../types/guest';
import '../styles/printableTM30.css';

interface PrintableTM30FormProps {
  reportItems: TM30ReportItem[];
}

const PrintableTM30Form: React.FC<PrintableTM30FormProps> = ({ reportItems }) => {
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
          {reportItems.map((item, index) => (
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
              <td className="col-period">{/* Period - could be calculated from booking */}</td>
              <td className="col-relation">{item.relationship}</td>
            </tr>
          ))}
          {/* Add empty rows to fill out the form */}
          {[...Array(Math.max(0, 10 - reportItems.length))].map((_, i) => (
            <tr key={`empty-${i}`} className="empty-row">
              <td className="col-no">{reportItems.length + i + 1}</td>
              <td className="col-name"></td>
              <td className="col-nationality"></td>
              <td className="col-passport"></td>
              <td className="col-visa"></td>
              <td className="col-arrival"></td>
              <td className="col-expiry"></td>
              <td className="col-entry"></td>
              <td className="col-tm"></td>
              <td className="col-period"></td>
              <td className="col-relation"></td>
            </tr>
          ))}
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
