// types.ts

// Basistypen, die in den GraphQL-Daten enthalten sind
export type ID = string;

export interface Client {
  id: ID;
  street?: string;
  zipcode?: string;
  city?: string;
  country: string; // ISO 3166-1 alpha-2 country code
  language?: string; // ISO 639-1 2 character code
  email?: string;
  telephone?: string;
  mobile?: string;
  fax?: string;
  preferences?: string;
  newsletterSubscriptionEnabled: boolean;
}

export interface Person extends Client {
  firstname?: string;
  lastname?: string;
}

export interface Company extends Client {
  company?: string;
}

export interface Contact extends Client {
  firstname?: string;
  lastname?: string;
  email?: string;
  telephone?: string;
  mobile?: string;
}

export interface RoomStaysResponse {
  room_stays: {
    edges: Array<{
      node: RoomStay;
    }>;
  };
}

export type Date = string;  // Assume Date is serialized as a string
export type Datetime = string; // Assume Datetime is serialized as a string

export interface IdOperators {
    eq?: ID;
    in?: ID[];
}

export interface DateOperators {
    lt?: Date;
    le?: Date;
    eq?: Date;
    ge?: Date;
    gt?: Date;
    in?: Date[];
}

export interface DatetimeOperators {
    lt?: Datetime;
    le?: Datetime;
    eq?: Datetime;
    ge?: Datetime;
    gt?: Datetime;
    in?: Datetime[];
}

export enum ReservationStatus {
    CONFIRMED,
    CANCELED,
    PENDING,
    CHECKED_IN,
    CHECKED_OUT
}

export interface ReservationStatusOperators {
    eq?: ReservationStatus;
    in?: ReservationStatus[];
}

// Part of types.ts
export interface RoomStayFilter {
  id?: IdOperators;
  date?: string; // Direct date usage
  reservation_from?: DateOperators;
  reservation_to?: DateOperators;
  reservationStatus?: ReservationStatusOperators;
  updatedAt?: DatetimeOperators;
  check_in?: DatetimeOperators;
  check_out?: DatetimeOperators;
  not?: RoomStayFilter; // This allows for recursive filtering (negation)
}


// Part of types.ts
export interface RoomSetup {
  id: ID;
  name: string;
  areaName: string;
  cleaningStatus: string;
  category: Category;
}

export interface Category {
  id: ID;
  name: string;
  standardOccupancy: number;
  minOccupancy: number;
  maxOccupancy: number;
  minimumRate: number;
}

export interface DailyRate {
  date: string;
  amount: number;
}

export interface DailyRatesConnection {
  edges: Array<{ node: DailyRate }>;
}

export interface AgeGroups {
  adults: number;
  child1: number;
  child2: number;
  free: number;
}

export interface RoomAccessKey {
  id: ID;
}

export interface RoomStay {
  id?: ID;
  reservation?: Reservation; // Ensure this matches your data structure
  room_setup?: RoomSetup;
  roomName?: string;
  category?: Category;
  guests?: Person[];
  first_guest?: Person;
  gross?: number;
  dailyRates?: DailyRatesConnection;
  lodgingsGross?: number;
  additionalSales?: number;
  reservation_from?: string;
  reservation_to?: string;
  check_in?: string;
  check_out?: string;
  selfcheckout_enabled?: boolean;
  selfcheckout_url?: string;
  mealNotes?: string;
  maidNotes?: string;
  guestMessage?: string;
  ageGroups?: AgeGroups;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomStaysResponse {
  room_stays: {
    edges: Array<{
      node: RoomStay;
    }>;
  };
}

export interface Deposit {
  id: ID;
  amount: number;
  paymentMethodName?: string;
  datetime?: string;
}

export interface BookingSource {
  name?: string;
}

export interface BookingType {
  name?: string;
}

export interface StayType {
  name?: string;
}

// Haupt-Reservierungstyp
export interface Reservation {
  id: ID;
  code?: string;
  bookingChannelCode?: string;
  pmsUrl: string;
  status: string;
  groupName?: string;
  client: Client;
  contact?: Contact;
  selfcheckinStatus: string;
  selfcheckinUrl?: string;
  bookingSource?: BookingSource;
  bookingType?: BookingType;
  stayType?: StayType;
  rooms: RoomStay[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
  deposits: Deposit[];
  totalAmount: number;
  openAmount: number;
}

// Antwort von der GraphQL-Query
export interface ReservationsResponse {
  reservations: {
    edges: Array<{
      node: Reservation;
    }>;
  };
}
