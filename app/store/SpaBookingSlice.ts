import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase'; // Pfad anpassen
import { RootState } from './store';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';

export interface SpaBooking {
  id?: string; // Optional, da beim Erstellen eines neuen Dokuments noch keine ID vorhanden ist
  userId: string;
  title: string;
  price: string;
  duration: string;
  time:string;
  date: string;
  name: string;
  email: string;
  userRoomNumber: string;
}

interface SpaBookingState {
  bookings: SpaBooking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SpaBookingState = {
  bookings: [],
  status: 'idle',
  error: null,
};

export const updateSpaBooking = createAsyncThunk(
  'spaBooking/updateSpaBooking',
  async (updatedBooking: SpaBooking, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = updatedBooking;
      if (!id) throw new Error('Booking ID missing');
      const docRef = doc(db, 'spaBookings', id);
      await updateDoc(docRef, updateData);
      return updatedBooking;
    } catch (error) {
      return rejectWithValue('Failed to update booking: ' + error);
    }
  }
);

export const addSpaBooking = createAsyncThunk(
  'spaBooking/addSpaBooking',
  async (newBooking: SpaBooking, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'spaBookings'), newBooking);
      return { id: docRef.id, ...newBooking };
    } catch (error) {
      return rejectWithValue('Failed to add booking: ' + error);
    }
  }
);

export const fetchAllSpaBookings = createAsyncThunk(
  'spaBooking/fetchAllSpaBookings',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'spaBookings'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as SpaBooking }));
    } catch (error) {
      return rejectWithValue('Failed to fetch bookings: ' + error);
    }
  }
);

export const fetchUserSpaBookings = createAsyncThunk(
  'spaBooking/fetchUserSpaBookings',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'spaBookings'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as SpaBooking }));
    } catch (error) {
      return rejectWithValue('Failed to fetch user bookings: ' + error);
    }
  }
);

export const cancelSpaBooking = createAsyncThunk(
  'spaBooking/cancelSpaBooking',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'spaBookings', bookingId));
      return bookingId;
    } catch (error) {
      return rejectWithValue('Failed to cancel booking: ' + error);
    }
  }
);

const spaBookingSlice = createSlice({
  name: 'spaBooking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllSpaBookings.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchAllSpaBookings.fulfilled, (state, action: PayloadAction<SpaBooking[]>) => {
      state.status = 'succeeded';
      state.bookings = action.payload;
    })
    .addCase(fetchAllSpaBookings.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || null;
    })
    .addCase(fetchUserSpaBookings.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchUserSpaBookings.fulfilled, (state, action: PayloadAction<SpaBooking[]>) => {
      state.status = 'succeeded';
      // Hier würden Sie sicherstellen, dass nur die Buchungen des aktuellen Benutzers aktualisiert werden
      state.bookings = action.payload;
    })
    .addCase(fetchUserSpaBookings.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || null;
    })
    .addCase(addSpaBooking.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addSpaBooking.fulfilled, (state, action: PayloadAction<SpaBooking>) => {
      state.status = 'succeeded';
      state.bookings.push(action.payload);
    })
    .addCase(addSpaBooking.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || null;
    })
    .addCase(cancelSpaBooking.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(cancelSpaBooking.fulfilled, (state, action: PayloadAction<string>) => {
      state.status = 'succeeded';
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    })
    .addCase(cancelSpaBooking.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || null;
    })
    .addCase(updateSpaBooking.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(updateSpaBooking.fulfilled, (state, action: PayloadAction<SpaBooking>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      state.status = 'succeeded';
    })
    .addCase(updateSpaBooking.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || null;
    });
  },
});

export default spaBookingSlice.reducer;
