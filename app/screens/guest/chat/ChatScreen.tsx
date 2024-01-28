// features/chat/ChatScreen.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";
import {
  sendMessage,
  subscribeToMessages,
  selectMessages,
} from "../../../store/chatSlice";
import { RootState, AppDispatch } from "../../../store/store";

const ChatScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToMessages());

    return () => {
      unsubscribe(); // Diese Zeile sollte nun korrekt funktionieren
    };
  }, [dispatch]);

  const onSend = (messages: any[] = []) => {
    messages.forEach((message) => {
      dispatch(sendMessage(message));
    });
  };

  const uniqueMessages = messages.reduce((unique: any, item: any) => {
    return unique.find((msg: any) => msg._id === item._id)
      ? unique
      : [...unique, item];
  }, []);

  return (
    <GiftedChat
      key={uniqueMessages._id}
      messages={uniqueMessages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: uniqueMessages._id, // Der ID Ihres Benutzers
        name: "Benutzername", // Der Name Ihres Benutzers
      }}
    />
  );
};

export default ChatScreen;
