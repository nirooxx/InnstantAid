// types.ts
export type RootStackParamList = {
  Reservations: undefined;
  BookingConfirmationPage: {
    title: string;
    date: string;
    time: string;
    price: string;
  };
  // Definieren Sie hier weitere Screens und deren Parameter
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
