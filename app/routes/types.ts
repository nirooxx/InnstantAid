// types.ts
export type RootStackParamList = {
  Reservations: undefined;
  ScheduleScreen:undefined;
  TaskListScreen:undefined;
  ShiftDetailScreen:undefined;
  BookingConfirmationPage: {
    title: string;
    date: string;
    time: string;
    price: string;
  };
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
