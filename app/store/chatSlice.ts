import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Message } from "../routes/types";
import { AppThunk, RootState } from "../store/store";

interface ChatState {
  messages: Message[];
  lastVisited: { [channelId: string]: number };
  guestMessages: { guestId: string; messages: Message[] }[];
  guests: { id: string; username: string }[];
}

const initialState: ChatState = {
  messages: [],
  lastVisited: {},
  guestMessages: [],
  guests: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetMessages: (state) => {
      state.messages = [];
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    },
    updateLastVisited: (state, action: PayloadAction<{ channelId: string; timestamp: number }>) => {
      const { channelId, timestamp } = action.payload;
      state.lastVisited[channelId] = timestamp;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatsForGuests.fulfilled, (state, action) => {
        state.guestMessages = action.payload;
      })
      .addCase(fetchAllGuests.fulfilled, (state, action) => {
        state.guests = action.payload;
      });
  }
});

export const { resetMessages, setMessages, addMessage, updateLastVisited } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;

const convertFirestoreTimestampToDate = (firestoreTimestamp: any) => {
  if (firestoreTimestamp && typeof firestoreTimestamp.toDate === 'function') {
    return firestoreTimestamp.toDate();
  } else {
    return new Date();
  }
};

export const subscribeToMessages = (userId: string, channelId: string): AppThunk<() => void> => (dispatch) => {
  const messagesQuery = query(
    collection(db, `channels/${userId}/channel/${channelId}/messages`),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      _id: doc.id,
      createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
      text: doc.data().text,
      user: doc.data().user,
    })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    dispatch(setMessages(messages));
  });

  return () => unsubscribe();
};



export const sendMessage = (userId: string, channelId: string, newMessage: Message): AppThunk => async (dispatch) => {
  try {
    await addDoc(collection(db, `channels/${userId}/channel/${channelId}/messages`), {
      ...newMessage,
      createdAt: serverTimestamp(),
    });
    dispatch(subscribeToMessages(userId, channelId)); // Neuladen der Nachrichten nach dem Senden
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};


export const fetchAllGuests = createAsyncThunk<any[], void, { rejectValue: string }>(
  'chat/fetchAllGuests',
  async (_, { rejectWithValue }) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "guest"));
      const querySnapshot = await getDocs(q);
      const guests: any[] = [];
      querySnapshot.forEach((doc) => {
        const guestData = doc.data() as Omit<any, 'id'>;
        guests.push({ id: doc.id, ...guestData });
      });
      return guests;
    } catch (error: any) {
      console.error("Error fetching guests:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatsForGuests = createAsyncThunk(
  'chat/fetchChatsForGuests',
  async ({ guests, channelId }: { guests: { id: string }[]; channelId: string }, { rejectWithValue }) => {
    try {
      const allGuestMessages: any[] = [];

      for (const guest of guests) {
        const messagesRef = collection(db, `channels/${guest.id}/channel/${channelId}/messages`);
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);

        const messages: Message[] = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        })) as Message[];

        allGuestMessages.push({ guestId: guest.id, messages });
      }

      return allGuestMessages;
    } catch (error: any) {
      console.error("Error fetching chats for guests:", error);
      return rejectWithValue(error.message);
    }
  }
);

export default chatSlice.reducer;
