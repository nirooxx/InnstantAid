// features/tasks/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../screens/employee/tasks/models/Task';
import { db } from '../../firebase'; // Pfad an Ihre Firebase-Konfiguration anpassen
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async Thunk zum Abrufen von Aufgaben
export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      let tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const taskData = doc.data() as Task;
        tasks.push({...taskData, id: doc.id});
      });
      return tasks;
    } catch (error) {
      return rejectWithValue('Aufgaben konnten nicht geladen werden.');
    }
  }
);

// Async Thunk zum Erstellen einer neuen Aufgabe
export const createTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
  'tasks/createTask',
  async (task, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), task);
      return { ...task, id: docRef.id };
    } catch (error) {
      return rejectWithValue('Aufgabe konnte nicht erstellt werden.');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default taskSlice.reducer;
