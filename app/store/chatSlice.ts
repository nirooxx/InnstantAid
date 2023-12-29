// features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store/store"; // Importieren Sie AppThunk
import { RootState } from "../store/store";
import db from "../../firebase";
import { Message, ChatState } from "../routes/types";

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    },
  },
});

export const { setMessages, addMessage } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;

const convertFirestoreTimestampToDate = (firestoreTimestamp: any) => {
  return firestoreTimestamp.toDate();
};

export const subscribeToMessages = (): AppThunk<() => void> => (dispatch) => {
  const unsubscribe = db
    .collection("messages")
    .orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
        ...doc.data(),
      })) as Message[];
      dispatch(setMessages(messages));
    });

  // Rückgabe der Funktion, die das Abonnement aufhebt
  return () => unsubscribe();
};

export const sendMessage =
  (newMessage: Message): AppThunk =>
  async (dispatch, getState) => {
    // Assuming `getState` is a function to access the current state
    const userId = getState().user?.id || "default-user-id"; // Fallback to a default ID if not found

    const messageToSend = {
      ...newMessage,
      user: {
        ...newMessage.user,
        _id: userId, // Ensure this is not undefined
      },
      createdAt: new Date(), // Make sure this is also set properly
    };

    try {
      const docRef = await db.collection("messages").add(messageToSend);
      dispatch(addMessage({ ...messageToSend, _id: docRef.id }));
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

export default chatSlice.reducer;
