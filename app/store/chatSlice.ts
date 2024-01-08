import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
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
  const messagesQuery = query(
    collection(db, "messages"),
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

  // Return the unsubscribe function
  return () => {
    unsubscribe();
  };
};

export const sendMessage =
  (newMessage: Message): AppThunk =>
  async (dispatch, getState) => {
    const userId = getState().user?.id || "default-user-id"; // Use a default ID if not found

    const messageToSend = {
      ...newMessage,
      user: {
        ...newMessage.user,
        _id: userId, // Ensure this is not undefined
      },
      createdAt: new Date(), // Make sure this is also set properly
    };

    try {
      const docRef = await addDoc(collection(db, "messages"), messageToSend);
      dispatch(addMessage({ ...messageToSend, _id: docRef.id }));
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

export default chatSlice.reducer;
