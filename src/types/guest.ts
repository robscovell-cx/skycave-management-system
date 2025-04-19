/**
 * Represents a guest's contact information
 */
export interface ContactInfo {
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

/**
 * Represents a guest's identification document
 */
export interface Identification {
  type: 'passport' | 'driverLicense' | 'idCard' | 'other';
  number: string;
  issuingCountry: string;
  expirationDate: Date;
  documentScanId?: string; // reference to uploaded scan
}

/**
 * Represents a booking associated with a guest
 */
export interface Booking {
  bookingId: string;
  checkInDate: Date;
  numberOfNights: number;
  numberOfGuests: {
    adults: number;
    children: number;
  };
  specialRequests?: string;
  roomPreferences?: string[];
  status: 'confirmed' | 'checkedIn' | 'checkedOut' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'complete' | 'refunded';
  totalAmount: {
    currency: string;
    amount: number;
  };
  dateMade: Date;
}

/**
 * Represents a main guest entity
 */
export interface Guest {
  guestId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contact: ContactInfo;
  identification: Identification;
  bookings: Booking[];
  loyaltyPoints?: number;
  accountCreationDate: Date;
  preferredLanguage: string;
  marketingConsent: boolean;
  notes?: string;
  tags?: string[];
  visitCount: number;
  lastVisitDate?: Date;
}

/**
 * Represents guest feedback for a stay
 */
export interface GuestFeedback {
  guestId: string;
  bookingId: string;
  rating: number; // 1-5 stars
  comments?: string;
  submissionDate: Date;
  categories?: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
}

/**
 * Represents a TM40 report item for Thai immigration reporting
 */
export interface TM30ReportItem {
  bookingId: string; // Reference to connect with the original booking
  nameAndSurname: string;
  nationality: string;
  passportNumber: string;
  typeOfVisa: string;
  dateOfArrivalInThailand: string; // Using string for plain text entry
  expiryDateOfStay: string; // Using string for plain text entry
  pointOfEntry: string;
  relationship: string;
}

/**
 * Guest document type for database operations
 */
export type GuestDocument = Guest & {
  createdAt: Date;
  updatedAt: Date;
};
