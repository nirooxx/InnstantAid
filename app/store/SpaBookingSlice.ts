// SpaBookingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface SpaBooking {
    id: string;
    userId: string; 
    title: string;
    price: string;
    duration: string;
    date: string;
    name: string;
    email: string;
    userRoomNumber: string;
}

interface SpaBookingState {
  bookings: SpaBooking[];
}

const initialState: SpaBookingState = {
  bookings: [],
};

export const selectUserBookings = (state: RootState, userId: string) =>
  state.spaBooking.bookings.filter((booking) => booking.userId === userId);

export const spaBookingSlice = createSlice({
  name: 'spaBooking',
  initialState,
  reducers: {
    bookSpa: (state, action: PayloadAction<SpaBooking>) => {
      state.bookings.push(action.payload);
    },
    cancelSpaBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
    // Optional: Weitere Aktionen wie das Abrufen von Buchungen könnten hier hinzugefügt werden
  },
});

// Aktionen exportieren
export const { bookSpa, cancelSpaBooking } = spaBookingSlice.actions;

// Selektoren
export const selectAllBookings = (state: RootState) => state.spaBooking.bookings;

// Reducer exportieren
export default spaBookingSlice.reducer;
