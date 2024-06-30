// types.ts
export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  details: {
    url: string;
    name: string;
    dates: {
      start: {
        localDate: string;
        localTime: string;
      };
    };
    classifications:Array<{
      genre: {
        name: string;
      }
    }>;
    images: Array<{
      url: string;
      ratio: string;
      width: number;
      height: number;
    }>;
    priceRanges: Array<{
      currency: string;
      min: number;
      max: number;
    }>;
    seatmap: {
      staticUrl: string;
    };
    promoter:{
      id: string;
      name: string;
    }
    _embedded: {
      venues: Array<{
        name: string;
        postalCode: string;
        url: string;
        city: {
          name: string;
        };
        country: {
          name: string;
        };
        address: {
          line1: string;
        };
        location: {
          longitude: string;
          latitude: string;
        };
      }>;
    };
  };
};


export type RootStackParamList = {
  Reservation: undefined;
  Reservations: undefined;
  ScheduleScreen:undefined;
  LandingPage:undefined;
  SpaBookingScreen:undefined;
  ReservationManagementScreen:undefined;
  SpaBookingManagementScreen:undefined;
  EmployeeSettingsScreen:undefined;
  MaintenanceScreen:undefined;
  HousekeepingView:undefined;
  SpaServiceDetail:{
    title: string;
    image: string;
    price: string;
    duration: string;
  };
  EventsScreen: { events: Event[] };
  EventDetail: { event: Event };
  GuestInformationCard:{
    guestName:string,
    roomName:string,
    companyName:string,
    checkIn:string,
    checkOut:string,
    status:string,
    notes:string,
    telephone:string,
    email:string,
    street:string,
    zipcode:string,
    city:string,
    country:string,
    totalAmount:string,
    openAmount:string,
    category:string,
    standardOccupancy:string,
    maxOccupancy:string,
    mealNotes:string,
    maidNotes:string,
    selfcheckout_enabled: Boolean,
    selfcheckout_url:string,
  }
  MenuScreen:undefined;
  CartScreen:undefined;
  CheckoutScreen:undefined;
  RoomCleanFrequencyScreen:undefined;
  HousekeepingScreen:undefined;
  OrderedList:undefined;
  SpaBookingsList:undefined;
  ConfirmCheckoutScreen:{ 
     roomNumber:string;
      firstName:string;
       lastName:string;
       address:string;
        note:string;
       };
  MenuItemDetailsScreen: {
      id: string;
    title: string;
    price: number;
    imageUrl: string;
    description?: string; // Optional
    ingredients?: string[]; // Optional
    category: string;
   };
  BookingScreen: {
    date: string;
    time: string;
    peopleCount: number;
    name: string;
    roomNumber: string;
  };
  TableReservationScreen:undefined;
  TableReservationsList:undefined;
  ConfirmationScreen: {
    reservationId: string;
  };
  RoomServiceOrderScreen:undefined;
  TaskListScreen:undefined;
  ShiftDetailScreen:{
    shiftId: string;
    role: string;
  };
  Chat: undefined;
  Dashboard: undefined;
  GuestDashboard:undefined;
  RequestRoomCleanScreen:undefined;
  Settings: undefined;
  Login: undefined; // Stellen Sie sicher, dass Sie diese Route hinzufügen
  Register: undefined; // Und diese Route, wenn Sie eine Registrierungsseite haben
  // ...andere Routen
};

// features/chat/types.ts
export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
}


