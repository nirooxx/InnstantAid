// types.ts
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
  GuestInformationCard:{
    guestName:string,
    roomName:string,
    companyName:string,
    checkIn:string,
    checkOut:string,
    status:string,
    notes:string,
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


