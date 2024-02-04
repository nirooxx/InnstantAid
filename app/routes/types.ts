// types.ts
export type RootStackParamList = {
  Reservation: undefined;
  Reservations: undefined;
  ScheduleScreen:undefined;
  SpaBookingScreen:undefined;
  TableReservationScreen:undefined;
  RoomServiceOrderScreen:undefined;
  TaskListScreen:undefined;
  ShiftDetailScreen:undefined;
  Chat: undefined;
  Dashboard: undefined;
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

export interface ChatState {
  messages: Message[];
}
