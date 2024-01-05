import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string;
  username: string;
  token: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  name: "",
  username: "",
  token: "",
  isLoading: false,
  error: null,
};

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
      action: PayloadAction<{ username: string; token: string }>
    ) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
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
      action: PayloadAction<{ username: string; token: string }>
    ) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.error = null;
    },
    registrationFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateUser,
  updateToken,
  setLoading,
  setError,
  clearUser,
  registrationStarted,
  registrationSucceeded,
  registrationFailed,
  loginStarted,
  loginSucceeded,
  loginFailed,
} = userSlice.actions;

export default userSlice.reducer;
