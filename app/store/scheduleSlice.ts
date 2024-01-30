import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from "../../firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

// Typdefinitionen
export type Shift = {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  employeeName: string;
  role: string;
};

export interface ScheduleState {
  shifts: Shift[];
  loading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  shifts: [],
  loading: false,
  error: null,
};

export const fetchShifts = createAsyncThunk(
    'schedule/fetchShifts',
    async (_, { rejectWithValue }) => {
      try {
        const q = query(collection(db, 'shifts'));
        const querySnapshot = await getDocs(q);
        let shifts: Shift[] = [];
        querySnapshot.forEach((doc) => {
          const shiftData = doc.data() as Shift;
          shifts.push({ ...shiftData, id: doc.id });
        });
        return shifts;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const createShift = createAsyncThunk(
    'schedule/createShift',
    async (shift: Omit<Shift, 'id'>, { rejectWithValue }) => { // 'id' aus Shift entfernt
      try {
        const docRef = doc(collection(db, 'shifts'));
        await setDoc(docRef, shift);
        return { ...shift, id: docRef.id };
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
  

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addShift: (state, action: PayloadAction<Shift>) => {
        const newShift = action.payload;
        // Stellen Sie sicher, dass 'id' eindeutig ist
        if (!state.shifts.some(shift => shift.id === newShift.id)) {
          state.shifts.push(newShift);
        } else {
          console.error("Shift mit ID bereits vorhanden");
        }
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.shifts.push(action.payload);
      })
      .addCase(createShift.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default scheduleSlice.reducer;
