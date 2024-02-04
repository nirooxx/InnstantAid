import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase'; // Stelle sicher, dass der Pfad korrekt ist
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface TableReservation {
  id?: string;
  date: string;
  time: string;
  peopleCount: number;
  name: string;
  roomNumber: string;
}

interface TableReservationState {
  reservations: TableReservation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TableReservationState = {
  reservations: [],
  status: 'idle',
  error: null,
};

// Fetch reservations
export const fetchReservations = createAsyncThunk('tableReservations/fetchReservations', async () => {
  const querySnapshot = await getDocs(collection(db, 'tableReservations'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as TableReservation }));
});

// Add a new reservation
export const addReservation = createAsyncThunk(
    'tableReservations/addReservation',
    async (newReservation: TableReservation, { rejectWithValue }) => {
      try {
        const docRef = await addDoc(collection(db, 'tableReservations'), newReservation);
        return { id: docRef.id, ...newReservation };
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
  

// Update a reservation
export const updateReservation = createAsyncThunk('tableReservations/updateReservation', async (updatedReservation: TableReservation) => {
  const { id, ...data } = updatedReservation;
  const docRef = doc(db, 'tableReservations', id!);
  await updateDoc(docRef, data);
  return updatedReservation; // Beinhaltet die ID
});

// Delete a reservation
export const deleteReservation = createAsyncThunk(
    'tableReservations/deleteReservation',
    async (reservationId: string, { rejectWithValue }) => {
      try {
        const docRef = doc(db, 'tableReservations', reservationId);
        console.log(docRef)
        await deleteDoc(docRef);
        return reservationId;
      } catch (error) {
        // Hier fangen wir den Fehler ab und geben ihn zurück.
        return rejectWithValue(error);
      }
    }
  );

const tableReservationSlice = createSlice({
  name: 'tableReservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action: PayloadAction<TableReservation[]>) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addReservation.fulfilled, (state, action: PayloadAction<TableReservation>) => {
        state.reservations.push(action.payload);
      })
      .addCase(deleteReservation.fulfilled, (state, action: PayloadAction<string>) => {
        state.reservations = state.reservations.filter(reservation => reservation.id !== action.payload);
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
      // Implementiere die Logik für updateReservation und deleteReservation
      // ...
  },
});

export const { reducer } = tableReservationSlice;
