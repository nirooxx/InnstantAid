import { createSlice, PayloadAction, createAsyncThunk  } from "@reduxjs/toolkit";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp ,
  doc,
  where,
  getDocs, 
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { Message } from "../routes/types";
import { AppThunk, RootState } from "../store/store";

interface GuestMessages {
  guestId: string;
  messages: Message[];
}

interface ChatState {
  messages: Message[];
  channelUsers?: User[];
  guestMessages?: GuestMessages[]; // Hinzufügen der guestMessages Eigenschaft
  guests?: User[];
}

const initialState: ChatState = {
  messages: [],
  // Initialisieren von channelUsers als undefiniert oder leeres Array, je nach Vorliebe
  channelUsers: [],
  guestMessages: [],
  guests:[]
};

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  roomNumber: string;
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetMessages: (state) => {
      state.messages = [];
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      // Filtern Sie Duplikate heraus, indem Sie sicherstellen, dass nur eindeutige _id's hinzugefügt werden
      const uniqueMessages = action.payload.filter((newMessage) =>
        !state.messages.some((existingMessage) => existingMessage._id === newMessage._id)
      );
      state.messages = [...state.messages, ...uniqueMessages];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Stellen Sie sicher, dass die Nachricht nicht bereits vorhanden ist, bevor Sie sie hinzufügen
      if (!state.messages.find((message) => message._id === action.payload._id)) {
        state.messages.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchChatsForGuests.fulfilled, (state, action) => {
      // Speichern der abgerufenen Nachrichten für jeden Gast
      state.guestMessages = action.payload;
    })
    .addCase(fetchChatsForGuests.pending, (state) => {
      // Optional: Zustand für Ladezustand setzen, z.B. state.loading = true;
    })
    .addCase(fetchChatsForGuests.rejected, (state, action) => {
      // Fehlerbehandlung, z.B. Zustand für Fehler setzen
      console.error("Failed to fetch chats for guests:", action.error.message);
    })
    .addCase(fetchAllGuests.pending, (state) => {
      // Optional: Zustand für Ladezustand setzen
    })
    .addCase(fetchAllGuests.fulfilled, (state, action) => {
      // Speichern der abgerufenen Gäste
      state.guests = action.payload;
    })
    .addCase(fetchAllGuests.rejected, (state, action) => {
      // Fehlerbehandlung
      console.error("Failed to fetch all guests:", action.error.message);
    });
  }
  
});

export const { resetMessages, setMessages, addMessage } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;

const convertFirestoreTimestampToDate = (firestoreTimestamp: any) => {
  // Überprüfen, ob firestoreTimestamp existiert und die Methode toDate hat
  if (firestoreTimestamp && typeof firestoreTimestamp.toDate === 'function') {
    return firestoreTimestamp.toDate();
  } else {
    // Fallback-Wert, falls kein gültiger Timestamp vorhanden ist
    return new Date();
  }
};


// Anpassen, um channelId zu akzeptieren
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
    })) as Message[];
    dispatch(setMessages(messages));
  });

  return () => {
    unsubscribe();
  };
};


// Anpassen, um channelId zu akzeptieren
export const sendMessage =
  (userId: string, channelId: string, newMessage: Message): AppThunk =>
  async (dispatch) => {
    try {
      await addDoc(collection(db, `channels/${userId}/channel/${channelId}/messages`), {
        ...newMessage,
        createdAt: serverTimestamp(), // Verwenden Sie serverTimestamp für den createdAt-Wert
      });
      // Kein Dispatch notwendig, wenn onSnapshot aktiv ist, da es automatisch neue Nachrichten hinzufügt
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  export const fetchAllGuests = createAsyncThunk<User[], void, { rejectValue: string }>(
    'chat/fetchAllGuests',
    async (_, { rejectWithValue }) => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "guest"));
        const querySnapshot = await getDocs(q);
        const guests: User[] = [];
        querySnapshot.forEach((doc) => {
          // Stellen Sie sicher, dass die Datenstruktur in Firestore den erwarteten Eigenschaften entspricht
          const guestData = doc.data() as Omit<User, 'id'>; // Typumwandlung, um sicherzustellen, dass die Daten dem User-Typ entsprechen
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
    async ({ guests, channelId }: { guests: { id: string }[]; channelId: string }, { dispatch, rejectWithValue }) => {
      try {
        const allGuestMessages: GuestMessages[] = [];
  
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
