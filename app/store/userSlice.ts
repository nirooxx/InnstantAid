import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../../firebase"; // Importieren Sie auth aus Ihrer firebase.ts-Datei
import { collection, query, where , doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  roomNumber: string;
}

interface UserState {
  id: string;
  name: string;
  username: string;
  token: string;
  role: string;
  isLoading: boolean;
  error: string | null;
  roomNumber: string;

}

const initialState: UserState = {
  id: "",
  name: "",
  username: "",
  token: "",
  role: "",
  roomNumber: "",
  isLoading: false,
  error: null,

};

// Async Thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password, role, roomNumber  }: { email: string; password: string; role: string, roomNumber: string},
    { rejectWithValue }
  ) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password); // Geändert hier
      const token = await response.user.getIdToken();
      return { username: email, token, role , roomNumber };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    { email, password, role, roomNumber  }: { email: string; password: string; role: string, roomNumber: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // Geändert hier
      const token = await response.user.getIdToken();
      return { username: email, token, role, roomNumber  };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(
      state,
      action: PayloadAction<{ name: string; username: string; token: string }>
    ) {
      const { name, username, token } = action.payload;
      state.name = name;
      state.username = username;
      state.token = token;
    },
    updateToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearUser() {
      return initialState;
    },
    // Reducers for login and registration
    loginStarted(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSucceeded(
      state,
      action: PayloadAction<{ id: string; username: string; token: string; role: string; roomNumber: string; }>
    ) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.roomNumber = action.payload.roomNumber;
      state.id = action.payload.id;
      state.error = null;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    registrationStarted(state) {
      state.isLoading = true;
      state.error = null;
    },
    registrationSucceeded(
      state,
      action: PayloadAction<{id: string; username: string; token: string; role: string; roomNumber: string; }>
    ) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.roomNumber = action.payload.roomNumber;
      state.id = action.payload.id;
      state.error = null;
    },
    registrationFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.roomNumber = action.payload.roomNumber;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.roomNumber = action.payload.roomNumber;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateUser,
  updateToken,
  setLoading,
  setError,
  clearUser,
  loginStarted,
  loginSucceeded,
  loginFailed,
  registrationStarted,
  registrationSucceeded,
  registrationFailed,
} = userSlice.actions;

export default userSlice.reducer;
