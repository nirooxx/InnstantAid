import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  sendMessage,
  subscribeToMessages,
  selectMessages,
  resetMessages
} from '../../../store/chatSlice';
import { RootState, AppDispatch } from '../../../store/store';
import ChannelSelector from './components/ChannelSelector'; // Stellen Sie sicher, dass der Pfad korrekt ist

const ChatScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [channelId, setChannelId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);

  useEffect(() => {
    dispatch(resetMessages());
    let unsubscribe = () => {};
    if (userId && channelId) {
      unsubscribe = dispatch(subscribeToMessages(userId, channelId));
    }
    return () => unsubscribe(); // Diese Funktion wird aufgerufen, wenn die Komponente unmountet wird oder wenn sich userId/channelId ändert.
  }, [userId, channelId, dispatch]);
  

  const onSend = (messages: any[] = []) => {
    if (userId && channelId) {
      messages.forEach((message) => {
        dispatch(sendMessage(userId, channelId, {
          _id: message._id,
          text: message.text,
          createdAt: new Date(),
          user: message.user,
        }));
      });
    }
  };

  // Funktion, um zum Kanalauswahlbildschirm zurückzukehren
  const handleChannelExit = () => {
    setChannelId(null); // Setzt channelId zurück und zeigt den Kanalauswahlbildschirm an
  };

  if (!channelId) {
    return <ChannelSelector onSelectChannel={setChannelId} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Button title="Kanal wechseln" onPress={handleChannelExit} />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userId, // Die tatsächliche Benutzer-ID hier einfügen
          name: "Gast", // Optional: Benutzername einfügen
        }}
      />
    </View>
  );
};

export default ChatScreen;
