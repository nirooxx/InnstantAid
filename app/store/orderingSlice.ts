import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase'; // Pfad anpassen
import { RootState } from './store';
import { collection, addDoc, deleteDoc , doc, getDocs } from 'firebase/firestore';

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  // Stellen Sie sicher, dass alle optionalen Eigenschaften hier sind, falls vorhanden.
  category?: string;
  description?: string;
}

interface Order {
  id:string
  cartItems: CartItem[];
  roomNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  note:string;
  userId:string;
  orderDate:string;
  // Weitere Eigenschaften von Order...
}

interface OrderingState {
  currentOrder: Order | null;
  orderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  orders: Order[],
  guestOrders: Order[],
  error: string | null;
}

const initialState: OrderingState = {
  currentOrder: null,
  orderStatus: 'idle',
  orders: [], // Array für alle Bestellungen#
  guestOrders: [],
  error: null,
};

export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (orderData: Omit<Order, 'id'>, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      // Geben Sie das Order-Objekt mit der hinzugefügten id zurück.
      return { id: docRef.id, ...orderData };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// AsyncThunk für das Abrufen aller Bestellungen
export const fetchOrders = createAsyncThunk<Order[], void, { state: RootState, rejectValue: string }>(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      let orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        // Stellen Sie sicher, dass der Typ des Order-Objekts korrekt ist.
        // Verwenden Sie eine Type Assertion, um TypeScript mitzuteilen, dass das Objekt vom Typ Order ist.
        const orderData = doc.data() as Omit<Order, 'id'>;
        orders.push({ id: doc.id, ...orderData });
      });
      return orders; // Gibt ein Array von Bestellungen zurück
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

// AsyncThunk für das Abrufen aller Bestellungen eines Gastes
export const fetchGuestOrders = createAsyncThunk<Order[], string, { state: RootState, rejectValue: string }>(
  'orders/fetchGuestOrders',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      let guestOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data() as Omit<Order, 'id'>;
        // Prüfen Sie, ob die userId der Bestellung mit der übergebenen userId übereinstimmt
        if(orderData.userId === userId) {
          guestOrders.push({ id: doc.id, ...orderData });
        }
      });
      return guestOrders; // Gibt ein Array von Bestellungen des Gastes zurück
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);


// AsyncThunk für das Stornieren einer Bestellung
export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId: string, { rejectWithValue }) => {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        return orderId; // Gebe die ID der stornierten Bestellung zurück
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const orderingSlice = createSlice({
  name: 'ordering',
  initialState,
  reducers: {
    resetOrder(state) {
      state.currentOrder = null;
      state.orderStatus = 'idle';
      state.error = null;
    },
    // Weitere Reducer können hier hinzugefügt werden...
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.orderStatus = 'loading';
      })
      .addCase(submitOrder.fulfilled, (state, action: PayloadAction<{ id: string } & Order>) => {
        state.orderStatus = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.orderStatus = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.orderStatus = 'loading';
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.orderStatus = 'idle';
        state.currentOrder = null; // Setze die aktuelle Bestellung zurück
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.orderStatus = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.orderStatus = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orderStatus = 'succeeded';
        state.orders = action.payload; // Speichern Sie die abgerufenen Bestellungen im Zustand
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orderStatus = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchGuestOrders.pending, (state) => {
        state.orderStatus = 'loading';
      })
      .addCase(fetchGuestOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orderStatus = 'succeeded';
        // Speichern Sie die abgerufenen Bestellungen des Gastes im Zustand
        state.guestOrders = action.payload;
      })
      .addCase(fetchGuestOrders.rejected, (state, action) => {
        state.orderStatus = 'failed';
        state.error = action.error.message || null;
      });
    // Weitere Cases für andere Asyncthunks können hier hinzugefügt werden...
  },
});

export const { resetOrder } = orderingSlice.actions;

export default orderingSlice.reducer;
