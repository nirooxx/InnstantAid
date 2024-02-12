import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase'; // Stelle sicher, dass der Pfad korrekt ist
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc,query, where } from 'firebase/firestore';
import { RootState } from '../store/store';

export interface TableReservation {
  id?: string;
  date: string;
  time: string;
  peopleCount: number;
  name: string;
  roomNumber: string;
  table: string;
  reservierung: string;
  userId: string;
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

const MAX_CAPACITY = 40;

// Fetch reservations
export const fetchReservations = createAsyncThunk('tableReservations/fetchReservations', async () => {
  const querySnapshot = await getDocs(collection(db, 'tableReservations'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as TableReservation }));
});

export const fetchGuestReservations = createAsyncThunk(
  'tableReservations/fetchReservations',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      // Erstelle eine Abfrage, die nach Reservierungen filtert, die der gegebenen userId entsprechen
      const reservationsQuery = query(collection(db, 'tableReservations'), where('userId', '==', userId));
      const querySnapshot = await getDocs(reservationsQuery);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as TableReservation }));
    } catch (error) {
      return rejectWithValue('Fehler beim Abrufen der Reservierungen: ' + error);
    }
  }
);

// Add a new reservation
export const addReservation = createAsyncThunk(
  'tableReservations/addReservation',
  async (newReservation: TableReservation, { getState, rejectWithValue }) => {
    try {
      // Hole den aktuellen Zustand der Anwendung
      const state = getState() as RootState;
      const reservations = state.tableReservation.reservations;
      // Berechne die Gesamtanzahl der bereits reservierten Plätze für das gewählte Datum und Uhrzeit
      const totalReserved = reservations.reduce((acc:any, curr:any) => {
        return curr.date === newReservation.date && curr.time === newReservation.time ? acc + curr.peopleCount : acc;
      }, 0);

      // Prüfe, ob die Kapazität überschritten wird
      if (totalReserved + newReservation.peopleCount > MAX_CAPACITY) {
        return rejectWithValue('Die maximale Kapazität wurde erreicht.');
      }

      // Füge die neue Reservierung hinzu, wenn die Kapazität nicht überschritten wird
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
      })
      .addCase(updateReservation.fulfilled, (state, action: PayloadAction<TableReservation>) => {
        const index = state.reservations.findIndex(reservation => reservation.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      });
      // Implementiere die Logik für updateReservation und deleteReservation
      // ...
  },
});

export default tableReservationSlice.reducer
