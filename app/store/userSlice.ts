import { createSlice } from "@reduxjs/toolkit";

import db from "../../firebase";

const initialState = {
  name: "",
  username: "",
  token: "",
  registrationStatus: "idle", // new state for tracking registration status
  loginStatus: "idle", // new state for tracking login status
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action) {
      const { name, username, token } = action.payload;
      state.name = name;
      state.username = username;
      state.token = token;
    },
    updateToken(state, action) {
      state.token = action.payload.token;
    },
    clearUser() {
      return initialState;
    },
    // new reducer for starting registration
    registrationStarted(state) {
      state.registrationStatus = "loading";
    },
    // new reducer for successful registration
    registrationSucceeded(state, action) {
      state.registrationStatus = "succeeded";
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    // new reducer for failed registration
    registrationFailed(state) {
      state.registrationStatus = "failed";
    },
    // Reducers for login
    loginStarted(state) {
      state.loginStatus = "loading";
    },
    loginSucceeded(state, action) {
      state.loginStatus = "succeeded";
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    loginFailed(state) {
      state.loginStatus = "failed";
    },
  },
});

export const {
  updateUser,
  updateToken,
  clearUser,
  registrationStarted,
  registrationSucceeded,
  registrationFailed,
  loginStarted,
  loginSucceeded,
  loginFailed,
} = userSlice.actions;

export default userSlice.reducer;
