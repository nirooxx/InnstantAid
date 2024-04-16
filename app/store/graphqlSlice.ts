// store/graphqlSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../graphql/apolloClient'; // Import the Apollo client
import { GET_RESERVATIONS, GET_ROOM_STAYS } from '../graphql/queries'; // Import the query

// Assuming you have defined the types for your data somewhere in your project
import { Reservation, ReservationsResponse, RoomStay, RoomStayFilter, RoomStaysResponse} from '../graphql/schemas/types';

interface GraphqlState {
  reservations: Reservation[];
  roomStays: RoomStay[];
  loading: boolean;
  error: string | null;
}

// Anfangszustand
const initialState: GraphqlState = {
  reservations: [],
  roomStays: [],
  loading: false,
  error: null,
};

// Async Thunk Aktion, um Reservierungen zu laden
export const fetchReservations = createAsyncThunk(
  'graphql/fetchReservations',
  async (variables: { first: number, after?: string }, { rejectWithValue }) => {
    try {
      const { data } = await client.query<ReservationsResponse>({
        query: GET_RESERVATIONS,
        variables: variables,
      });
     
      return data.reservations.edges.map((edge:any) => edge.node);
    } catch (error:any) {
        console.log(error.message)
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Async Thunk for fetching room stays
export const fetchRoomStays = createAsyncThunk(
  'graphql/fetchRoomStays',
  async (variables: { filter?: RoomStayFilter, first?: number, after?: string, last?: number, before?: string }, { rejectWithValue }) => {
    try {
      const { data } = await client.query<RoomStaysResponse>({
        query: GET_ROOM_STAYS,
        variables,
      });
      return data.room_stays.edges.map((edge:any) => edge.node); // Assuming your API returns an array of edges
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred fetching room stays');
    }
  }
);

const graphqlSlice = createSlice({
  name: 'graphql',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReservations.fulfilled, (state, action: PayloadAction<Reservation[]>) => {
        state.reservations = action.payload;
        state.loading = false;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Cast the payload to a string, as it's an error message
      })
      .addCase(fetchRoomStays.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoomStays.fulfilled, (state, action: PayloadAction<RoomStay[]>) => {
        state.roomStays = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoomStays.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch room stays';
        state.loading = false;
      });
  },
});

export default graphqlSlice.reducer;
