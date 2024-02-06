import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp ,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Message, ChatState } from "../routes/types";
import { AppThunk, RootState } from "../store/store";

const initialState: ChatState = {
  messages: [],
};

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



 

  
export default chatSlice.reducer;
