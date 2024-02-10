// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import chatSlice from "./chatSlice";
import scheduleReducer from "./scheduleSlice";
import taskReducer from "./taskSlice";
import tableReservationReducer from "./tableReservationSlice"
import orderingReducer from "./orderingSlice";
import spaBookingReducer from './SpaBookingSlice';
// store.ts oder ein separater Typ-Definitionsfile
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
    schedule: scheduleReducer,
    task: taskReducer,
    tableReservation: tableReservationReducer,
    order: orderingReducer,
    spaBooking: spaBookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
