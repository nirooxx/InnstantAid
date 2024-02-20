// houseKeepingSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase'; // Der Pfad zu Ihrer Firebase-Konfiguration
import { collection, addDoc, deleteDoc, doc, getDocs, query } from 'firebase/firestore';

type CleanFrequencyOption = 'NONE' | 'DAILY' | 'EVERY_2_DAYS' | 'EVERY_3_DAYS' | 'OTHER';

interface RoomCleanRequest {
  id: string;
  roomNumber: string;
  userId: string;
  frequency: CleanFrequencyOption;
  date?: string; // optional, nur wenn 'ANOTHER_TIME' ausgewählt ist
  time?: string; // optional, nur wenn 'ANOTHER_TIME' ausgewählt ist
  notes: string;
}

interface MaintenanceRequest {
    id: string;
    roomNumber: string;
    userId: string;
  description: string;
  imageUri?: string; // optional, nur wenn ein Bild hochgeladen wurde
  notes: string;
}

interface HouseKeepingState {
  roomCleanRequests: RoomCleanRequest[];
  maintenanceRequests: MaintenanceRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HouseKeepingState = {
  roomCleanRequests: [],
  maintenanceRequests: [],
  status: 'idle',
  error: null,
};

// Asynchrone Thunks
export const submitRoomCleanRequest = createAsyncThunk(
  'houseKeeping/submitRoomCleanRequest',
  async (request: RoomCleanRequest, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'roomCleanRequests'), request);
      return { ...request, id: docRef.id };
    } catch (error) {
      return rejectWithValue('Failed to submit room clean request: ' + error);
    }
  }
);

export const submitMaintenanceRequest = createAsyncThunk(
  'houseKeeping/submitMaintenanceRequest',
  async (request: MaintenanceRequest, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'maintenanceRequests'), request);
      return { ...request, id: docRef.id };
    } catch (error) {
      return rejectWithValue('Failed to submit maintenance request: ' + error);
    }
  }
);

export const deleteRoomCleanRequest = createAsyncThunk(
    'houseKeeping/deleteRoomCleanRequest',
    async (requestId: string, { rejectWithValue }) => {
      try {
        await deleteDoc(doc(db, 'roomCleanRequests', requestId));
        return requestId; // Gibt die ID des gelöschten Dokuments zurück
      } catch (error) {
        return rejectWithValue('Failed to delete room clean request: ' + error);
      }
    }
  );
  
  export const deleteMaintenanceRequest = createAsyncThunk(
    'houseKeeping/deleteMaintenanceRequest',
    async (requestId: string, { rejectWithValue }) => {
      try {
        await deleteDoc(doc(db, 'maintenanceRequests', requestId));
        return requestId; // Gibt die ID des gelöschten Dokuments zurück
      } catch (error) {
        return rejectWithValue('Failed to delete maintenance request: ' + error);
      }
    }
  );

  // Asynchrone Thunks für das Abrufen von Daten
export const fetchRoomCleanRequests = createAsyncThunk(
    'houseKeeping/fetchRoomCleanRequests',
    async (_, { rejectWithValue }) => {
      try {
        const q = query(collection(db, 'roomCleanRequests'));
        const querySnapshot = await getDocs(q);
        const roomCleanRequests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<RoomCleanRequest, 'id'> ,
        }));
        return roomCleanRequests;
      } catch (error) {
        return rejectWithValue('Failed to fetch room clean requests: ' + error);
      }
    }
  );
  
  export const fetchMaintenanceRequests = createAsyncThunk<MaintenanceRequest[], void, { rejectValue: string }>(
    'houseKeeping/fetchMaintenanceRequests',
    async (_, { rejectWithValue }) => {
      try {
        const q = query(collection(db, 'maintenanceRequests'));
        const querySnapshot = await getDocs(q);
        const maintenanceRequests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<MaintenanceRequest, 'id'> // Stelle sicher, dass du den Typ korrekt umwandelst
        }));
        return maintenanceRequests as MaintenanceRequest[]; // Stelle sicher, dass der Rückgabetyp MaintenanceRequest[] ist
      } catch (error) {
        return rejectWithValue('Failed to fetch maintenance requests: ' + error);
      }
    }
  );
  

// Slice
export const houseKeepingSlice = createSlice({
  name: 'houseKeeping',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitRoomCleanRequest.fulfilled, (state, action: PayloadAction<RoomCleanRequest>) => {
        state.roomCleanRequests.push(action.payload);
      })
      .addCase(submitMaintenanceRequest.fulfilled, (state, action: PayloadAction<MaintenanceRequest>) => {
        state.maintenanceRequests.push(action.payload);
      }) .addCase(deleteRoomCleanRequest.fulfilled, (state, action: PayloadAction<string>) => {
        state.roomCleanRequests = state.roomCleanRequests.filter(request => request.id !== action.payload);
      })
      .addCase(deleteMaintenanceRequest.fulfilled, (state, action: PayloadAction<string>) => {
        state.maintenanceRequests = state.maintenanceRequests.filter(request => request.id !== action.payload);
      })
      .addCase(fetchRoomCleanRequests.fulfilled, (state, action: PayloadAction<RoomCleanRequest[]>) => {
        state.roomCleanRequests = action.payload;
      })
      .addCase(fetchMaintenanceRequests.fulfilled, (state, action: PayloadAction<MaintenanceRequest[]>) => {
        state.maintenanceRequests = action.payload;
      })
      
      // Sie können hier auch .pending und .rejected Fälle hinzufügen, um die Lade-/Fehlerzustände zu verwalten
  },
});

export default houseKeepingSlice.reducer;
